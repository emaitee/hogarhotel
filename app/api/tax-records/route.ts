import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import TaxRecord from "@/lib/models/TaxRecord"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const taxType = searchParams.get("taxType")
    const status = searchParams.get("status")
    const period = searchParams.get("period")

    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}
    if (taxType) filter.taxType = taxType
    if (status) filter.status = status
    if (period) filter.period = { $regex: period, $options: "i" }

    // Check for overdue records and update status
    await TaxRecord.updateMany(
      {
        status: { $in: ["pending", "filed"] },
        dueDate: { $lt: new Date() },
      },
      { status: "overdue" },
    )

    const [taxRecords, total] = await Promise.all([
      TaxRecord.find(filter).sort({ dueDate: -1 }).skip(skip).limit(limit).lean(),
      TaxRecord.countDocuments(filter),
    ])

    return NextResponse.json({
      taxRecords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching tax records:", error)
    return NextResponse.json({ error: "Failed to fetch tax records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { taxType, period, taxableAmount, taxRate, dueDate, reference, notes, createdBy = "system" } = body

    // Validate required fields
    if (!taxType || !period || !taxableAmount || !taxRate || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const taxRecord = new TaxRecord({
      taxType,
      period,
      taxableAmount,
      taxRate,
      dueDate: new Date(dueDate),
      reference,
      notes,
      createdBy,
    })

    await taxRecord.save()

    return NextResponse.json(taxRecord, { status: 201 })
  } catch (error) {
    console.error("Error creating tax record:", error)
    return NextResponse.json({ error: "Failed to create tax record" }, { status: 500 })
  }
}

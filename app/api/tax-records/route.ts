import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import TaxRecord from "@/lib/models/TaxRecord"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const taxType = searchParams.get("taxType")

    // Build filter
    const filter: any = {}
    if (status) filter.status = status
    if (taxType) filter.taxType = taxType

    // Check for overdue records and update status
    await TaxRecord.updateMany(
      {
        status: { $in: ["pending", "filed"] },
        dueDate: { $lt: new Date() },
      },
      { status: "overdue" },
    )

    const skip = (page - 1) * limit

    const [taxRecords, total] = await Promise.all([
      TaxRecord.find(filter).sort({ dueDate: -1 }).skip(skip).limit(limit).lean(),
      TaxRecord.countDocuments(filter),
    ])

    return NextResponse.json({
      success: true,
      data: taxRecords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching tax records:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tax records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { taxType, period, startDate, endDate, dueDate, amount, description, reference } = body

    // Validate required fields
    if (!taxType || !period || !startDate || !endDate || !dueDate || amount === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json({ success: false, error: "Start date must be before end date" }, { status: 400 })
    }

    // Create new tax record
    const taxRecord = new TaxRecord({
      taxType,
      period,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      dueDate: new Date(dueDate),
      amount: Number.parseFloat(amount),
      description,
      reference,
      status: new Date(dueDate) < new Date() ? "overdue" : "pending",
    })

    await taxRecord.save()

    return NextResponse.json(
      {
        success: true,
        data: taxRecord,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating tax record:", error)
    return NextResponse.json({ success: false, error: "Failed to create tax record" }, { status: 500 })
  }
}

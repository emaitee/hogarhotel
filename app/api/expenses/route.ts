import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Expense from "@/lib/models/Expense"
import TransactionCategory from "@/lib/models/TransactionCategory"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const vendor = searchParams.get("vendor")
    const categoryId = searchParams.get("categoryId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}
    if (status) filter.status = status
    if (vendor) filter.vendor = { $regex: vendor, $options: "i" }
    if (categoryId) filter.categoryId = categoryId
    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate) filter.date.$lte = new Date(endDate)
    }

    const [expenses, total] = await Promise.all([
      Expense.find(filter).populate("categoryId", "name color type").sort({ date: -1 }).skip(skip).limit(limit).lean(),
      Expense.countDocuments(filter),
    ])

    return NextResponse.json({
      expenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const {
      date,
      vendor,
      description,
      categoryId,
      amount,
      paymentMethod,
      reference,
      notes,
      createdBy = "system",
    } = body

    // Validate required fields
    if (!vendor || !description || !categoryId || !amount || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify category exists
    const category = await TransactionCategory.findById(categoryId)
    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    const expense = new Expense({
      date: date || new Date(),
      vendor,
      description,
      categoryId,
      amount,
      paymentMethod,
      reference,
      notes,
      createdBy,
    })

    await expense.save()
    await expense.populate("categoryId", "name color type")

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 })
  }
}

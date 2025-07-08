import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Budget from "@/lib/models/Budget"
import TransactionCategory from "@/lib/models/TransactionCategory"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const year = searchParams.get("year")
    const status = searchParams.get("status")
    const period = searchParams.get("period")

    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}
    if (year) filter.year = Number.parseInt(year)
    if (status) filter.status = status
    if (period) filter.period = period

    const [budgets, total] = await Promise.all([
      Budget.find(filter)
        .populate("categories.categoryId", "name color type")
        .sort({ year: -1, month: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Budget.countDocuments(filter),
    ])

    return NextResponse.json({
      budgets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, year, month, period, categories, createdBy = "system" } = body

    // Validate required fields
    if (!name || !year || !period || !categories || categories.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate categories exist
    const categoryIds = categories.map((cat: any) => cat.categoryId)
    const existingCategories = await TransactionCategory.find({
      _id: { $in: categoryIds },
    })

    if (existingCategories.length !== categoryIds.length) {
      return NextResponse.json({ error: "One or more categories do not exist" }, { status: 400 })
    }

    const budget = new Budget({
      name,
      year,
      month,
      period,
      categories,
      createdBy,
    })

    await budget.save()
    await budget.populate("categories.categoryId", "name color type")

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    console.error("Error creating budget:", error)
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 })
  }
}

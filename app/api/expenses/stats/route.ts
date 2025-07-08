import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Expense from "@/lib/models/Expense"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build date filter
    const dateFilter: any = {}
    if (startDate || endDate) {
      dateFilter.date = {}
      if (startDate) dateFilter.date.$gte = new Date(startDate)
      if (endDate) dateFilter.date.$lte = new Date(endDate)
    }

    const [totalStats, statusStats, categoryStats, monthlyStats] = await Promise.all([
      // Total expenses
      Expense.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
            avgAmount: { $avg: "$amount" },
          },
        },
      ]),

      // By status
      Expense.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$status",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),

      // By category
      Expense.aggregate([
        { $match: dateFilter },
        {
          $lookup: {
            from: "transactioncategories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: "$categoryInfo" },
        {
          $group: {
            _id: "$category",
            name: { $first: "$categoryInfo.name" },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),

      // Monthly trend
      Expense.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ])

    return NextResponse.json({
      total: totalStats[0] || { totalAmount: 0, count: 0, avgAmount: 0 },
      byStatus: statusStats,
      byCategory: categoryStats,
      monthlyTrend: monthlyStats,
    })
  } catch (error) {
    console.error("Error fetching expense stats:", error)
    return NextResponse.json({ error: "Failed to fetch expense statistics" }, { status: 500 })
  }
}

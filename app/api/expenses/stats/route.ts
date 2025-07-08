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

    // Get expense statistics
    const [totalStats, statusStats, categoryStats, monthlyStats] = await Promise.all([
      // Total expenses by status
      Expense.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            total: { $sum: "$amount" },
          },
        },
      ]),

      // Status breakdown
      Expense.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
            approved: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
            paid: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] } },
            rejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
            totalAmount: { $sum: "$amount" },
            paidAmount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] } },
          },
        },
      ]),

      // Category breakdown
      Expense.aggregate([
        { $match: dateFilter },
        {
          $lookup: {
            from: "transactioncategories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $group: {
            _id: "$categoryId",
            name: { $first: "$category.name" },
            color: { $first: "$category.color" },
            count: { $sum: 1 },
            total: { $sum: "$amount" },
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
            count: { $sum: 1 },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ])

    // Calculate summary
    const summary = {
      totalExpenses: 0,
      paidExpenses: 0,
      pendingExpenses: 0,
      approvedExpenses: 0,
      rejectedExpenses: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
    }

    totalStats.forEach((stat) => {
      switch (stat._id) {
        case "pending":
          summary.pendingExpenses = stat.count
          summary.pendingAmount = stat.total
          break
        case "approved":
          summary.approvedExpenses = stat.count
          break
        case "paid":
          summary.paidExpenses = stat.count
          summary.paidAmount = stat.total
          break
        case "rejected":
          summary.rejectedExpenses = stat.count
          break
      }
      summary.totalExpenses += stat.count
      summary.totalAmount += stat.total
    })

    return NextResponse.json({
      summary,
      statusBreakdown: statusStats[0] || {},
      categoryBreakdown: categoryStats,
      monthlyTrend: monthlyStats,
    })
  } catch (error) {
    console.error("Error fetching expense stats:", error)
    return NextResponse.json({ error: "Failed to fetch expense statistics" }, { status: 500 })
  }
}

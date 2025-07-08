import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Transaction from "@/lib/models/Transaction"
import Account from "@/lib/models/Account"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "monthly"
    const year = Number.parseInt(searchParams.get("year") || new Date().getFullYear().toString())
    const month = searchParams.get("month") ? Number.parseInt(searchParams.get("month")!) : new Date().getMonth() + 1

    // Calculate date ranges
    let startDate: Date, endDate: Date, prevStartDate: Date, prevEndDate: Date

    if (period === "monthly") {
      startDate = new Date(year, month - 1, 1)
      endDate = new Date(year, month, 0)
      prevStartDate = new Date(year, month - 2, 1)
      prevEndDate = new Date(year, month - 1, 0)
    } else if (period === "quarterly") {
      const quarter = Math.ceil(month / 3)
      startDate = new Date(year, (quarter - 1) * 3, 1)
      endDate = new Date(year, quarter * 3, 0)
      prevStartDate = new Date(year, (quarter - 2) * 3, 1)
      prevEndDate = new Date(year, (quarter - 1) * 3, 0)
    } else {
      startDate = new Date(year, 0, 1)
      endDate = new Date(year, 11, 31)
      prevStartDate = new Date(year - 1, 0, 1)
      prevEndDate = new Date(year - 1, 11, 31)
    }

    const [currentRevenue, currentExpenses, previousRevenue, previousExpenses, cashFlow, recentActivity] =
      await Promise.all([
        // Current period revenue
        Transaction.aggregate([
          {
            $lookup: {
              from: "accounts",
              localField: "accountId",
              foreignField: "_id",
              as: "account",
            },
          },
          {
            $unwind: "$account",
          },
          {
            $match: {
              date: { $gte: startDate, $lte: endDate },
              "account.type": "revenue",
              type: "credit",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]),

        // Current period expenses
        Transaction.aggregate([
          {
            $lookup: {
              from: "accounts",
              localField: "accountId",
              foreignField: "_id",
              as: "account",
            },
          },
          {
            $unwind: "$account",
          },
          {
            $match: {
              date: { $gte: startDate, $lte: endDate },
              "account.type": "expense",
              type: "debit",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]),

        // Previous period revenue
        Transaction.aggregate([
          {
            $lookup: {
              from: "accounts",
              localField: "accountId",
              foreignField: "_id",
              as: "account",
            },
          },
          {
            $unwind: "$account",
          },
          {
            $match: {
              date: { $gte: prevStartDate, $lte: prevEndDate },
              "account.type": "revenue",
              type: "credit",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]),

        // Previous period expenses
        Transaction.aggregate([
          {
            $lookup: {
              from: "accounts",
              localField: "accountId",
              foreignField: "_id",
              as: "account",
            },
          },
          {
            $unwind: "$account",
          },
          {
            $match: {
              date: { $gte: prevStartDate, $lte: prevEndDate },
              "account.type": "expense",
              type: "debit",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]),

        // Cash flow (current cash and bank balances)
        Account.aggregate([
          {
            $match: {
              type: "asset",
              category: { $in: ["cash", "bank"] },
              isActive: true,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$balance" },
            },
          },
        ]),

        // Recent activity (last 7 days)
        Transaction.aggregate([
          {
            $match: {
              date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
          },
          {
            $lookup: {
              from: "accounts",
              localField: "accountId",
              foreignField: "_id",
              as: "account",
            },
          },
          {
            $unwind: "$account",
          },
          {
            $sort: { date: -1 },
          },
          {
            $limit: 10,
          },
          {
            $project: {
              date: 1,
              description: 1,
              reference: 1,
              amount: 1,
              type: 1,
              account: {
                name: 1,
                type: 1,
              },
            },
          },
        ]),
      ])

    // Calculate metrics
    const revenue = currentRevenue[0]?.total || 0
    const expenses = currentExpenses[0]?.total || 0
    const profit = revenue - expenses
    const cash = cashFlow[0]?.total || 0

    const prevRevenue = previousRevenue[0]?.total || 0
    const prevExpenses = previousExpenses[0]?.total || 0
    const prevProfit = prevRevenue - prevExpenses

    // Calculate growth percentages
    const revenueGrowth = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0
    const expenseGrowth = prevExpenses > 0 ? ((expenses - prevExpenses) / prevExpenses) * 100 : 0
    const profitGrowth = prevProfit !== 0 ? ((profit - prevProfit) / Math.abs(prevProfit)) * 100 : 0

    return NextResponse.json({
      metrics: {
        revenue: {
          current: revenue,
          previous: prevRevenue,
          growth: revenueGrowth,
        },
        expenses: {
          current: expenses,
          previous: prevExpenses,
          growth: expenseGrowth,
        },
        profit: {
          current: profit,
          previous: prevProfit,
          growth: profitGrowth,
        },
        cashFlow: {
          current: cash,
          growth: 0, // Cash flow growth would need historical data
        },
      },
      recentActivity,
      period: {
        type: period,
        startDate,
        endDate,
      },
    })
  } catch (error) {
    console.error("Error fetching accounting dashboard:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Transaction from "@/lib/models/Transaction"
import Account from "@/lib/models/Account"
import Expense from "@/lib/models/Expense"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "monthly"
    const year = Number.parseInt(searchParams.get("year") || new Date().getFullYear().toString())
    const month = searchParams.get("month") ? Number.parseInt(searchParams.get("month")) : new Date().getMonth() + 1

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
      // yearly
      startDate = new Date(year, 0, 1)
      endDate = new Date(year, 11, 31)
      prevStartDate = new Date(year - 1, 0, 1)
      prevEndDate = new Date(year - 1, 11, 31)
    }

    // Get revenue accounts
    const revenueAccounts = await Account.find({ type: "revenue" }).select("_id").lean()
    const revenueAccountIds = revenueAccounts.map((acc) => acc._id)

    // Get expense accounts
    const expenseAccounts = await Account.find({ type: "expense" }).select("_id").lean()
    const expenseAccountIds = expenseAccounts.map((acc) => acc._id)

    // Get cash accounts for cash flow
    const cashAccounts = await Account.find({
      $or: [{ name: { $regex: /cash/i } }, { name: { $regex: /bank/i } }],
    })
      .select("_id balance")
      .lean()

    // Current period calculations
    const [currentRevenue, currentExpenses, prevRevenue, prevExpenses, recentTransactions] = await Promise.all([
      // Current period revenue
      Transaction.aggregate([
        {
          $match: {
            accountId: { $in: revenueAccountIds },
            date: { $gte: startDate, $lte: endDate },
            status: "posted",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $cond: [{ $eq: ["$type", "credit"] }, "$amount", { $multiply: ["$amount", -1] }],
              },
            },
          },
        },
      ]),

      // Current period expenses
      Expense.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
            status: "paid",
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
          $match: {
            accountId: { $in: revenueAccountIds },
            date: { $gte: prevStartDate, $lte: prevEndDate },
            status: "posted",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $cond: [{ $eq: ["$type", "credit"] }, "$amount", { $multiply: ["$amount", -1] }],
              },
            },
          },
        },
      ]),

      // Previous period expenses
      Expense.aggregate([
        {
          $match: {
            date: { $gte: prevStartDate, $lte: prevEndDate },
            status: "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),

      // Recent transactions (last 7 days)
      Transaction.find({
        date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        status: "posted",
      })
        .populate("accountId", "name type")
        .sort({ date: -1 })
        .limit(10)
        .lean(),
    ])

    // Calculate metrics
    const revenue = currentRevenue[0]?.total || 0
    const expenses = currentExpenses[0]?.total || 0
    const profit = revenue - expenses
    const cashFlow = cashAccounts.reduce((sum, acc) => sum + acc.balance, 0)

    const prevRevenueTotal = prevRevenue[0]?.total || 0
    const prevExpensesTotal = prevExpenses[0]?.total || 0
    const prevProfit = prevRevenueTotal - prevExpensesTotal

    // Calculate growth percentages
    const revenueGrowth = prevRevenueTotal > 0 ? ((revenue - prevRevenueTotal) / prevRevenueTotal) * 100 : 0
    const expenseGrowth = prevExpensesTotal > 0 ? ((expenses - prevExpensesTotal) / prevExpensesTotal) * 100 : 0
    const profitGrowth = prevProfit !== 0 ? ((profit - prevProfit) / Math.abs(prevProfit)) * 100 : 0

    return NextResponse.json({
      metrics: {
        revenue: {
          current: revenue,
          previous: prevRevenueTotal,
          growth: revenueGrowth,
        },
        expenses: {
          current: expenses,
          previous: prevExpensesTotal,
          growth: expenseGrowth,
        },
        profit: {
          current: profit,
          previous: prevProfit,
          growth: profitGrowth,
        },
        cashFlow: {
          current: cashFlow,
          accounts: cashAccounts.length,
        },
      },
      recentActivity: recentTransactions.map((transaction) => ({
        id: transaction._id,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        account: transaction.accountId?.name || "Unknown",
        accountType: transaction.accountId?.type || "unknown",
        reference: transaction.reference,
      })),
      period: {
        type: period,
        startDate,
        endDate,
        year,
        month: period === "monthly" ? month : undefined,
      },
    })
  } catch (error) {
    console.error("Error fetching accounting dashboard:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

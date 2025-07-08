import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Transaction from "@/lib/models/Transaction"
import Account from "@/lib/models/Account"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month" // month, quarter, year
    const year = Number.parseInt(searchParams.get("year") || new Date().getFullYear().toString())
    const month = Number.parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString())

    // Calculate date ranges
    let startDate: Date
    let endDate: Date
    let previousStartDate: Date
    let previousEndDate: Date

    if (period === "month") {
      startDate = new Date(year, month - 1, 1)
      endDate = new Date(year, month, 0, 23, 59, 59)
      previousStartDate = new Date(year, month - 2, 1)
      previousEndDate = new Date(year, month - 1, 0, 23, 59, 59)
    } else if (period === "quarter") {
      const quarterStart = Math.floor((month - 1) / 3) * 3
      startDate = new Date(year, quarterStart, 1)
      endDate = new Date(year, quarterStart + 3, 0, 23, 59, 59)
      previousStartDate = new Date(year, quarterStart - 3, 1)
      previousEndDate = new Date(year, quarterStart, 0, 23, 59, 59)
    } else {
      startDate = new Date(year, 0, 1)
      endDate = new Date(year, 11, 31, 23, 59, 59)
      previousStartDate = new Date(year - 1, 0, 1)
      previousEndDate = new Date(year - 1, 11, 31, 23, 59, 59)
    }

    // Get revenue accounts (type: revenue)
    const revenueAccounts = await Account.find({ type: "revenue" }).select("_id")
    const revenueAccountIds = revenueAccounts.map((acc) => acc._id)

    // Get expense accounts (type: expense)
    const expenseAccounts = await Account.find({ type: "expense" }).select("_id")
    const expenseAccountIds = expenseAccounts.map((acc) => acc._id)

    // Get cash accounts (current assets)
    const cashAccounts = await Account.find({
      type: "asset",
      category: "Current Assets",
      name: { $regex: /(cash|bank)/i },
    }).select("_id balance")

    // Calculate current period revenue
    const currentRevenue = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: "Posted",
          "entries.accountId": { $in: revenueAccountIds },
        },
      },
      {
        $unwind: "$entries",
      },
      {
        $match: {
          "entries.accountId": { $in: revenueAccountIds },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$entries.credit" },
        },
      },
    ])

    // Calculate previous period revenue
    const previousRevenue = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: previousStartDate, $lte: previousEndDate },
          status: "Posted",
          "entries.accountId": { $in: revenueAccountIds },
        },
      },
      {
        $unwind: "$entries",
      },
      {
        $match: {
          "entries.accountId": { $in: revenueAccountIds },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$entries.credit" },
        },
      },
    ])

    // Calculate current period expenses
    const currentExpenses = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: "Posted",
          "entries.accountId": { $in: expenseAccountIds },
        },
      },
      {
        $unwind: "$entries",
      },
      {
        $match: {
          "entries.accountId": { $in: expenseAccountIds },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$entries.debit" },
        },
      },
    ])

    // Calculate previous period expenses
    const previousExpenses = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: previousStartDate, $lte: previousEndDate },
          status: "Posted",
          "entries.accountId": { $in: expenseAccountIds },
        },
      },
      {
        $unwind: "$entries",
      },
      {
        $match: {
          "entries.accountId": { $in: expenseAccountIds },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$entries.debit" },
        },
      },
    ])

    // Get recent transactions
    const recentTransactions = await Transaction.find({
      status: "Posted",
      date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
    })
      .populate("entries.accountId", "name type")
      .sort({ date: -1 })
      .limit(10)

    // Calculate totals
    const currentRevenueTotal = currentRevenue[0]?.total || 0
    const previousRevenueTotal = previousRevenue[0]?.total || 0
    const currentExpensesTotal = currentExpenses[0]?.total || 0
    const previousExpensesTotal = previousExpenses[0]?.total || 0

    const currentProfit = currentRevenueTotal - currentExpensesTotal
    const previousProfit = previousRevenueTotal - previousExpensesTotal

    const totalCashFlow = cashAccounts.reduce((sum, account) => sum + (account.balance || 0), 0)

    // Calculate growth percentages
    const revenueGrowth =
      previousRevenueTotal > 0 ? ((currentRevenueTotal - previousRevenueTotal) / previousRevenueTotal) * 100 : 0

    const expensesGrowth =
      previousExpensesTotal > 0 ? ((currentExpensesTotal - previousExpensesTotal) / previousExpensesTotal) * 100 : 0

    const profitGrowth = previousProfit !== 0 ? ((currentProfit - previousProfit) / Math.abs(previousProfit)) * 100 : 0

    // Format recent activity
    const recentActivity = recentTransactions.map((transaction) => {
      const revenueEntry = transaction.entries.find((entry) =>
        revenueAccountIds.some((id) => id.equals(entry.accountId._id)),
      )
      const expenseEntry = transaction.entries.find((entry) =>
        expenseAccountIds.some((id) => id.equals(entry.accountId._id)),
      )

      let type = "neutral"
      let amount = 0
      let accountName = ""

      if (revenueEntry) {
        type = "revenue"
        amount = revenueEntry.credit
        accountName = revenueEntry.accountId.name
      } else if (expenseEntry) {
        type = "expense"
        amount = expenseEntry.debit
        accountName = expenseEntry.accountId.name
      }

      return {
        id: transaction._id,
        description: transaction.description,
        reference: transaction.reference,
        amount,
        type,
        accountName,
        date: transaction.date,
        createdAt: transaction.createdAt,
      }
    })

    const summary = {
      revenue: {
        current: currentRevenueTotal,
        previous: previousRevenueTotal,
        growth: revenueGrowth,
      },
      expenses: {
        current: currentExpensesTotal,
        previous: previousExpensesTotal,
        growth: expensesGrowth,
      },
      profit: {
        current: currentProfit,
        previous: previousProfit,
        growth: profitGrowth,
      },
      cashFlow: {
        current: totalCashFlow,
        previous: totalCashFlow, // For now, using current as we don't track historical balances
        growth: 0,
      },
      recentActivity,
      period: {
        type: period,
        startDate,
        endDate,
        year,
        month,
      },
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Error fetching accounting dashboard:", error)
    return NextResponse.json({ error: "Failed to fetch accounting dashboard data" }, { status: 500 })
  }
}

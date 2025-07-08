import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import FinancialReport from "@/lib/models/FinancialReport"
import Transaction from "@/lib/models/Transaction"
import Expense from "@/lib/models/Expense"
import Account from "@/lib/models/Account"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const type = searchParams.get("type")

    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}
    if (type) filter.type = type

    const [reports, total] = await Promise.all([
      FinancialReport.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      FinancialReport.countDocuments(filter),
    ])

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, type, startDate, endDate, generatedBy = "system" } = body

    // Validate required fields
    if (!name || !type || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Generate report data based on type
    let reportData: any = {}
    let summary: any = {}

    switch (type) {
      case "profit-loss":
        reportData = await generateProfitLossReport(start, end)
        summary = {
          totalRevenue: reportData.revenue?.total || 0,
          totalExpenses: reportData.expenses?.total || 0,
          netProfit: (reportData.revenue?.total || 0) - (reportData.expenses?.total || 0),
          profitMargin:
            reportData.revenue?.total > 0
              ? (((reportData.revenue?.total || 0) - (reportData.expenses?.total || 0)) /
                  (reportData.revenue?.total || 0)) *
                100
              : 0,
        }
        break

      case "balance-sheet":
        reportData = await generateBalanceSheetReport(start, end)
        break

      case "cash-flow":
        reportData = await generateCashFlowReport(start, end)
        break

      case "revenue-analysis":
        reportData = await generateRevenueAnalysisReport(start, end)
        summary.totalRevenue = reportData.total || 0
        break

      case "expense-analysis":
        reportData = await generateExpenseAnalysisReport(start, end)
        summary.totalExpenses = reportData.total || 0
        break

      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
    }

    const report = new FinancialReport({
      name,
      type,
      period: { startDate: start, endDate: end },
      data: reportData,
      summary,
      status: "completed",
      generatedBy,
    })

    await report.save()

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}

// Helper functions for report generation
async function generateProfitLossReport(startDate: Date, endDate: Date) {
  const [revenueAccounts, expenseAccounts, transactions, expenses] = await Promise.all([
    Account.find({ type: "revenue" }).lean(),
    Account.find({ type: "expense" }).lean(),
    Transaction.find({
      date: { $gte: startDate, $lte: endDate },
      status: "posted",
    })
      .populate("accountId categoryId")
      .lean(),
    Expense.find({
      date: { $gte: startDate, $lte: endDate },
      status: "paid",
    })
      .populate("categoryId")
      .lean(),
  ])

  // Calculate revenue
  const revenueByCategory: any = {}
  let totalRevenue = 0

  transactions.forEach((transaction) => {
    if (transaction.accountId?.type === "revenue") {
      const categoryName = transaction.categoryId?.name || "Other"
      if (!revenueByCategory[categoryName]) {
        revenueByCategory[categoryName] = 0
      }
      revenueByCategory[categoryName] += transaction.type === "credit" ? transaction.amount : -transaction.amount
      totalRevenue += transaction.type === "credit" ? transaction.amount : -transaction.amount
    }
  })

  // Calculate expenses
  const expenseByCategory: any = {}
  let totalExpenses = 0

  expenses.forEach((expense) => {
    const categoryName = expense.categoryId?.name || "Other"
    if (!expenseByCategory[categoryName]) {
      expenseByCategory[categoryName] = 0
    }
    expenseByCategory[categoryName] += expense.amount
    totalExpenses += expense.amount
  })

  return {
    revenue: {
      total: totalRevenue,
      byCategory: revenueByCategory,
    },
    expenses: {
      total: totalExpenses,
      byCategory: expenseByCategory,
    },
    profit: {
      gross: totalRevenue - totalExpenses,
      net: totalRevenue - totalExpenses,
      margin: totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0,
    },
  }
}

async function generateBalanceSheetReport(startDate: Date, endDate: Date) {
  const accounts = await Account.find().lean()

  const balanceSheet: any = {
    assets: { total: 0, accounts: [] },
    liabilities: { total: 0, accounts: [] },
    equity: { total: 0, accounts: [] },
  }

  accounts.forEach((account) => {
    const accountData = {
      name: account.name,
      code: account.code,
      balance: account.balance,
    }

    switch (account.type) {
      case "asset":
        balanceSheet.assets.accounts.push(accountData)
        balanceSheet.assets.total += account.balance
        break
      case "liability":
        balanceSheet.liabilities.accounts.push(accountData)
        balanceSheet.liabilities.total += account.balance
        break
      case "equity":
        balanceSheet.equity.accounts.push(accountData)
        balanceSheet.equity.total += account.balance
        break
    }
  })

  return balanceSheet
}

async function generateCashFlowReport(startDate: Date, endDate: Date) {
  const transactions = await Transaction.find({
    date: { $gte: startDate, $lte: endDate },
    status: "posted",
  })
    .populate("accountId")
    .lean()

  let cashInflow = 0
  let cashOutflow = 0

  transactions.forEach((transaction) => {
    if (transaction.accountId?.type === "asset" && transaction.accountId?.name.toLowerCase().includes("cash")) {
      if (transaction.type === "debit") {
        cashInflow += transaction.amount
      } else {
        cashOutflow += transaction.amount
      }
    }
  })

  return {
    inflow: cashInflow,
    outflow: cashOutflow,
    net: cashInflow - cashOutflow,
  }
}

async function generateRevenueAnalysisReport(startDate: Date, endDate: Date) {
  const transactions = await Transaction.find({
    date: { $gte: startDate, $lte: endDate },
    status: "posted",
  })
    .populate("accountId categoryId")
    .lean()

  const revenueData: any = {}
  let total = 0

  transactions.forEach((transaction) => {
    if (transaction.accountId?.type === "revenue") {
      const categoryName = transaction.categoryId?.name || "Other"
      if (!revenueData[categoryName]) {
        revenueData[categoryName] = 0
      }
      const amount = transaction.type === "credit" ? transaction.amount : -transaction.amount
      revenueData[categoryName] += amount
      total += amount
    }
  })

  return { total, byCategory: revenueData }
}

async function generateExpenseAnalysisReport(startDate: Date, endDate: Date) {
  const expenses = await Expense.find({
    date: { $gte: startDate, $lte: endDate },
    status: "paid",
  })
    .populate("categoryId")
    .lean()

  const expenseData: any = {}
  let total = 0

  expenses.forEach((expense) => {
    const categoryName = expense.categoryId?.name || "Other"
    if (!expenseData[categoryName]) {
      expenseData[categoryName] = 0
    }
    expenseData[categoryName] += expense.amount
    total += expense.amount
  })

  return { total, byCategory: expenseData }
}

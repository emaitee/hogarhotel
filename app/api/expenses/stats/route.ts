import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Expense from "@/lib/models/Expense"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const year = Number.parseInt(searchParams.get("year") || new Date().getFullYear().toString())
    const month = searchParams.get("month") ? Number.parseInt(searchParams.get("month")!) : null

    // Build date filter
    const startDate = month ? new Date(year, month - 1, 1) : new Date(year, 0, 1)
    const endDate = month ? new Date(year, month, 0) : new Date(year, 11, 31)

    const [totalExpenses, pendingExpenses, approvedExpenses, paidExpenses, expensesByCategory, monthlyExpenses] =
      await Promise.all([
        // Total expenses
        Expense.aggregate([
          {
            $match: {
              date: { $gte: startDate, $lte: endDate },
              status: { $in: ["approved", "paid"] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
        ]),

        // Pending expenses
        Expense.aggregate([
          {
            $match: {
              date: { $gte: startDate, $lte: endDate },
              status: "pending",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
        ]),

        // Approved expenses
        Expense.aggregate([
          {
            $match: {
              date: { $gte: startDate, $lte: endDate },
              status: "approved",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
        ]),

        // Paid expenses
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
              count: { $sum: 1 },
            },
          },
        ]),

        // Expenses by category
        Expense.aggregate([
          {
            $match: {
              date: { $gte: startDate, $lte: endDate },
              status: { $in: ["approved", "paid"] },
            },
          },
          {
            $lookup: {
              from: "transactioncategories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: "$category",
          },
          {
            $group: {
              _id: "$categoryId",
              name: { $first: "$category.name" },
              color: { $first: "$category.color" },
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { total: -1 },
          },
        ]),

        // Monthly expenses (for trend)
        Expense.aggregate([
          {
            $match: {
              date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) },
              status: { $in: ["approved", "paid"] },
            },
          },
          {
            $group: {
              _id: { $month: "$date" },
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ]),
      ])

    return NextResponse.json({
      total: totalExpenses[0] || { total: 0, count: 0 },
      pending: pendingExpenses[0] || { total: 0, count: 0 },
      approved: approvedExpenses[0] || { total: 0, count: 0 },
      paid: paidExpenses[0] || { total: 0, count: 0 },
      byCategory: expensesByCategory,
      monthly: monthlyExpenses,
    })
  } catch (error) {
    console.error("Error fetching expense stats:", error)
    return NextResponse.json({ error: "Failed to fetch expense stats" }, { status: 500 })
  }
}

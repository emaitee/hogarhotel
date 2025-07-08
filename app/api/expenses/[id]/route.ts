import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Expense from "@/lib/models/Expense"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const expense = await Expense.findById(params.id).populate("category", "name type color").lean()

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Error fetching expense:", error)
    return NextResponse.json({ error: "Failed to fetch expense" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const body = await request.json()
    const { status, approvedBy } = body

    const updateData: any = { ...body }

    // Handle status changes
    if (status === "approved" && !updateData.approvedAt) {
      updateData.approvedAt = new Date()
      if (approvedBy) updateData.approvedBy = approvedBy
    } else if (status === "paid" && !updateData.paidAt) {
      updateData.paidAt = new Date()
    }

    const expense = await Expense.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true })
      .populate("category", "name type color")
      .lean()

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Error updating expense:", error)
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const expense = await Expense.findByIdAndDelete(params.id)

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Expense deleted successfully" })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 })
  }
}

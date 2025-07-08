import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Budget from "@/lib/models/Budget"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const budget = await Budget.findById(params.id).populate("categories.categoryId", "name color type").lean()

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }

    return NextResponse.json(budget)
  } catch (error) {
    console.error("Error fetching budget:", error)
    return NextResponse.json({ error: "Failed to fetch budget" }, { status: 500 })
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
    }

    const budget = await Budget.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true }).populate(
      "categories.categoryId",
      "name color type",
    )

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }

    return NextResponse.json(budget)
  } catch (error) {
    console.error("Error updating budget:", error)
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const budget = await Budget.findByIdAndDelete(params.id)

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Budget deleted successfully" })
  } catch (error) {
    console.error("Error deleting budget:", error)
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 })
  }
}

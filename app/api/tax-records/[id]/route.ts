import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import TaxRecord from "@/lib/models/TaxRecord"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid tax record ID" }, { status: 400 })
    }

    const taxRecord = await TaxRecord.findById(params.id).lean()

    if (!taxRecord) {
      return NextResponse.json({ success: false, error: "Tax record not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: taxRecord,
    })
  } catch (error) {
    console.error("Error fetching tax record:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tax record" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid tax record ID" }, { status: 400 })
    }

    const body = await request.json()
    const { taxType, period, startDate, endDate, dueDate, amount, status, description, reference, notes } = body

    // Validate dates if provided
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json({ success: false, error: "Start date must be before end date" }, { status: 400 })
    }

    const updateData: any = {}
    if (taxType) updateData.taxType = taxType
    if (period) updateData.period = period
    if (startDate) updateData.startDate = new Date(startDate)
    if (endDate) updateData.endDate = new Date(endDate)
    if (dueDate) updateData.dueDate = new Date(dueDate)
    if (amount !== undefined) updateData.amount = Number.parseFloat(amount)
    if (status) {
      updateData.status = status
      if (status === "filed" && !updateData.filedDate) {
        updateData.filedDate = new Date()
      }
      if (status === "paid" && !updateData.paidDate) {
        updateData.paidDate = new Date()
      }
    }
    if (description !== undefined) updateData.description = description
    if (reference !== undefined) updateData.reference = reference
    if (notes !== undefined) updateData.notes = notes

    const taxRecord = await TaxRecord.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    }).lean()

    if (!taxRecord) {
      return NextResponse.json({ success: false, error: "Tax record not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: taxRecord,
    })
  } catch (error) {
    console.error("Error updating tax record:", error)
    return NextResponse.json({ success: false, error: "Failed to update tax record" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid tax record ID" }, { status: 400 })
    }

    const taxRecord = await TaxRecord.findByIdAndDelete(params.id).lean()

    if (!taxRecord) {
      return NextResponse.json({ success: false, error: "Tax record not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Tax record deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting tax record:", error)
    return NextResponse.json({ success: false, error: "Failed to delete tax record" }, { status: 500 })
  }
}

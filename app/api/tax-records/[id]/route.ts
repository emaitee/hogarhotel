import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import TaxRecord from "@/lib/models/TaxRecord"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const taxRecord = await TaxRecord.findById(params.id).lean()

    if (!taxRecord) {
      return NextResponse.json({ error: "Tax record not found" }, { status: 404 })
    }

    return NextResponse.json(taxRecord)
  } catch (error) {
    console.error("Error fetching tax record:", error)
    return NextResponse.json({ error: "Failed to fetch tax record" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const body = await request.json()
    const { status, filedBy } = body

    const updateData: any = { ...body }

    // Handle status changes
    if (status === "filed" && !updateData.filedDate) {
      updateData.filedDate = new Date()
      if (filedBy) updateData.filedBy = filedBy
    } else if (status === "paid" && !updateData.paidDate) {
      updateData.paidDate = new Date()
    }

    const taxRecord = await TaxRecord.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true })

    if (!taxRecord) {
      return NextResponse.json({ error: "Tax record not found" }, { status: 404 })
    }

    return NextResponse.json(taxRecord)
  } catch (error) {
    console.error("Error updating tax record:", error)
    return NextResponse.json({ error: "Failed to update tax record" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const taxRecord = await TaxRecord.findByIdAndDelete(params.id)

    if (!taxRecord) {
      return NextResponse.json({ error: "Tax record not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Tax record deleted successfully" })
  } catch (error) {
    console.error("Error deleting tax record:", error)
    return NextResponse.json({ error: "Failed to delete tax record" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { UpdateBillData } from "@/lib/models/Bill"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    const bill = await db
      .collection("bills")
      .aggregate([
        {
          $match: { _id: new ObjectId(params.id) },
        },
        {
          $lookup: {
            from: "reservations",
            localField: "reservationId",
            foreignField: "_id",
            as: "reservation",
          },
        },
        {
          $lookup: {
            from: "guests",
            localField: "guestId",
            foreignField: "_id",
            as: "guest",
          },
        },
        {
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "room",
          },
        },
        {
          $unwind: "$reservation",
        },
        {
          $unwind: "$guest",
        },
        {
          $unwind: "$room",
        },
      ])
      .toArray()

    if (bill.length === 0) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    return NextResponse.json(bill[0])
  } catch (error) {
    console.error("Error fetching bill:", error)
    return NextResponse.json({ error: "Failed to fetch bill" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data: UpdateBillData = await request.json()
    const { db } = await connectToDatabase()

    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    }

    // Recalculate totals if items are updated
    if (data.items) {
      const subtotal = data.items.reduce((sum, item) => sum + item.total, 0)
      const tax = subtotal * 0.1
      const total = subtotal + tax

      updateData.items = data.items.map((item) => ({
        ...item,
        _id: new ObjectId(),
      }))
      updateData.subtotal = subtotal
      updateData.tax = tax
      updateData.total = total
    }

    const result = await db.collection("bills").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Bill updated successfully" })
  } catch (error) {
    console.error("Error updating bill:", error)
    return NextResponse.json({ error: "Failed to update bill" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("bills").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Bill deleted successfully" })
  } catch (error) {
    console.error("Error deleting bill:", error)
    return NextResponse.json({ error: "Failed to delete bill" }, { status: 500 })
  }
}

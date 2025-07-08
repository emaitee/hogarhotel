import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Bill, CreateBillData } from "@/lib/models/Bill"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const bills = await db
      .collection("bills")
      .aggregate([
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
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray()

    return NextResponse.json(bills)
  } catch (error) {
    console.error("Error fetching bills:", error)
    return NextResponse.json({ error: "Failed to fetch bills" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateBillData = await request.json()
    const { db } = await connectToDatabase()

    // Get reservation details
    const reservation = await db.collection("reservations").findOne({
      _id: new ObjectId(data.reservationId),
    })

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + tax

    // Generate bill number
    const billCount = await db.collection("bills").countDocuments()
    const billNumber = `BILL-${String(billCount + 1).padStart(6, "0")}`

    const newBill: Omit<Bill, "_id"> = {
      billNumber,
      reservationId: new ObjectId(data.reservationId),
      guestId: reservation.guestId,
      roomId: reservation.roomId,
      items: data.items.map((item) => ({
        ...item,
        _id: new ObjectId(),
      })),
      subtotal,
      tax,
      total,
      status: "pending",
      dueDate: data.dueDate,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("bills").insertOne(newBill)

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...newBill,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating bill:", error)
    return NextResponse.json({ error: "Failed to create bill" }, { status: 500 })
  }
}

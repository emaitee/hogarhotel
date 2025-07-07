import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { UpdateReservationData } from "@/lib/models/Reservation"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    const reservation = await db
      .collection("reservations")
      .aggregate([
        { $match: { _id: new ObjectId(params.id) } },
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
        { $unwind: "$guest" },
        { $unwind: "$room" },
      ])
      .toArray()

    if (reservation.length === 0) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json(reservation[0])
  } catch (error) {
    console.error("Error fetching reservation:", error)
    return NextResponse.json({ error: "Failed to fetch reservation" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const data: UpdateReservationData = await request.json()

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection("reservations").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    // Get updated reservation with populated data
    const updatedReservation = await db
      .collection("reservations")
      .aggregate([
        { $match: { _id: new ObjectId(params.id) } },
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
        { $unwind: "$guest" },
        { $unwind: "$room" },
      ])
      .toArray()

    return NextResponse.json(updatedReservation[0])
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("reservations").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Reservation deleted successfully" })
  } catch (error) {
    console.error("Error deleting reservation:", error)
    return NextResponse.json({ error: "Failed to delete reservation" }, { status: 500 })
  }
}

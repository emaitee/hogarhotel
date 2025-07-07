import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    // Get the reservation
    const reservation = await db.collection("reservations").findOne({ _id: new ObjectId(params.id) })

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    if (reservation.status !== "confirmed") {
      return NextResponse.json({ error: "Reservation is not in confirmed status" }, { status: 400 })
    }

    // Start transaction
    const session = db.client.startSession()

    try {
      await session.withTransaction(async () => {
        // Update reservation status
        await db.collection("reservations").updateOne(
          { _id: new ObjectId(params.id) },
          {
            $set: {
              status: "checked-in",
              updatedAt: new Date(),
            },
          },
          { session },
        )

        // Update room status
        await db.collection("rooms").updateOne(
          { _id: reservation.roomId },
          {
            $set: {
              status: "occupied",
              updatedAt: new Date(),
            },
          },
          { session },
        )

        // Update guest stats
        await db.collection("guests").updateOne(
          { _id: reservation.guestId },
          {
            $inc: {
              totalStays: 1,
              totalSpent: reservation.totalAmount,
            },
            $set: {
              updatedAt: new Date(),
            },
          },
          { session },
        )
      })

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

      return NextResponse.json({
        message: "Check-in successful",
        reservation: updatedReservation[0],
      })
    } finally {
      await session.endSession()
    }
  } catch (error) {
    console.error("Error processing check-in:", error)
    return NextResponse.json({ error: "Failed to process check-in" }, { status: 500 })
  }
}

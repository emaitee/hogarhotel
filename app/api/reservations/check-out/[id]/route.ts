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

    if (reservation.status !== "checked-in") {
      return NextResponse.json({ error: "Reservation is not in checked-in status" }, { status: 400 })
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
              status: "checked-out",
              updatedAt: new Date(),
            },
          },
          { session },
        )

        // Update room status to cleaning
        await db.collection("rooms").updateOne(
          { _id: reservation.roomId },
          {
            $set: {
              status: "cleaning",
              updatedAt: new Date(),
            },
          },
          { session },
        )

        // Create housekeeping task
        await db.collection("housekeeping_tasks").insertOne(
          {
            roomId: reservation.roomId,
            taskType: "cleaning",
            status: "pending",
            priority: "high",
            notes: "Post-checkout cleaning",
            createdAt: new Date(),
            updatedAt: new Date(),
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
        message: "Check-out successful",
        reservation: updatedReservation[0],
      })
    } finally {
      await session.endSession()
    }
  } catch (error) {
    console.error("Error processing check-out:", error)
    return NextResponse.json({ error: "Failed to process check-out" }, { status: 500 })
  }
}

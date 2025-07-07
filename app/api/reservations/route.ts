import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Reservation, CreateReservationData } from "@/lib/models/Reservation"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get reservations with populated guest and room data
    const reservations = await db
      .collection("reservations")
      .aggregate([
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
          $unwind: "$guest",
        },
        {
          $unwind: "$room",
        },
      ])
      .toArray()

    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const data: CreateReservationData = await request.json()

    // Validate guest exists
    const guest = await db.collection("guests").findOne({ _id: new ObjectId(data.guestId) })
    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 400 })
    }

    // Validate room exists and is available
    const room = await db.collection("rooms").findOne({ _id: new ObjectId(data.roomId) })
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 400 })
    }

    // Check for conflicting reservations
    const conflictingReservation = await db.collection("reservations").findOne({
      roomId: new ObjectId(data.roomId),
      status: { $in: ["confirmed", "checked-in"] },
      $or: [
        {
          checkInDate: { $lte: new Date(data.checkOutDate) },
          checkOutDate: { $gte: new Date(data.checkInDate) },
        },
      ],
    })

    if (conflictingReservation) {
      return NextResponse.json({ error: "Room is not available for the selected dates" }, { status: 400 })
    }

    // Calculate total amount
    const checkIn = new Date(data.checkInDate)
    const checkOut = new Date(data.checkOutDate)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    const totalAmount = nights * room.price

    const reservation: Omit<Reservation, "_id"> = {
      guestId: new ObjectId(data.guestId),
      roomId: new ObjectId(data.roomId),
      checkInDate: new Date(data.checkInDate),
      checkOutDate: new Date(data.checkOutDate),
      status: "confirmed",
      totalAmount,
      specialRequests: data.specialRequests,
      adults: data.adults,
      children: data.children,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("reservations").insertOne(reservation)

    // Get the created reservation with populated data
    const newReservation = await db
      .collection("reservations")
      .aggregate([
        { $match: { _id: result.insertedId } },
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

    return NextResponse.json(newReservation[0], { status: 201 })
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 })
  }
}

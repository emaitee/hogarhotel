import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Room, UpdateRoomData } from "@/lib/models/Room"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const room = await db.collection<Room>("rooms").findOne({ _id: new ObjectId(params.id) })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error("Error fetching room:", error)
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const data: UpdateRoomData = await request.json()

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db.collection<Room>("rooms").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const updatedRoom = await db.collection<Room>("rooms").findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json(updatedRoom)
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    // Check if room has active reservations
    const activeReservations = await db.collection("reservations").findOne({
      roomId: new ObjectId(params.id),
      status: { $in: ["confirmed", "checked-in"] },
    })

    if (activeReservations) {
      return NextResponse.json({ error: "Cannot delete room with active reservations" }, { status: 400 })
    }

    const result = await db.collection<Room>("rooms").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Room deleted successfully" })
  } catch (error) {
    console.error("Error deleting room:", error)
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Room, CreateRoomData } from "@/lib/models/Room"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const rooms = await db.collection<Room>("rooms").find({}).toArray()

    return NextResponse.json(rooms)
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const data: CreateRoomData = await request.json()

    // Check if room number already exists
    const existingRoom = await db.collection<Room>("rooms").findOne({ number: data.number })
    if (existingRoom) {
      return NextResponse.json({ error: "Room number already exists" }, { status: 400 })
    }

    const room: Omit<Room, "_id"> = {
      ...data,
      status: "available",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Room>("rooms").insertOne(room)
    const newRoom = await db.collection<Room>("rooms").findOne({ _id: result.insertedId })

    return NextResponse.json(newRoom, { status: 201 })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}

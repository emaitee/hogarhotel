import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Guest, CreateGuestData } from "@/lib/models/Guest"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const guests = await db.collection<Guest>("guests").find({}).toArray()

    return NextResponse.json(guests)
  } catch (error) {
    console.error("Error fetching guests:", error)
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const data: CreateGuestData = await request.json()

    // Check if guest with email or ID number already exists
    const existingGuest = await db.collection<Guest>("guests").findOne({
      $or: [{ email: data.email }, { idNumber: data.idNumber }],
    })

    if (existingGuest) {
      return NextResponse.json({ error: "Guest with this email or ID number already exists" }, { status: 400 })
    }

    const guest: Omit<Guest, "_id"> = {
      ...data,
      totalStays: 0,
      totalSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Guest>("guests").insertOne(guest)
    const newGuest = await db.collection<Guest>("guests").findOne({ _id: result.insertedId })

    return NextResponse.json(newGuest, { status: 201 })
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
  }
}

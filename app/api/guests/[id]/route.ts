import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { Guest, UpdateGuestData } from "@/lib/models/Guest"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const guest = await db.collection<Guest>("guests").findOne({ _id: new ObjectId(params.id) })

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json(guest)
  } catch (error) {
    console.error("Error fetching guest:", error)
    return NextResponse.json({ error: "Failed to fetch guest" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const data: UpdateGuestData = await request.json()

    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    }

    // Convert dateOfBirth to Date if provided
    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth)
    }

    const result = await db
      .collection<Guest>("guests")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    const updatedGuest = await db.collection<Guest>("guests").findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json(updatedGuest)
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    // Check if guest has any reservations
    const reservations = await db.collection("reservations").find({ guestId: params.id }).toArray()

    if (reservations.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete guest with existing reservations",
        },
        { status: 400 },
      )
    }

    const result = await db.collection<Guest>("guests").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Guest deleted successfully" })
  } catch (error) {
    console.error("Error deleting guest:", error)
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 })
  }
}

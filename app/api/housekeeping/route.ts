import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { CreateHousekeepingTaskData, HousekeepingTask } from "@/lib/models/HousekeepingTask"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const tasks = await db
      .collection<HousekeepingTask>("housekeeping_tasks")
      .aggregate([
        {
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "room",
          },
        },
        {
          $unwind: "$room",
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray()

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching housekeeping tasks:", error)
    return NextResponse.json({ error: "Failed to fetch housekeeping tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateHousekeepingTaskData = await request.json()
    const { db } = await connectToDatabase()

    // Validate room exists
    const room = await db.collection("rooms").findOne({ _id: new ObjectId(body.roomId) })
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const newTask: Omit<HousekeepingTask, "_id"> = {
      ...body,
      roomId: new ObjectId(body.roomId),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("housekeeping_tasks").insertOne(newTask)

    const createdTask = await db
      .collection("housekeeping_tasks")
      .aggregate([
        { $match: { _id: result.insertedId } },
        {
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "room",
          },
        },
        { $unwind: "$room" },
      ])
      .toArray()

    return NextResponse.json(createdTask[0], { status: 201 })
  } catch (error) {
    console.error("Error creating housekeeping task:", error)
    return NextResponse.json({ error: "Failed to create housekeeping task" }, { status: 500 })
  }
}

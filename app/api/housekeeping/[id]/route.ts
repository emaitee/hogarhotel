import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { UpdateHousekeepingTaskData } from "@/lib/models/HousekeepingTask"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body: UpdateHousekeepingTaskData = await request.json()
    const { db } = await connectToDatabase()

    const updateData: any = {
      ...body,
      updatedAt: new Date(),
    }

    // If status is being changed to in-progress, set startedAt
    if (body.status === "in-progress" && !body.startedAt) {
      updateData.startedAt = new Date()
    }

    // If status is being changed to completed, set completedAt
    if (body.status === "completed" && !body.completedAt) {
      updateData.completedAt = new Date()
    }

    const result = await db
      .collection("housekeeping_tasks")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Housekeeping task not found" }, { status: 404 })
    }

    // If task is completed and it's a cleaning task, update room status
    if (body.status === "completed") {
      const task = await db.collection("housekeeping_tasks").findOne({ _id: new ObjectId(params.id) })

      if (task && task.taskType === "cleaning") {
        await db.collection("rooms").updateOne(
          { _id: new ObjectId(task.roomId) },
          {
            $set: {
              status: "available",
              lastCleaned: new Date(),
              updatedAt: new Date(),
            },
          },
        )
      }
    }

    const updatedTask = await db
      .collection("housekeeping_tasks")
      .aggregate([
        { $match: { _id: new ObjectId(params.id) } },
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

    return NextResponse.json(updatedTask[0])
  } catch (error) {
    console.error("Error updating housekeeping task:", error)
    return NextResponse.json({ error: "Failed to update housekeeping task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("housekeeping_tasks").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Housekeeping task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Housekeeping task deleted successfully" })
  } catch (error) {
    console.error("Error deleting housekeeping task:", error)
    return NextResponse.json({ error: "Failed to delete housekeeping task" }, { status: 500 })
  }
}

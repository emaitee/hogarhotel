import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import HousekeepingTask from "@/lib/models/HousekeepingTask"
import Room from "@/lib/models/Room"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const task = await HousekeepingTask.findById(params.id).populate("roomId", "number floor type status")

    if (!task) {
      return NextResponse.json({ error: "Housekeeping task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error fetching housekeeping task:", error)
    return NextResponse.json({ error: "Failed to fetch housekeeping task" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { status, assignedTo, notes, actualDuration } = body

    const updateData: any = {}

    if (status) {
      updateData.status = status

      if (status === "in-progress" && !updateData.startedAt) {
        updateData.startedAt = new Date()
      }

      if (status === "completed") {
        updateData.completedAt = new Date()
        if (actualDuration) {
          updateData.actualDuration = actualDuration
        }
      }
    }

    if (assignedTo !== undefined) updateData.assignedTo = assignedTo
    if (notes !== undefined) updateData.notes = notes
    if (actualDuration !== undefined) updateData.actualDuration = actualDuration

    const task = await HousekeepingTask.findByIdAndUpdate(params.id, updateData, { new: true }).populate(
      "roomId",
      "number floor type status",
    )

    if (!task) {
      return NextResponse.json({ error: "Housekeeping task not found" }, { status: 404 })
    }

    // If task is completed and it's a cleaning task, update room status
    if (status === "completed" && task.taskType === "cleaning") {
      await Room.findByIdAndUpdate(task.roomId._id, {
        status: "available",
        lastCleaned: new Date(),
      })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error updating housekeeping task:", error)
    return NextResponse.json({ error: "Failed to update housekeeping task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const task = await HousekeepingTask.findByIdAndDelete(params.id)

    if (!task) {
      return NextResponse.json({ error: "Housekeeping task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Housekeeping task deleted successfully" })
  } catch (error) {
    console.error("Error deleting housekeeping task:", error)
    return NextResponse.json({ error: "Failed to delete housekeeping task" }, { status: 500 })
  }
}

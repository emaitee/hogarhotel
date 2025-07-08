import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import HousekeepingTask from "@/lib/models/HousekeepingTask"
import Room from "@/lib/models/Room"

export async function GET() {
  try {
    await connectToDatabase()

    const tasks = await HousekeepingTask.find().populate("roomId", "number floor type").sort({ createdAt: -1 })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching housekeeping tasks:", error)
    return NextResponse.json({ error: "Failed to fetch housekeeping tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { roomId, taskType, priority, notes, assignedTo, estimatedDuration } = body

    // Validate required fields
    if (!roomId || !taskType) {
      return NextResponse.json({ error: "Room ID and task type are required" }, { status: 400 })
    }

    // Check if room exists
    const room = await Room.findById(roomId)
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const task = new HousekeepingTask({
      roomId,
      taskType,
      priority: priority || "medium",
      notes: notes || "",
      assignedTo: assignedTo || null,
      estimatedDuration: estimatedDuration || 30,
    })

    await task.save()

    // Populate room data before returning
    await task.populate("roomId", "number floor type")

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Error creating housekeeping task:", error)
    return NextResponse.json({ error: "Failed to create housekeeping task" }, { status: 500 })
  }
}

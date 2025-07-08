import type { ObjectId } from "mongodb"

export interface HousekeepingTask {
  _id?: ObjectId
  roomId: ObjectId
  taskType: "cleaning" | "maintenance" | "inspection"
  status: "pending" | "in-progress" | "completed"
  assignedTo?: string
  priority: "low" | "medium" | "high"
  notes?: string
  estimatedDuration: number // in minutes
  actualDuration?: number // in minutes
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateHousekeepingTaskData {
  roomId: ObjectId
  taskType: "cleaning" | "maintenance" | "inspection"
  assignedTo?: string
  priority: "low" | "medium" | "high"
  notes?: string
  estimatedDuration: number
}

export interface UpdateHousekeepingTaskData {
  taskType?: "cleaning" | "maintenance" | "inspection"
  status?: "pending" | "in-progress" | "completed"
  assignedTo?: string
  priority?: "low" | "medium" | "high"
  notes?: string
  estimatedDuration?: number
  actualDuration?: number
  startedAt?: Date
  completedAt?: Date
}

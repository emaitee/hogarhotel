"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

export interface HousekeepingTask {
  _id: string
  roomId: {
    _id: string
    number: string
    floor: number
    type: string
    status: string
  }
  taskType: "cleaning" | "maintenance" | "inspection"
  status: "pending" | "in-progress" | "completed"
  assignedTo?: string
  priority: "low" | "medium" | "high"
  notes?: string
  estimatedDuration: number
  actualDuration?: number
  createdAt: string
  startedAt?: string
  completedAt?: string
}

export function useHousekeeping() {
  const [tasks, setTasks] = useState<HousekeepingTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/housekeeping")

      if (!response.ok) {
        throw new Error("Failed to fetch housekeeping tasks")
      }

      const data = await response.json()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast.error("Failed to fetch housekeeping tasks")
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: {
    roomId: string
    taskType: "cleaning" | "maintenance" | "inspection"
    priority?: "low" | "medium" | "high"
    notes?: string
    assignedTo?: string
    estimatedDuration?: number
  }) => {
    try {
      const response = await fetch("/api/housekeeping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create task")
      }

      const newTask = await response.json()
      setTasks((prev) => [newTask, ...prev])
      toast.success("Housekeeping task created successfully")
      return newTask
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create task"
      toast.error(errorMessage)
      throw err
    }
  }

  const updateTask = async (
    id: string,
    updates: {
      status?: "pending" | "in-progress" | "completed"
      assignedTo?: string
      notes?: string
      actualDuration?: number
    },
  ) => {
    try {
      const response = await fetch(`/api/housekeeping/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update task")
      }

      const updatedTask = await response.json()
      setTasks((prev) => prev.map((task) => (task._id === id ? updatedTask : task)))
      toast.success("Task updated successfully")
      return updatedTask
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update task"
      toast.error(errorMessage)
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/housekeeping/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete task")
      }

      setTasks((prev) => prev.filter((task) => task._id !== id))
      toast.success("Task deleted successfully")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete task"
      toast.error(errorMessage)
      throw err
    }
  }

  const assignTask = async (id: string, assignedTo: string) => {
    return updateTask(id, { assignedTo, status: "in-progress" })
  }

  const completeTask = async (id: string, actualDuration?: number) => {
    return updateTask(id, { status: "completed", actualDuration })
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    completeTask,
  }
}

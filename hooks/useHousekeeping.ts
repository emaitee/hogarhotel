"use client"

import { useState, useEffect } from "react"
import type {
  HousekeepingTask,
  CreateHousekeepingTaskData,
  UpdateHousekeepingTaskData,
} from "@/lib/models/HousekeepingTask"

interface HousekeepingTaskWithRoom extends HousekeepingTask {
  room: {
    _id: string
    number: string
    type: string
    status: string
  }
}

export function useHousekeeping() {
  const [tasks, setTasks] = useState<HousekeepingTaskWithRoom[]>([])
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
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: CreateHousekeepingTaskData) => {
    try {
      const response = await fetch("/api/housekeeping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error("Failed to create housekeeping task")
      }

      const newTask = await response.json()
      setTasks((prev) => [newTask, ...prev])
      return newTask
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const updateTask = async (id: string, updateData: UpdateHousekeepingTaskData) => {
    try {
      const response = await fetch(`/api/housekeeping/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error("Failed to update housekeeping task")
      }

      const updatedTask = await response.json()
      setTasks((prev) => prev.map((task) => (task._id?.toString() === id ? updatedTask : task)))
      return updatedTask
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/housekeeping/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete housekeeping task")
      }

      setTasks((prev) => prev.filter((task) => task._id?.toString() !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred")
    }
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
  }
}

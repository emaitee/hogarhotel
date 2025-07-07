"use client"

import { useState, useEffect } from "react"
import type { Room } from "@/lib/models/Room"

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/rooms")
      if (!response.ok) {
        throw new Error("Failed to fetch rooms")
      }
      const data = await response.json()
      setRooms(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createRoom = async (roomData: any) => {
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create room")
      }

      const newRoom = await response.json()
      setRooms((prev) => [...prev, newRoom])
      return newRoom
    } catch (err) {
      throw err
    }
  }

  const updateRoom = async (id: string, roomData: any) => {
    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update room")
      }

      const updatedRoom = await response.json()
      setRooms((prev) => prev.map((room) => (room._id?.toString() === id ? updatedRoom : room)))
      return updatedRoom
    } catch (err) {
      throw err
    }
  }

  const deleteRoom = async (id: string) => {
    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete room")
      }

      setRooms((prev) => prev.filter((room) => room._id?.toString() !== id))
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  }
}

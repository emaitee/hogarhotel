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

  const getRoomById = async (id: string) => {
    try {
      const response = await fetch(`/api/rooms/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch room")
      }
      return await response.json()
    } catch (err) {
      throw err
    }
  }

  const getAvailableRooms = (checkIn: Date, checkOut: Date) => {
    // This would typically check against reservations
    // For now, return rooms that are available
    return rooms.filter((room) => room.status === "available")
  }

  const getRoomsByStatus = (status: string) => {
    return rooms.filter((room) => room.status === status)
  }

  const getRoomsByType = (type: string) => {
    return rooms.filter((room) => room.type === type)
  }

  const getRoomStats = () => {
    return {
      total: rooms.length,
      available: rooms.filter((r) => r.status === "available").length,
      occupied: rooms.filter((r) => r.status === "occupied").length,
      maintenance: rooms.filter((r) => r.status === "maintenance").length,
      cleaning: rooms.filter((r) => r.status === "cleaning").length,
      occupancyRate: rooms.length > 0 ? (rooms.filter((r) => r.status === "occupied").length / rooms.length) * 100 : 0,
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
    getRoomById,
    getAvailableRooms,
    getRoomsByStatus,
    getRoomsByType,
    getRoomStats,
  }
}

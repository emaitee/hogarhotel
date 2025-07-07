"use client"

import { useState, useEffect } from "react"
import type { Reservation } from "@/lib/models/Reservation"

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/reservations")
      if (!response.ok) {
        throw new Error("Failed to fetch reservations")
      }
      const data = await response.json()
      setReservations(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createReservation = async (reservationData: Partial<Reservation>) => {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create reservation")
    }

    const newReservation = await response.json()
    setReservations((prev) => [...prev, newReservation])
    return newReservation
  }

  const updateReservation = async (id: string, reservationData: Partial<Reservation>) => {
    const response = await fetch(`/api/reservations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update reservation")
    }

    const updatedReservation = await response.json()
    setReservations((prev) => prev.map((r) => (r._id === id ? updatedReservation : r)))
    return updatedReservation
  }

  const deleteReservationHook = async (id: string) => {
    const response = await fetch(`/api/reservations/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete reservation")
    }

    setReservations((prev) => prev.filter((r) => r._id !== id))
  }

  const checkIn = async (id: string) => {
    const response = await fetch(`/api/reservations/check-in/${id}`, {
      method: "POST",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to check in")
    }

    const updatedReservation = await response.json()
    setReservations((prev) => prev.map((r) => (r._id === id ? updatedReservation : r)))
    return updatedReservation
  }

  const checkOut = async (id: string) => {
    const response = await fetch(`/api/reservations/check-out/${id}`, {
      method: "POST",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to check out")
    }

    const updatedReservation = await response.json()
    setReservations((prev) => prev.map((r) => (r._id === id ? updatedReservation : r)))
    return updatedReservation
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  return {
    reservations,
    loading,
    error,
    createReservation,
    updateReservation,
    deleteReservationHook,
    checkIn,
    checkOut,
    refetch: fetchReservations,
  }
}

"use client"

import { useState, useEffect } from "react"

export function useReservations() {
  const [reservations, setReservations] = useState<any[]>([])
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

  const createReservation = async (reservationData: any) => {
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create reservation")
      }

      const newReservation = await response.json()
      setReservations((prev) => [...prev, newReservation])
      return newReservation
    } catch (err) {
      throw err
    }
  }

  const checkIn = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/check-in/${reservationId}`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to check in")
      }

      const result = await response.json()
      setReservations((prev) => prev.map((res) => (res._id === reservationId ? result.reservation : res)))
      return result
    } catch (err) {
      throw err
    }
  }

  const checkOut = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/check-out/${reservationId}`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to check out")
      }

      const result = await response.json()
      setReservations((prev) => prev.map((res) => (res._id === reservationId ? result.reservation : res)))
      return result
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  return {
    reservations,
    loading,
    error,
    fetchReservations,
    createReservation,
    checkIn,
    checkOut,
  }
}

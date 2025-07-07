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

  const updateReservation = async (reservationId: string, updateData: any) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update reservation")
      }

      const updatedReservation = await response.json()
      setReservations((prev) => prev.map((res) => (res._id === reservationId ? updatedReservation : res)))
      return updatedReservation
    } catch (err) {
      throw err
    }
  }

  const deleteReservation = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete reservation")
      }

      setReservations((prev) => prev.filter((res) => res._id !== reservationId))
      return true
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

  const getReservationById = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch reservation")
      }
      return await response.json()
    } catch (err) {
      throw err
    }
  }

  const getReservationsByGuest = (guestId: string) => {
    return reservations.filter((reservation) => reservation.guestId === guestId)
  }

  const getReservationsByRoom = (roomId: string) => {
    return reservations.filter((reservation) => reservation.roomId === roomId)
  }

  const getReservationsByStatus = (status: string) => {
    return reservations.filter((reservation) => reservation.status === status)
  }

  const getReservationsByDateRange = (startDate: Date, endDate: Date) => {
    return reservations.filter((reservation) => {
      const checkIn = new Date(reservation.checkInDate)
      const checkOut = new Date(reservation.checkOutDate)
      return (
        (checkIn >= startDate && checkIn <= endDate) ||
        (checkOut >= startDate && checkOut <= endDate) ||
        (checkIn <= startDate && checkOut >= endDate)
      )
    })
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
    updateReservation,
    deleteReservation,
    checkIn,
    checkOut,
    getReservationById,
    getReservationsByGuest,
    getReservationsByRoom,
    getReservationsByStatus,
    getReservationsByDateRange,
  }
}

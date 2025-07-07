"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus, Edit, Trash2, LogIn, LogOut, Calendar, Users, Clock } from "lucide-react"
import { ReservationForm } from "@/components/reservations/ReservationForm"
import { useToast } from "@/hooks/use-toast"
import type { Reservation } from "@/lib/models/Reservation"

const columns = [
  { key: "guest", label: "Guest", sortable: true },
  { key: "room", label: "Room", sortable: true },
  { key: "dates", label: "Check-in / Check-out", sortable: true },
  { key: "guests", label: "Guests", sortable: true },
  { key: "total", label: "Total", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
]

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    checkedIn: 0,
    checkedOut: 0,
    cancelled: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchReservations()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [reservations])

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservations")
      if (response.ok) {
        const data = await response.json()
        setReservations(data)
      } else {
        throw new Error("Failed to fetch reservations")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const stats = reservations.reduce(
      (acc, reservation) => {
        acc.total++
        switch (reservation.status) {
          case "confirmed":
            acc.confirmed++
            break
          case "checked-in":
            acc.checkedIn++
            break
          case "checked-out":
            acc.checkedOut++
            break
          case "cancelled":
            acc.cancelled++
            break
        }
        return acc
      },
      { total: 0, confirmed: 0, checkedIn: 0, checkedOut: 0, cancelled: 0 },
    )

    setStats(stats)
  }

  const handleCreateReservation = async (reservationData: any) => {
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      })

      if (response.ok) {
        const newReservation = await response.json()
        setReservations([...reservations, newReservation])
        setIsFormOpen(false)
        toast({
          title: "Success",
          description: "Reservation created successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to create reservation")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create reservation",
        variant: "destructive",
      })
    }
  }

  const handleUpdateReservation = async (reservationData: any) => {
    if (!editingReservation) return

    try {
      const response = await fetch(`/api/reservations/${editingReservation._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      })

      if (response.ok) {
        const updatedReservation = await response.json()
        setReservations(reservations.map((r) => (r._id === editingReservation._id ? updatedReservation : r)))
        setEditingReservation(null)
        setIsFormOpen(false)
        toast({
          title: "Success",
          description: "Reservation updated successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update reservation")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update reservation",
        variant: "destructive",
      })
    }
  }

  const handleDeleteReservation = async (reservationId: string) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setReservations(reservations.filter((r) => r._id !== reservationId))
        toast({
          title: "Success",
          description: "Reservation deleted successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete reservation")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete reservation",
        variant: "destructive",
      })
    }
  }

  const handleCheckIn = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/check-in/${reservationId}`, {
        method: "POST",
      })

      if (response.ok) {
        const updatedReservation = await response.json()
        setReservations(reservations.map((r) => (r._id === reservationId ? updatedReservation : r)))
        toast({
          title: "Success",
          description: "Guest checked in successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to check in")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check in",
        variant: "destructive",
      })
    }
  }

  const handleCheckOut = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/check-out/${reservationId}`, {
        method: "POST",
      })

      if (response.ok) {
        const updatedReservation = await response.json()
        setReservations(reservations.map((r) => (r._id === reservationId ? updatedReservation : r)))
        toast({
          title: "Success",
          description: "Guest checked out successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to check out")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check out",
        variant: "destructive",
      })
    }
  }

  const renderCell = (reservation: Reservation, column: any) => {
    switch (column.key) {
      case "guest":
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#468DD6] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {typeof reservation.guest === "object" ? reservation.guest.name.charAt(0) : "G"}
              </span>
            </div>
            <div>
              <div className="font-medium">
                {typeof reservation.guest === "object" ? reservation.guest.name : "Unknown Guest"}
              </div>
              <div className="text-sm text-gray-500">
                {typeof reservation.guest === "object" ? reservation.guest.email : ""}
              </div>
            </div>
          </div>
        )
      case "room":
        return (
          <div>
            <div className="font-medium">
              Room {typeof reservation.room === "object" ? reservation.room.number : reservation.room}
            </div>
            <div className="text-sm text-gray-500">
              {typeof reservation.room === "object" ? reservation.room.type : ""}
            </div>
          </div>
        )
      case "dates":
        return (
          <div>
            <div className="font-medium">{formatDate(reservation.checkInDate)}</div>
            <div className="text-sm text-gray-500">{formatDate(reservation.checkOutDate)}</div>
          </div>
        )
      case "guests":
        return (
          <div className="text-center">
            <div className="font-medium">{reservation.adults + reservation.children}</div>
            <div className="text-sm text-gray-500">
              {reservation.adults}A {reservation.children}C
            </div>
          </div>
        )
      case "total":
        return <span className="font-medium">{formatCurrency(reservation.totalAmount)}</span>
      case "status":
        return <StatusBadge status={reservation.status} />
      case "actions":
        return (
          <div className="flex space-x-1">
            {reservation.status === "confirmed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCheckIn(reservation._id!.toString())}
                title="Check In"
              >
                <LogIn className="h-4 w-4" />
              </Button>
            )}
            {reservation.status === "checked-in" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCheckOut(reservation._id!.toString())}
                title="Check Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingReservation(reservation)
                setIsFormOpen(true)
              }}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDeleteReservation(reservation._id!.toString())}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      default:
        return reservation[column.key as keyof Reservation]
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#468DD6]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reservations</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage hotel reservations and bookings</p>
        </div>
        <Button
          className="bg-[#1B2A41] hover:bg-[#1B2A41]/90"
          onClick={() => {
            setEditingReservation(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Reservation
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-[#468DD6]" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <LogIn className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Checked In</p>
                <p className="text-2xl font-bold">{stats.checkedIn}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <LogOut className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Checked Out</p>
                <p className="text-2xl font-bold">{stats.checkedOut}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>All Reservations ({reservations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={reservations} columns={columns} searchKey="guest" renderCell={renderCell} />
          </CardContent>
        </Card>
      </motion.div>

      <ReservationForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingReservation(null)
        }}
        onSubmit={editingReservation ? handleUpdateReservation : handleCreateReservation}
        reservation={editingReservation}
      />
    </div>
  )
}

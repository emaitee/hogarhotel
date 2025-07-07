"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/status-badge"
import { useReservations } from "@/hooks/useReservations"
import { formatCurrency } from "@/lib/utils"
import { Plus, Edit, Trash2, Loader2, UserCheck, UserX } from "lucide-react"
import { format } from "date-fns"
import { ReservationForm } from "@/components/reservations/ReservationForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const columns = [
  { key: "guest.name", label: "Guest Name", sortable: true },
  { key: "room.number", label: "Room", sortable: true },
  { key: "checkInDate", label: "Check In", sortable: true },
  { key: "checkOutDate", label: "Check Out", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "totalAmount", label: "Total Amount", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
]

export default function ReservationsPage() {
  const {
    reservations,
    loading,
    error,
    createReservation,
    updateReservation,
    deleteReservationHook,
    checkIn,
    checkOut,
  } = useReservations()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState<any>(null)
  const [deletingReservation, setDeletingReservation] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredReservations = reservations.filter((reservation) => {
    if (statusFilter === "all") return true
    return reservation.status === statusFilter
  })

  const handleCreateReservation = async (data: any) => {
    try {
      setIsSubmitting(true)
      await createReservation(data)
      setIsFormOpen(false)
      toast.success("Reservation created successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to create reservation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateReservation = async (data: any) => {
    try {
      setIsSubmitting(true)
      await updateReservation(editingReservation._id, data)
      setEditingReservation(null)
      toast.success("Reservation updated successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to update reservation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReservation = async () => {
    try {
      await deleteReservationHook(deletingReservation._id)
      setDeletingReservation(null)
      toast.success("Reservation deleted successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete reservation")
    }
  }

  const handleCheckIn = async (reservation: any) => {
    try {
      await checkIn(reservation._id)
      toast.success(`${reservation.guest.name} checked in successfully!`)
    } catch (error: any) {
      toast.error(error.message || "Failed to check in")
    }
  }

  const handleCheckOut = async (reservation: any) => {
    try {
      await checkOut(reservation._id)
      toast.success(`${reservation.guest.name} checked out successfully!`)
    } catch (error: any) {
      toast.error(error.message || "Failed to check out")
    }
  }

  const getStatusStats = () => {
    const stats = {
      total: reservations.length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      checkedIn: reservations.filter((r) => r.status === "checked-in").length,
      checkedOut: reservations.filter((r) => r.status === "checked-out").length,
      cancelled: reservations.filter((r) => r.status === "cancelled").length,
    }
    return stats
  }

  const stats = getStatusStats()

  const renderCell = (reservation: any, column: any) => {
    switch (column.key) {
      case "guest.name":
        return (
          <div>
            <div className="font-medium">{reservation.guest.name}</div>
            <div className="text-sm text-gray-500">{reservation.guest.email}</div>
          </div>
        )
      case "room.number":
        return (
          <div>
            <div className="font-medium">Room {reservation.room.number}</div>
            <div className="text-sm text-gray-500 capitalize">{reservation.room.type}</div>
          </div>
        )
      case "checkInDate":
        return (
          <div>
            <div className="font-medium">{format(new Date(reservation.checkInDate), "MMM dd, yyyy")}</div>
            <div className="text-sm text-gray-500">{format(new Date(reservation.checkInDate), "h:mm a")}</div>
          </div>
        )
      case "checkOutDate":
        return (
          <div>
            <div className="font-medium">{format(new Date(reservation.checkOutDate), "MMM dd, yyyy")}</div>
            <div className="text-sm text-gray-500">{format(new Date(reservation.checkOutDate), "h:mm a")}</div>
          </div>
        )
      case "status":
        return (
          <div className="flex items-center gap-2">
            <StatusBadge status={reservation.status} variant="reservation" />
            {reservation.adults > 0 && (
              <Badge variant="outline" className="text-xs">
                {reservation.adults} Adults {reservation.children > 0 && `+ ${reservation.children} Children`}
              </Badge>
            )}
          </div>
        )
      case "totalAmount":
        return <span className="font-medium">{formatCurrency(reservation.totalAmount)}</span>
      case "actions":
        return (
          <div className="flex space-x-1">
            {reservation.status === "confirmed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCheckIn(reservation)}
                className="text-green-600 hover:text-green-700"
              >
                <UserCheck className="h-4 w-4" />
              </Button>
            )}
            {reservation.status === "checked-in" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCheckOut(reservation)}
                className="text-blue-600 hover:text-blue-700"
              >
                <UserX className="h-4 w-4" />
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setEditingReservation(reservation)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeletingReservation(reservation)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      default:
        return reservation[column.key]
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-600 dark:text-red-400">Error: {error}</div>
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
          <p className="text-gray-600 dark:text-gray-400">Manage all hotel reservations</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
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
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Reservations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.checkedIn}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Checked In</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.checkedOut}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Checked Out</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cancelled</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All Reservations</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable data={filteredReservations} columns={columns} searchKey="guest.name" renderCell={renderCell} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Create/Edit Reservation Dialog */}
      <Dialog
        open={isFormOpen || !!editingReservation}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false)
            setEditingReservation(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingReservation ? "Edit Reservation" : "Create New Reservation"}</DialogTitle>
          </DialogHeader>
          <ReservationForm
            reservation={editingReservation}
            onSubmit={editingReservation ? handleUpdateReservation : handleCreateReservation}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingReservation(null)
            }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingReservation} onOpenChange={() => setDeletingReservation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the reservation for {deletingReservation?.guest?.name}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReservation} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

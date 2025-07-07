"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/status-badge"
import { useReservations } from "@/hooks/useReservations"
import { formatCurrency } from "@/lib/utils"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { format } from "date-fns"

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
  const { reservations, loading, error } = useReservations()

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
        return format(new Date(reservation.checkInDate), "MMM dd, yyyy")
      case "checkOutDate":
        return format(new Date(reservation.checkOutDate), "MMM dd, yyyy")
      case "status":
        return <StatusBadge status={reservation.status} variant="reservation" />
      case "totalAmount":
        return <span className="font-medium">{formatCurrency(reservation.totalAmount)}</span>
      case "actions":
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
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
        <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          <Plus className="h-4 w-4 mr-2" />
          New Reservation
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>All Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={reservations} columns={columns} searchKey="guest.name" renderCell={renderCell} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

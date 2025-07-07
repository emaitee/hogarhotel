"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useReservations } from "@/hooks/useReservations"
import { formatCurrency, formatDate, isToday } from "@/lib/utils"
import { Search, UserCheck, Clock, MapPin, Loader2, Calendar, User, Phone, Mail, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface CheckInDetailsProps {
  reservation: any
  isOpen: boolean
  onClose: () => void
  onCheckIn: (id: string) => Promise<void>
}

function CheckInDetails({ reservation, isOpen, onClose, onCheckIn }: CheckInDetailsProps) {
  const [isChecking, setIsChecking] = useState(false)

  const handleCheckIn = async () => {
    setIsChecking(true)
    try {
      await onCheckIn(reservation._id)
      onClose()
    } catch (error) {
      console.error("Check-in failed:", error)
    } finally {
      setIsChecking(false)
    }
  }

  if (!reservation) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Check-in Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guest Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Guest Information</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg font-medium">{reservation.guest?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{reservation.guest?.email}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{reservation.guest?.phone}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ID Number</label>
                <p className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>{reservation.guest?.idNumber || "Not provided"}</span>
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reservation Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Reservation Details</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Room</label>
                <p className="text-lg font-medium flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    Room {reservation.room?.number} - {reservation.room?.type}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {reservation.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Check-in Date</label>
                <p>{formatDate(reservation.checkInDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Check-out Date</label>
                <p>{formatDate(reservation.checkOutDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Guests</label>
                <p>
                  {reservation.adults} Adults, {reservation.children} Children
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Amount</label>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(reservation.totalAmount)}</p>
              </div>
            </div>

            {reservation.specialRequests && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">Special Requests</label>
                <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{reservation.specialRequests}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Check-in Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCheckIn} disabled={isChecking} className="bg-green-600 hover:bg-green-700">
              {isChecking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking In...
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Confirm Check-in
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CheckInPage() {
  const { reservations, loading, error, checkIn } = useReservations()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Filter reservations for check-in (confirmed status and today's arrivals or overdue)
  const checkInReservations = reservations.filter((r) => {
    const checkInDate = new Date(r.checkInDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    checkInDate.setHours(0, 0, 0, 0)

    return r.status === "confirmed" && checkInDate <= today
  })

  // Filter by search term
  const filteredReservations = checkInReservations.filter(
    (r) =>
      r.guest?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.guest?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.room?.number?.toString().includes(searchTerm),
  )

  const handleCheckIn = async (reservationId: string) => {
    try {
      await checkIn(reservationId)
      toast({
        title: "Success",
        description: "Guest checked in successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check in guest",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleQuickCheckIn = async (reservation: any) => {
    try {
      await handleCheckIn(reservation._id)
    } catch (error) {
      // Error already handled in handleCheckIn
    }
  }

  const handleViewDetails = (reservation: any) => {
    setSelectedReservation(reservation)
    setShowDetails(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        <p>Error: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Check In</h1>
          <p className="text-gray-600 dark:text-gray-400">Process guest check-ins for today</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search guest or reservation..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Arrivals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Pending Check-ins ({filteredReservations.length})</span>
                </div>
                {filteredReservations.length > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {filteredReservations.filter((r) => isToday(r.checkInDate)).length} Today
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReservations.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No pending check-ins</p>
                    <p className="text-sm text-gray-400">All guests have been checked in</p>
                  </div>
                ) : (
                  filteredReservations.map((reservation) => (
                    <div
                      key={reservation._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">{reservation.guest?.name}</h3>
                            {isToday(reservation.checkInDate) && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                Today
                              </Badge>
                            )}
                            {new Date(reservation.checkInDate) < new Date() && !isToday(reservation.checkInDate) && (
                              <Badge variant="destructive" className="text-xs">
                                Overdue
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{reservation.guest?.email}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>Room {reservation.room?.number}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(reservation.checkInDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{reservation.adults + reservation.children} guests</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(reservation)}>
                            Details
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleQuickCheckIn(reservation)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Check In
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Check-in Statistics */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Check-in Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {checkInReservations.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pending Check-ins</div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {reservations.filter((r) => r.status === "checked-in").length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Checked In Today</div>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {
                        checkInReservations.filter(
                          (r) => new Date(r.checkInDate) < new Date() && !isToday(r.checkInDate),
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Overdue Check-ins</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Reservations
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <MapPin className="h-4 w-4 mr-2" />
                      Room Status Overview
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Generate Check-in Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Check-in Details Modal */}
      <CheckInDetails
        reservation={selectedReservation}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onCheckIn={handleCheckIn}
      />
    </div>
  )
}

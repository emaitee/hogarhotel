"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useReservations } from "@/hooks/useReservations"
import { formatCurrency, formatDate, formatDateTime, calculateNights } from "@/lib/utils"
import { Search, UserX, Clock, MapPin, DollarSign, Loader2, Calendar, User, Phone, Mail, Receipt } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface CheckOutDetailsProps {
  reservation: any
  isOpen: boolean
  onClose: () => void
  onCheckOut: (id: string) => Promise<void>
}

function CheckOutDetails({ reservation, isOpen, onClose, onCheckOut }: CheckOutDetailsProps) {
  const [isChecking, setIsChecking] = useState(false)

  const handleCheckOut = async () => {
    setIsChecking(true)
    try {
      await onCheckOut(reservation._id)
      onClose()
    } catch (error) {
      console.error("Check-out failed:", error)
    } finally {
      setIsChecking(false)
    }
  }

  if (!reservation) return null

  const nights = calculateNights(new Date(reservation.checkInDate), new Date(reservation.checkOutDate))
  const checkInDate = formatDateTime(reservation.checkInDate)
  const expectedCheckOut = formatDate(reservation.checkOutDate)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserX className="h-5 w-5" />
            <span>Check-out Details</span>
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
                <label className="text-sm font-medium text-gray-500">Room</label>
                <p className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    Room {reservation.room?.number} - {reservation.room?.type}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stay Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Stay Summary</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Check-in</label>
                <p>{checkInDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Expected Check-out</label>
                <p>{expectedCheckOut}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Nights</label>
                <p className="font-medium">
                  {nights} {nights === 1 ? "night" : "nights"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Guests</label>
                <p>
                  {reservation.adults} Adults, {reservation.children} Children
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Billing Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <Receipt className="h-5 w-5" />
              <span>Billing Summary</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Room Rate ({nights} nights)</span>
                <span>{formatCurrency(reservation.room?.price * nights)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taxes & Fees</span>
                <span>{formatCurrency(reservation.totalAmount - reservation.room?.price * nights)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount</span>
                <span className="text-green-600">{formatCurrency(reservation.totalAmount)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Check-out Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCheckOut} disabled={isChecking} className="bg-red-600 hover:bg-red-700">
              {isChecking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking Out...
                </>
              ) : (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Confirm Check-out
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CheckOutPage() {
  const { reservations, loading, error, checkOut } = useReservations()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Filter reservations for check-out (checked-in status)
  const checkOutReservations = reservations.filter((r) => r.status === "checked-in")

  // Filter by search term
  const filteredReservations = checkOutReservations.filter(
    (r) =>
      r.guest?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.guest?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.room?.number?.toString().includes(searchTerm),
  )

  const handleCheckOut = async (reservationId: string) => {
    try {
      await checkOut(reservationId)
      toast({
        title: "Success",
        description: "Guest checked out successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check out guest",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleQuickCheckOut = async (reservation: any) => {
    try {
      await handleCheckOut(reservation._id)
    } catch (error) {
      // Error already handled in handleCheckOut
    }
  }

  const handleViewDetails = (reservation: any) => {
    setSelectedReservation(reservation)
    setShowDetails(true)
  }

  // Calculate revenue statistics
  const todayRevenue = reservations.filter((r) => r.status === "checked-out").reduce((sum, r) => sum + r.totalAmount, 0)

  const pendingRevenue = checkOutReservations.reduce((sum, r) => sum + r.totalAmount, 0)

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Check Out</h1>
          <p className="text-gray-600 dark:text-gray-400">Process guest check-outs</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search guest or room..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Guests */}
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
                  <span>Current Guests ({filteredReservations.length})</span>
                </div>
                {filteredReservations.length > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {filteredReservations.filter((r) => new Date(r.checkOutDate) <= new Date()).length} Due Today
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReservations.length === 0 ? (
                  <div className="text-center py-8">
                    <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No guests currently checked in</p>
                    <p className="text-sm text-gray-400">All rooms are available</p>
                  </div>
                ) : (
                  filteredReservations.map((reservation) => {
                    const isOverdue = new Date(reservation.checkOutDate) < new Date()
                    const isDueToday = formatDate(reservation.checkOutDate) === formatDate(new Date())

                    return (
                      <div
                        key={reservation._id}
                        className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-gray-900 dark:text-white">{reservation.guest?.name}</h3>
                              {isDueToday && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                                  Due Today
                                </Badge>
                              )}
                              {isOverdue && (
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
                                <span>Until {formatDate(reservation.checkOutDate)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span>{formatCurrency(reservation.totalAmount)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(reservation)}>
                              Details
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleQuickCheckOut(reservation)}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Check Out
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Check-out Statistics */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Check-out Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {checkOutReservations.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Guests</div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {reservations.filter((r) => r.status === "checked-out").length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Checked Out</div>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {checkOutReservations.filter((r) => new Date(r.checkOutDate) < new Date()).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Revenue Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Today's Revenue:</span>
                      <span className="font-medium text-green-600">{formatCurrency(todayRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Revenue:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(pendingRevenue)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Receipt className="h-4 w-4 mr-2" />
                      Generate Checkout Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <DollarSign className="h-4 w-4 mr-2" />
                      View Billing Summary
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Clock className="h-4 w-4 mr-2" />
                      Room Cleaning Schedule
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Check-out Details Modal */}
      <CheckOutDetails
        reservation={selectedReservation}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onCheckOut={handleCheckOut}
      />
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useReservations } from "@/hooks/useReservations"
import { formatCurrency } from "@/lib/utils"
import { Search, UserX, Clock, MapPin, DollarSign, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CheckOutPage() {
  const { reservations, loading, error, checkOut } = useReservations()
  const { toast } = useToast()

  const todayDepartures = reservations.filter((r) => r.status === "checked-in")

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Check Out</h1>
          <p className="text-gray-600 dark:text-gray-400">Process guest check-outs for today</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search guest or room..." className="pl-10 w-64" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Departures */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Current Guests ({todayDepartures.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayDepartures.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No guests currently checked in</p>
                ) : (
                  todayDepartures.map((reservation) => (
                    <div
                      key={reservation._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{reservation.guest.name}</h3>
                          <p className="text-sm text-gray-500">{reservation.guest.email}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>Room {reservation.room.number}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{formatCurrency(reservation.totalAmount)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleCheckOut(reservation._id)}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Check Out
                        </Button>
                      </div>
                    </div>
                  ))
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {reservations.filter((r) => r.status === "checked-in").length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Guests</div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {reservations.filter((r) => r.status === "checked-out").length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Checked Out</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Revenue Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Today's Revenue:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          reservations
                            .filter((r) => r.status === "checked-out")
                            .reduce((sum, r) => sum + r.totalAmount, 0),
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Revenue:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          reservations
                            .filter((r) => r.status === "checked-in")
                            .reduce((sum, r) => sum + r.totalAmount, 0),
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Generate Checkout Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      View Billing Summary
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Room Cleaning Schedule
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

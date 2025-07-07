"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useReservations } from "@/hooks/useReservations"
import { Search, UserCheck, Clock, MapPin, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export default function CheckInPage() {
  const { reservations, loading, error, checkIn } = useReservations()
  const { toast } = useToast()

  const todayArrivals = reservations.filter((r) => r.status === "confirmed")

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Check In</h1>
          <p className="text-gray-600 dark:text-gray-400">Process guest check-ins for today</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search guest or reservation..." className="pl-10 w-64" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Arrivals */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Today's Arrivals ({todayArrivals.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayArrivals.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No arrivals for today</p>
                ) : (
                  todayArrivals.map((reservation) => (
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
                            <span>{format(new Date(reservation.checkInDate), "MMM dd, yyyy")}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleCheckIn(reservation._id)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Check In
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Check-in Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Check-in Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {reservations.filter((r) => r.status === "confirmed").length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pending Check-ins</div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {reservations.filter((r) => r.status === "checked-in").length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Checked In Today</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      View All Reservations
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Room Status Overview
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Generate Check-in Report
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

"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { useRooms } from "@/hooks/useRooms"
import { formatCurrency } from "@/lib/utils"
import { Plus, Edit, Wifi, Tv, Snowflake, Wine, Mountain, Waves, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const amenityIcons = {
  WiFi: Wifi,
  TV: Tv,
  AC: Snowflake,
  Minibar: Wine,
  Balcony: Mountain,
  Jacuzzi: Waves,
}

export default function RoomsPage() {
  const { rooms, loading, error, updateRoom } = useRooms()
  const { toast } = useToast()

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case "standard":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "deluxe":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "suite":
        return "bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const handleStatusChange = async (roomId: string, newStatus: string) => {
    try {
      await updateRoom(roomId, { status: newStatus })
      toast({
        title: "Success",
        description: "Room status updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update room status",
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rooms</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all hotel rooms and their status</p>
        </div>
        <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, index) => (
          <motion.div
            key={room._id?.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Room {room.number}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Floor {room.floor}</p>
                  </div>
                  <StatusBadge status={room.status} variant="room" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getRoomTypeColor(room.type)}>
                    {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                  </Badge>
                  <span className="text-lg font-bold text-[#1B2A41] dark:text-white">
                    {formatCurrency(room.price)}/night
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                      return (
                        <div
                          key={amenity}
                          className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs"
                        >
                          {Icon && <Icon className="h-3 w-3" />}
                          <span>{amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {room.lastCleaned && (
                  <div className="text-xs text-gray-500">
                    Last cleaned: {new Date(room.lastCleaned).toLocaleDateString()}
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {room.status === "maintenance" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-green-50 hover:bg-green-100"
                      onClick={() => handleStatusChange(room._id!.toString(), "available")}
                    >
                      Mark Available
                    </Button>
                  )}
                  {room.status === "cleaning" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-green-50 hover:bg-green-100"
                      onClick={() => handleStatusChange(room._id!.toString(), "available")}
                    >
                      Mark Clean
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

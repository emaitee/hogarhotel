"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRooms } from "@/hooks/useRooms"
import { formatCurrency } from "@/lib/utils"
import { Plus, Edit, Trash2, Wifi, Tv, Snowflake, Wine, Mountain, Waves, Loader2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RoomForm } from "@/components/rooms/RoomForm"
import type { Room } from "@/lib/models/Room"

const amenityIcons = {
  WiFi: Wifi,
  TV: Tv,
  AC: Snowflake,
  Minibar: Wine,
  Balcony: Mountain,
  Jacuzzi: Waves,
}

export default function RoomsPage() {
  const { rooms, loading, error, updateRoom, deleteRoom, fetchRooms } = useRooms()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case "standard":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "deluxe":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "suite":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
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

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await deleteRoom(roomId)
      toast({
        title: "Success",
        description: "Room deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete room",
        variant: "destructive",
      })
    }
  }

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room)
    setIsEditDialogOpen(true)
  }

  const handleRoomAdded = () => {
    setIsAddDialogOpen(false)
    fetchRooms()
    toast({
      title: "Success",
      description: "Room added successfully",
    })
  }

  const handleRoomUpdated = () => {
    setIsEditDialogOpen(false)
    setEditingRoom(null)
    fetchRooms()
    toast({
      title: "Success",
      description: "Room updated successfully",
    })
  }

  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || room.status === statusFilter
    const matchesType = typeFilter === "all" || room.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <RoomForm onSuccess={handleRoomAdded} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
      >
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="deluxe">Deluxe</SelectItem>
            <SelectItem value="suite">Suite</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Room Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {rooms.filter((r) => r.status === "available").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {rooms.filter((r) => r.status === "occupied").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Occupied</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {rooms.filter((r) => r.status === "cleaning").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cleaning</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {rooms.filter((r) => r.status === "maintenance").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Maintenance</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room, index) => (
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEditRoom(room)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>

                  {room.status === "maintenance" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-green-50 hover:bg-green-100 text-green-700"
                      onClick={() => handleStatusChange(room._id!.toString(), "available")}
                    >
                      Mark Available
                    </Button>
                  )}

                  {room.status === "cleaning" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-green-50 hover:bg-green-100 text-green-700"
                      onClick={() => handleStatusChange(room._id!.toString(), "available")}
                    >
                      Mark Clean
                    </Button>
                  )}

                  {room.status === "available" && (
                    <Select onValueChange={(value) => handleStatusChange(room._id!.toString(), value)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Change Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cleaning">Set Cleaning</SelectItem>
                        <SelectItem value="maintenance">Set Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Room</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete Room {room.number}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteRoom(room._id!.toString())}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No rooms found matching your criteria.</p>
        </div>
      )}

      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Room {editingRoom?.number}</DialogTitle>
          </DialogHeader>
          {editingRoom && <RoomForm room={editingRoom} onSuccess={handleRoomUpdated} isEditing={true} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

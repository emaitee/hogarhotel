"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Reservation } from "@/lib/models/Reservation"
import type { Guest } from "@/lib/models/Guest"
import type { Room } from "@/lib/models/Room"

interface ReservationFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  reservation?: Reservation | null
}

export function ReservationForm({ isOpen, onClose, onSubmit, reservation }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    guestId: "",
    roomId: "",
    checkInDate: new Date(),
    checkOutDate: new Date(),
    adults: 1,
    children: 0,
    specialRequests: "",
    status: "confirmed" as const,
  })
  const [guests, setGuests] = useState<Guest[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      fetchGuests()
      fetchRooms()
    }
  }, [isOpen])

  useEffect(() => {
    if (reservation) {
      setFormData({
        guestId:
          typeof reservation.guest === "object" ? reservation.guest._id!.toString() : reservation.guest.toString(),
        roomId: typeof reservation.room === "object" ? reservation.room._id!.toString() : reservation.room.toString(),
        checkInDate: new Date(reservation.checkInDate),
        checkOutDate: new Date(reservation.checkOutDate),
        adults: reservation.adults,
        children: reservation.children,
        specialRequests: reservation.specialRequests || "",
        status: reservation.status,
      })
      setTotalAmount(reservation.totalAmount)
    } else {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dayAfter = new Date()
      dayAfter.setDate(dayAfter.getDate() + 2)

      setFormData({
        guestId: "",
        roomId: "",
        checkInDate: tomorrow,
        checkOutDate: dayAfter,
        adults: 1,
        children: 0,
        specialRequests: "",
        status: "confirmed",
      })
      setTotalAmount(0)
    }
  }, [reservation, isOpen])

  useEffect(() => {
    calculateTotal()
  }, [formData.roomId, formData.checkInDate, formData.checkOutDate, rooms])

  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/guests")
      if (response.ok) {
        const data = await response.json()
        setGuests(data)
      }
    } catch (error) {
      console.error("Failed to fetch guests:", error)
    }
  }

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms")
      if (response.ok) {
        const data = await response.json()
        setRooms(data.filter((room: Room) => room.status === "available"))
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
    }
  }

  const calculateTotal = () => {
    if (!formData.roomId || !formData.checkInDate || !formData.checkOutDate) {
      setTotalAmount(0)
      return
    }

    const room = rooms.find((r) => r._id!.toString() === formData.roomId)
    if (!room) {
      setTotalAmount(0)
      return
    }

    const nights = Math.ceil((formData.checkOutDate.getTime() - formData.checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    const total = nights * room.price
    setTotalAmount(total)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        ...formData,
        totalAmount,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{reservation ? "Edit Reservation" : "New Reservation"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guest">Guest</Label>
              <Select value={formData.guestId} onValueChange={(value) => handleChange("guestId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a guest" />
                </SelectTrigger>
                <SelectContent>
                  {guests.map((guest) => (
                    <SelectItem key={guest._id!.toString()} value={guest._id!.toString()}>
                      {guest.name} - {guest.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Select value={formData.roomId} onValueChange={(value) => handleChange("roomId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room._id!.toString()} value={room._id!.toString()}>
                      Room {room.number} - {room.type} (${room.price}/night)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.checkInDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.checkInDate ? format(formData.checkInDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.checkInDate}
                    onSelect={(date) => date && handleChange("checkInDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.checkOutDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.checkOutDate ? format(formData.checkOutDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.checkOutDate}
                    onSelect={(date) => date && handleChange("checkOutDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adults">Adults</Label>
              <Input
                id="adults"
                type="number"
                min="1"
                value={formData.adults}
                onChange={(e) => handleChange("adults", Number.parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="children">Children</Label>
              <Input
                id="children"
                type="number"
                min="0"
                value={formData.children}
                onChange={(e) => handleChange("children", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleChange("specialRequests", e.target.value)}
              placeholder="Any special requests or notes..."
            />
          </div>

          {totalAmount > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-2xl font-bold text-[#468DD6]">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {Math.ceil((formData.checkOutDate.getTime() - formData.checkInDate.getTime()) / (1000 * 60 * 60 * 24))}{" "}
                nights
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.guestId || !formData.roomId}>
              {loading ? "Saving..." : reservation ? "Update Reservation" : "Create Reservation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

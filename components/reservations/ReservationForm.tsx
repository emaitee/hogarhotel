"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
    specialRequests: "",
    status: "confirmed",
  })
  const [guests, setGuests] = useState<Guest[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
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
          typeof reservation.guest === "object"
            ? reservation.guest._id?.toString() || ""
            : reservation.guest.toString(),
        roomId:
          typeof reservation.room === "object" ? reservation.room._id?.toString() || "" : reservation.room.toString(),
        checkInDate: new Date(reservation.checkInDate).toISOString().split("T")[0],
        checkOutDate: new Date(reservation.checkOutDate).toISOString().split("T")[0],
        adults: reservation.adults,
        children: reservation.children,
        specialRequests: reservation.specialRequests || "",
        status: reservation.status,
      })
    } else {
      setFormData({
        guestId: "",
        roomId: "",
        checkInDate: "",
        checkOutDate: "",
        adults: 1,
        children: 0,
        specialRequests: "",
        status: "confirmed",
      })
    }
  }, [reservation, isOpen])

  useEffect(() => {
    calculateTotal()
  }, [formData.checkInDate, formData.checkOutDate, formData.roomId, rooms])

  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/guests")
      if (response.ok) {
        const data = await response.json()
        setGuests(data)
      }
    } catch (error) {
      console.error("Error fetching guests:", error)
    }
  }

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms")
      if (response.ok) {
        const data = await response.json()
        // Only show available rooms
        setRooms(data.filter((room: Room) => room.status === "available"))
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
    }
  }

  const calculateTotal = () => {
    if (formData.checkInDate && formData.checkOutDate && formData.roomId) {
      const checkIn = new Date(formData.checkInDate)
      const checkOut = new Date(formData.checkOutDate)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

      const selectedRoom = rooms.find((room) => room._id?.toString() === formData.roomId)
      if (selectedRoom && nights > 0) {
        setTotalAmount(nights * selectedRoom.price)
      } else {
        setTotalAmount(0)
      }
    } else {
      setTotalAmount(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = {
        ...formData,
        totalAmount,
        adults: Number.parseInt(formData.adults.toString()),
        children: Number.parseInt(formData.children.toString()),
      }
      await onSubmit(submitData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{reservation ? "Edit Reservation" : "Create New Reservation"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestId">Guest *</Label>
              <Select value={formData.guestId} onValueChange={(value) => handleChange("guestId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a guest" />
                </SelectTrigger>
                <SelectContent>
                  {guests.map((guest) => (
                    <SelectItem key={guest._id?.toString()} value={guest._id?.toString() || ""}>
                      {guest.name} - {guest.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomId">Room *</Label>
              <Select value={formData.roomId} onValueChange={(value) => handleChange("roomId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room._id?.toString()} value={room._id?.toString() || ""}>
                      Room {room.number} - {room.type} (₦{room.price.toLocaleString()}/night)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkInDate">Check-in Date *</Label>
              <Input
                id="checkInDate"
                type="date"
                value={formData.checkInDate}
                onChange={(e) => handleChange("checkInDate", e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutDate">Check-out Date *</Label>
              <Input
                id="checkOutDate"
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => handleChange("checkOutDate", e.target.value)}
                required
                min={formData.checkInDate || new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adults">Adults *</Label>
              <Select
                value={formData.adults.toString()}
                onValueChange={(value) => handleChange("adults", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Adult{num > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="children">Children</Label>
              <Select
                value={formData.children.toString()}
                onValueChange={(value) => handleChange("children", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Child" : "Children"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {reservation && (
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
          )}

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleChange("specialRequests", e.target.value)}
              placeholder="Any special requests or notes"
              rows={3}
            />
          </div>

          {totalAmount > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-xl font-bold text-[#468DD6]">₦{totalAmount.toLocaleString()}</span>
              </div>
              {formData.checkInDate && formData.checkOutDate && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {Math.ceil(
                    (new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  night(s)
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.guestId || !formData.roomId}
              className="bg-[#1B2A41] hover:bg-[#1B2A41]/90"
            >
              {isSubmitting ? "Saving..." : reservation ? "Update Reservation" : "Create Reservation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

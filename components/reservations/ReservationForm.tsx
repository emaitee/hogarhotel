"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ReservationFormProps {
  reservation?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ReservationForm({ reservation, onSubmit, onCancel, isSubmitting }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    guestId: "",
    roomId: "",
    checkInDate: new Date(),
    checkOutDate: new Date(),
    adults: 1,
    children: 0,
    specialRequests: "",
    status: "confirmed",
  })
  const [guests, setGuests] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [checkOutOpen, setCheckOutOpen] = useState(false)

  useEffect(() => {
    fetchGuestsAndRooms()
  }, [])

  useEffect(() => {
    if (reservation) {
      setFormData({
        guestId: reservation.guestId,
        roomId: reservation.roomId,
        checkInDate: new Date(reservation.checkInDate),
        checkOutDate: new Date(reservation.checkOutDate),
        adults: reservation.adults,
        children: reservation.children,
        specialRequests: reservation.specialRequests || "",
        status: reservation.status,
      })
    }
  }, [reservation])

  const fetchGuestsAndRooms = async () => {
    try {
      const [guestsRes, roomsRes] = await Promise.all([fetch("/api/guests"), fetch("/api/rooms")])

      const guestsData = await guestsRes.json()
      const roomsData = await roomsRes.json()

      setGuests(guestsData)
      setRooms(roomsData.filter((room: any) => room.status === "available"))
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Guest Selection */}
        <div className="space-y-2">
          <Label htmlFor="guestId">Guest *</Label>
          <Select value={formData.guestId} onValueChange={(value) => handleInputChange("guestId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a guest" />
            </SelectTrigger>
            <SelectContent>
              {guests.map((guest) => (
                <SelectItem key={guest._id} value={guest._id}>
                  <div>
                    <div className="font-medium">{guest.name}</div>
                    <div className="text-sm text-gray-500">{guest.email}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Room Selection */}
        <div className="space-y-2">
          <Label htmlFor="roomId">Room *</Label>
          <Select value={formData.roomId} onValueChange={(value) => handleInputChange("roomId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room._id} value={room._id}>
                  <div>
                    <div className="font-medium">Room {room.number}</div>
                    <div className="text-sm text-gray-500 capitalize">
                      {room.type} - ₦{room.price.toLocaleString()}/night
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check-in Date */}
        <div className="space-y-2">
          <Label>Check-in Date *</Label>
          <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.checkInDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.checkInDate ? format(formData.checkInDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.checkInDate}
                onSelect={(date) => {
                  handleInputChange("checkInDate", date)
                  setCheckInOpen(false)
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <Label>Check-out Date *</Label>
          <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.checkOutDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.checkOutDate ? format(formData.checkOutDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.checkOutDate}
                onSelect={(date) => {
                  handleInputChange("checkOutDate", date)
                  setCheckOutOpen(false)
                }}
                disabled={(date) => date <= formData.checkInDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Adults */}
        <div className="space-y-2">
          <Label htmlFor="adults">Adults *</Label>
          <Select
            value={formData.adults.toString()}
            onValueChange={(value) => handleInputChange("adults", Number.parseInt(value))}
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

        {/* Children */}
        <div className="space-y-2">
          <Label htmlFor="children">Children</Label>
          <Select
            value={formData.children.toString()}
            onValueChange={(value) => handleInputChange("children", Number.parseInt(value))}
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

      {/* Status (only for editing) */}
      {reservation && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
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

      {/* Special Requests */}
      <div className="space-y-2">
        <Label htmlFor="specialRequests">Special Requests</Label>
        <Textarea
          id="specialRequests"
          value={formData.specialRequests}
          onChange={(e) => handleInputChange("specialRequests", e.target.value)}
          placeholder="Any special requests or notes..."
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {reservation ? "Update Reservation" : "Create Reservation"}
        </Button>
      </div>
    </form>
  )
}

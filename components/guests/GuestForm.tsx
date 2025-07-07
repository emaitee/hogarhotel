"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Guest } from "@/lib/models/Guest"

interface GuestFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  guest?: Guest | null
}

export function GuestForm({ isOpen, onClose, onSubmit, guest }: GuestFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    idNumber: "",
    nationality: "",
    dateOfBirth: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name || "",
        email: guest.email || "",
        phone: guest.phone || "",
        address: guest.address || "",
        idNumber: guest.idNumber || "",
        nationality: guest.nationality || "",
        dateOfBirth: guest.dateOfBirth ? new Date(guest.dateOfBirth).toISOString().split("T")[0] : "",
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        idNumber: "",
        nationality: "",
        dateOfBirth: "",
      })
    }
  }, [guest, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{guest ? "Edit Guest" : "Add New Guest"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number *</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => handleChange("idNumber", e.target.value)}
                placeholder="Enter ID number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
                placeholder="Enter nationality"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter full address"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : guest ? "Update Guest" : "Add Guest"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

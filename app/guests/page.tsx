"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/DataTable"
import { formatCurrency } from "@/lib/utils"
import { Plus, Edit, Trash2, User, Mail, Phone, MapPin } from "lucide-react"
import { GuestForm } from "@/components/guests/GuestForm"
import { useToast } from "@/hooks/use-toast"
import type { Guest } from "@/lib/models/Guest"

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "contact", label: "Contact", sortable: true },
  { key: "address", label: "Address", sortable: true },
  { key: "stats", label: "Stats", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
]

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchGuests()
  }, [])

  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/guests")
      if (response.ok) {
        const data = await response.json()
        setGuests(data)
      } else {
        throw new Error("Failed to fetch guests")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch guests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGuest = async (guestData: any) => {
    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guestData),
      })

      if (response.ok) {
        const newGuest = await response.json()
        setGuests([...guests, newGuest])
        setIsFormOpen(false)
        toast({
          title: "Success",
          description: "Guest created successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to create guest")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create guest",
        variant: "destructive",
      })
    }
  }

  const handleUpdateGuest = async (guestData: any) => {
    if (!editingGuest) return

    try {
      const response = await fetch(`/api/guests/${editingGuest._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guestData),
      })

      if (response.ok) {
        const updatedGuest = await response.json()
        setGuests(guests.map((g) => (g._id === editingGuest._id ? updatedGuest : g)))
        setEditingGuest(null)
        setIsFormOpen(false)
        toast({
          title: "Success",
          description: "Guest updated successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update guest")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update guest",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Are you sure you want to delete this guest?")) return

    try {
      const response = await fetch(`/api/guests/${guestId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setGuests(guests.filter((g) => g._id !== guestId))
        toast({
          title: "Success",
          description: "Guest deleted successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete guest")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete guest",
        variant: "destructive",
      })
    }
  }

  const renderCell = (guest: Guest, column: any) => {
    switch (column.key) {
      case "name":
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#468DD6] rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-medium">{guest.name}</div>
              <div className="text-sm text-gray-500">ID: {guest.idNumber}</div>
            </div>
          </div>
        )
      case "contact":
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{guest.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{guest.phone}</span>
            </div>
          </div>
        )
      case "address":
        return (
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{guest.address}</span>
          </div>
        )
      case "stats":
        return (
          <div className="text-center">
            <div className="font-medium">{guest.totalStays || 0}</div>
            <div className="text-sm text-gray-500">Stays</div>
            <div className="font-medium">{formatCurrency(guest.totalSpent || 0)}</div>
            <div className="text-sm text-gray-500">Spent</div>
          </div>
        )
      case "actions":
        return (
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingGuest(guest)
                setIsFormOpen(true)
              }}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleDeleteGuest(guest._id!.toString())} title="Delete">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      default:
        return guest[column.key as keyof Guest]
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#468DD6]"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guest Registry</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage guest information and profiles</p>
        </div>
        <Button
          className="bg-[#1B2A41] hover:bg-[#1B2A41]/90"
          onClick={() => {
            setEditingGuest(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Guest
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-[#468DD6]" />
              <div>
                <p className="text-sm text-gray-600">Total Guests</p>
                <p className="text-2xl font-bold">{guests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active Guests</p>
                <p className="text-2xl font-bold">{guests.filter((g) => (g.totalStays || 0) > 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">New Guests</p>
                <p className="text-2xl font-bold">{guests.filter((g) => (g.totalStays || 0) === 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">VIP Guests</p>
                <p className="text-2xl font-bold">{guests.filter((g) => (g.totalStays || 0) >= 5).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>All Guests ({guests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={guests} columns={columns} searchKey="name" renderCell={renderCell} />
          </CardContent>
        </Card>
      </motion.div>

      <GuestForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingGuest(null)
        }}
        onSubmit={editingGuest ? handleUpdateGuest : handleCreateGuest}
        guest={editingGuest}
      />
    </div>
  )
}

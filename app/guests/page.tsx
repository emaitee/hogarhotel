"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/DataTable"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus, Edit, Trash2, User, Users, UserPlus, Crown } from "lucide-react"
import { GuestForm } from "@/components/guests/GuestForm"
import { useToast } from "@/hooks/use-toast"
import type { Guest } from "@/lib/models/Guest"

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Phone", sortable: true },
  { key: "nationality", label: "Nationality", sortable: true },
  { key: "totalStays", label: "Stays", sortable: true },
  { key: "totalSpent", label: "Total Spent", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
]

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    new: 0,
    vip: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchGuests()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [guests])

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

  const calculateStats = () => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const stats = guests.reduce(
      (acc, guest) => {
        acc.total++
        if (guest.totalStays > 0) acc.active++
        if (new Date(guest.createdAt || now) > thirtyDaysAgo) acc.new++
        if (guest.totalSpent > 100000) acc.vip++ // VIP if spent more than 100k
        return acc
      },
      { total: 0, active: 0, new: 0, vip: 0 },
    )

    setStats(stats)
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
            <div className="w-8 h-8 bg-[#468DD6] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{guest.name.charAt(0)}</span>
            </div>
            <div>
              <div className="font-medium">{guest.name}</div>
              <div className="text-sm text-gray-500">ID: {guest.idNumber || "N/A"}</div>
            </div>
          </div>
        )
      case "email":
        return (
          <div>
            <div className="font-medium">{guest.email}</div>
            <div className="text-sm text-gray-500">
              {guest.dateOfBirth ? formatDate(guest.dateOfBirth) : "DOB not set"}
            </div>
          </div>
        )
      case "phone":
        return <span className="font-medium">{guest.phone}</span>
      case "nationality":
        return <span className="capitalize">{guest.nationality || "Not specified"}</span>
      case "totalStays":
        return (
          <div className="text-center">
            <div className="font-medium">{guest.totalStays}</div>
            <div className="text-sm text-gray-500">stays</div>
          </div>
        )
      case "totalSpent":
        return <span className="font-medium">{formatCurrency(guest.totalSpent)}</span>
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
          <p className="text-gray-600 dark:text-gray-400">Manage hotel guests and their information</p>
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
              <Users className="h-5 w-5 text-[#468DD6]" />
              <div>
                <p className="text-sm text-gray-600">Total Guests</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">New Guests</p>
                <p className="text-2xl font-bold">{stats.new}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">VIP Guests</p>
                <p className="text-2xl font-bold">{stats.vip}</p>
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

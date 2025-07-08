"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/shared/DataTable"
import { CustomerForm } from "@/components/customers/CustomerForm"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Edit,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Filter,
  Users,
  UserPlus,
  TrendingUp,
  Search,
} from "lucide-react"
import type { Guest } from "@/lib/models/Guest"

const columns = [
  { key: "name", label: "Customer Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Phone", sortable: true },
  { key: "totalStays", label: "Total Stays", sortable: true },
  { key: "totalSpent", label: "Total Spent", sortable: true },
  { key: "lastStay", label: "Last Stay", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
]

const customerTypes = [
  { value: "vip", label: "VIP", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400" },
  { value: "regular", label: "Regular", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
  { value: "new", label: "New", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
  { value: "inactive", label: "Inactive", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400" },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Guest[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Guest | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch customers from database
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/guests")
      if (!response.ok) throw new Error("Failed to fetch customers")
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      })
    }
  }

  // Fetch reservations for customer history
  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservations")
      if (!response.ok) throw new Error("Failed to fetch reservations")
      const data = await response.json()
      setReservations(data)
    } catch (error) {
      console.error("Error fetching reservations:", error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchCustomers(), fetchReservations()])
      setLoading(false)
    }
    loadData()
  }, [])

  const getCustomerType = (customer: Guest) => {
    if (customer.totalSpent > 5000) return "vip"
    if (customer.totalStays === 0) return "new"
    if (customer.totalStays > 0 && customer.totalSpent > 0) return "regular"
    return "inactive"
  }

  const getLastStayDate = (customerId: string) => {
    const customerReservations = reservations.filter((r) => r.guestId === customerId)
    if (customerReservations.length === 0) return "Never"

    const lastReservation = customerReservations
      .filter((r) => r.status === "checked-out")
      .sort((a, b) => new Date(b.checkOutDate).getTime() - new Date(a.checkOutDate).getTime())[0]

    return lastReservation ? formatDate(lastReservation.checkOutDate) : "Never"
  }

  const handleAddCustomer = async (customerData: any) => {
    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create customer")
      }

      await fetchCustomers()
      setIsAddModalOpen(false)
      toast({
        title: "Success",
        description: "Customer added successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEditCustomer = async (customerData: any) => {
    if (!selectedCustomer) return

    try {
      const response = await fetch(`/api/guests/${selectedCustomer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update customer")
      }

      await fetchCustomers()
      setIsEditModalOpen(false)
      setSelectedCustomer(null)
      toast({
        title: "Success",
        description: "Customer updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return

    try {
      const response = await fetch(`/api/guests/${customerId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete customer")
      }

      await fetchCustomers()
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const renderCell = (customer: Guest, column: any) => {
    switch (column.key) {
      case "name":
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#468DD6] to-[#1B2A41] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{customer.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div className="font-medium">{customer.name}</div>
              <div className="text-sm text-gray-500">ID: {customer.idNumber}</div>
            </div>
          </div>
        )
      case "email":
        return (
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{customer.email}</span>
          </div>
        )
      case "phone":
        return (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{customer.phone}</span>
          </div>
        )
      case "totalStays":
        return (
          <div className="text-center">
            <div className="font-medium text-lg">{customer.totalStays}</div>
            <div className="text-xs text-gray-500">stays</div>
          </div>
        )
      case "totalSpent":
        return (
          <div className="text-center">
            <div className="font-medium text-lg">{formatCurrency(customer.totalSpent)}</div>
            <div className="text-xs text-gray-500">lifetime</div>
          </div>
        )
      case "lastStay":
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{getLastStayDate(customer._id?.toString() || "")}</span>
          </div>
        )
      case "status":
        const type = getCustomerType(customer)
        const typeConfig = customerTypes.find((t) => t.value === type)
        return <Badge className={typeConfig?.color}>{typeConfig?.label}</Badge>
      case "actions":
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedCustomer(customer)
                setIsViewModalOpen(true)
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedCustomer(customer)
                setIsEditModalOpen(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )
      default:
        return customer[column.key as keyof Guest]
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesFilter = filterType === "all" || getCustomerType(customer) === filterType
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: customers.length,
    vip: customers.filter((c) => getCustomerType(c) === "vip").length,
    new: customers.filter((c) => getCustomerType(c) === "new").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A41]"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer information, history, and relationships</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              {customerTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </motion.div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VIP Customers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.vip}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Customers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.new}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Customer Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={filteredCustomers} columns={columns} searchKey="name" renderCell={renderCell} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Customer Modal */}
      <CustomerForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddCustomer} />

      {/* Edit Customer Modal */}
      <CustomerForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedCustomer(null)
        }}
        onSubmit={handleEditCustomer}
        customer={selectedCustomer}
      />

      {/* View Customer Modal */}
      {selectedCustomer && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            <CustomerDetailsModal
              customer={selectedCustomer}
              reservations={reservations.filter((r) => r.guestId === selectedCustomer._id?.toString())}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function CustomerDetailsModal({ customer, reservations }: { customer: Guest; reservations: any[] }) {
  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{customer.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{customer.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Stay Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-xl font-bold text-[#1B2A41] dark:text-white">{customer.totalStays}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Stays</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-xl font-bold text-[#1B2A41] dark:text-white">
                  {formatCurrency(customer.totalSpent)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation History */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Reservation History</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <div key={reservation._id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">Room {reservation.room?.number || "N/A"}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(reservation.totalAmount)}</div>
                    <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No reservation history</p>
          )}
        </div>
      </div>
    </div>
  )
}

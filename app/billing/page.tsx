"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/shared/DataTable"
import { BillForm } from "@/components/billing/BillForm"
import { useBilling } from "@/hooks/useBilling"
import { useReservations } from "@/hooks/useReservations"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { Plus, Download, Eye, DollarSign, Receipt, CreditCard, Search } from "lucide-react"
import { toast } from "sonner"

const columns = [
  { key: "billNumber", label: "Bill #", sortable: true },
  { key: "guest.name", label: "Guest", sortable: true },
  { key: "room.number", label: "Room", sortable: true },
  { key: "total", label: "Amount", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "dueDate", label: "Due Date", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
]

export default function BillingPage() {
  const { bills, loading, createBill, payBill } = useBilling()
  const { reservations } = useReservations()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.guest?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.room?.number.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || bill.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateBill = async (billData: any) => {
    try {
      await createBill(billData)
      toast.success("Bill created successfully")
    } catch (error) {
      toast.error("Failed to create bill")
    }
  }

  const handlePayBill = async (billId: string) => {
    try {
      await payBill(billId, {
        paymentMethod: "cash",
        amount: 0,
        notes: "Payment processed",
      })
      toast.success("Payment processed successfully")
    } catch (error) {
      toast.error("Failed to process payment")
    }
  }

  const renderCell = (bill: any, column: any) => {
    switch (column.key) {
      case "billNumber":
        return <span className="font-mono text-sm">{bill.billNumber}</span>
      case "guest.name":
        return (
          <div>
            <div className="font-medium">{bill.guest?.name}</div>
            <div className="text-sm text-gray-500">{bill.guest?.email}</div>
          </div>
        )
      case "room.number":
        return <span className="font-medium">Room {bill.room?.number}</span>
      case "total":
        return <span className="font-medium">{formatCurrency(bill.total)}</span>
      case "status":
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
            {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
          </span>
        )
      case "dueDate":
        return formatDate(bill.dueDate)
      case "actions":
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
            {bill.status === "pending" && (
              <Button size="sm" variant="outline" onClick={() => handlePayBill(bill._id)}>
                Pay
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )
      default:
        return bill[column.key]
    }
  }

  const totalRevenue = bills.filter((bill) => bill.status === "paid").reduce((sum, bill) => sum + bill.total, 0)

  const pendingAmount = bills.filter((bill) => bill.status === "pending").reduce((sum, bill) => sum + bill.total, 0)

  const overdueAmount = bills.filter((bill) => bill.status === "overdue").reduce((sum, bill) => sum + bill.total, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage invoices and payments</p>
        </div>
        <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Bill
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(pendingAmount)}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Amount</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(overdueAmount)}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full">
                  <Receipt className="h-6 w-6 text-red-600" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bills</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{bills.length}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Bills Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle>All Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={filteredBills} columns={columns} searchKey="billNumber" renderCell={renderCell} />
          </CardContent>
        </Card>
      </motion.div>

      <BillForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateBill}
        reservations={reservations.filter((r) => r.status === "checked-out")}
      />
    </div>
  )
}

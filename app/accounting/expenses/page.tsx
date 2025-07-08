"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/status-badge"
import { useExpenses } from "@/hooks/useExpenses"
import { formatCurrency } from "@/lib/utils"
import { Plus, ArrowLeft, CreditCard, Clock, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { toast } from "sonner"

const columns = [
  { key: "date", label: "Date", sortable: true },
  { key: "vendor", label: "Vendor", sortable: true },
  { key: "description", label: "Description", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "amount", label: "Amount", sortable: true },
  { key: "paymentMethod", label: "Payment Method", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
]

const paymentMethods = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
  { value: "card", label: "Card" },
]

export default function ExpensesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const { expenses, stats, loading, error, createExpense, updateExpense, deleteExpense, fetchExpenses } = useExpenses()

  useEffect(() => {
    // Fetch transaction categories for expenses
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/transactions/categories?type=expense")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleStatusUpdate = async (expenseId: string, newStatus: string) => {
    try {
      await updateExpense(expenseId, {
        status: newStatus,
        approvedBy: newStatus === "approved" ? "current-user" : undefined,
      })
      toast.success(`Expense ${newStatus} successfully`)
    } catch (error) {
      toast.error("Failed to update expense status")
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(expenseId)
        toast.success("Expense deleted successfully")
      } catch (error) {
        toast.error("Failed to delete expense")
      }
    }
  }

  const renderCell = (expense: any, column: any) => {
    switch (column.key) {
      case "date":
        return format(new Date(expense.date), "MMM dd, yyyy")
      case "vendor":
        return <span className="font-medium">{expense.vendor}</span>
      case "description":
        return <span className="text-sm">{expense.description}</span>
      case "category":
        return expense.categoryId ? (
          <Badge
            style={{
              backgroundColor: expense.categoryId.color + "20",
              color: expense.categoryId.color,
            }}
          >
            {expense.categoryId.name}
          </Badge>
        ) : null
      case "amount":
        return <span className="font-medium text-red-600">{formatCurrency(expense.amount)}</span>
      case "paymentMethod":
        const method = paymentMethods.find((m) => m.value === expense.paymentMethod)
        return <span className="text-sm">{method?.label}</span>
      case "status":
        return <StatusBadge status={expense.status} variant="expense" />
      case "actions":
        return (
          <div className="flex space-x-2">
            {expense.status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 bg-transparent"
                  onClick={() => handleStatusUpdate(expense._id, "approved")}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 bg-transparent"
                  onClick={() => handleStatusUpdate(expense._id, "rejected")}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
            {expense.status === "approved" && (
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 bg-transparent"
                onClick={() => handleStatusUpdate(expense._id, "paid")}
              >
                Pay
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 bg-transparent"
              onClick={() => handleDeleteExpense(expense._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      default:
        return expense[column.key]
    }
  }

  const expenseStats = stats
    ? {
        total: stats.total.total,
        pending: stats.byStatus.find((s) => s._id === "pending")?.total || 0,
        approved: stats.byStatus.find((s) => s._id === "approved")?.total || 0,
        paid: stats.byStatus.find((s) => s._id === "paid")?.total || 0,
      }
    : { total: 0, pending: 0, approved: 0, paid: 0 }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => fetchExpenses()}>Retry</Button>
        </div>
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
        <div className="flex items-center space-x-4">
          <Link href="/accounting">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Accounting
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expense Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and manage all business expenses</p>
          </div>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <AddExpenseForm categories={categories} onClose={() => setIsAddModalOpen(false)} onSubmit={createExpense} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Expense Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(expenseStats.total)}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-red-600" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(expenseStats.pending)}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(expenseStats.approved)}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(expenseStats.paid)}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Expenses Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>All Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A41]"></div>
              </div>
            ) : (
              <DataTable data={expenses} columns={columns} searchKey="vendor" renderCell={renderCell} />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function AddExpenseForm({
  categories,
  onClose,
  onSubmit,
}: {
  categories: any[]
  onClose: () => void
  onSubmit: (data: any) => Promise<any>
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    vendor: "",
    description: "",
    categoryId: "",
    amount: "",
    paymentMethod: "",
    reference: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        ...formData,
        amount: Number.parseFloat(formData.amount),
        createdBy: "current-user",
      })
      toast.success("Expense created successfully")
      onClose()
    } catch (error) {
      toast.error("Failed to create expense")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor</Label>
          <Input
            id="vendor"
            placeholder="Vendor name"
            value={formData.vendor}
            onChange={(e) => handleChange("vendor", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Expense description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.categoryId} onValueChange={(value) => handleChange("categoryId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => handleChange("paymentMethod", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reference">Reference</Label>
          <Input
            id="reference"
            placeholder="Reference number"
            value={formData.reference}
            onChange={(e) => handleChange("reference", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes..."
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90" disabled={loading}>
          {loading ? "Creating..." : "Add Expense"}
        </Button>
      </div>
    </form>
  )
}

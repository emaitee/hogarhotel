"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { DataTable } from "@/components/shared/DataTable"
import { useTaxRecords } from "@/hooks/useTaxRecords"
import { Calculator, FileText, DollarSign, AlertTriangle, CheckCircle, Clock, Plus, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

export default function TaxManagementPage() {
  const { taxRecords, stats, loading, createTaxRecord, updateTaxRecord, deleteTaxRecord, fetchTaxRecords } =
    useTaxRecords()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [calculatorResult, setCalculatorResult] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    taxType: "",
    period: "",
    startDate: "",
    endDate: "",
    dueDate: "",
    amount: "",
    description: "",
    reference: "",
  })

  const resetForm = () => {
    setFormData({
      taxType: "",
      period: "",
      startDate: "",
      endDate: "",
      dueDate: "",
      amount: "",
      description: "",
      reference: "",
    })
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await createTaxRecord(formData)
    if (success) {
      setIsCreateDialogOpen(false)
      resetForm()
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRecord) {
      const success = await updateTaxRecord(selectedRecord._id, formData)
      if (success) {
        setIsEditDialogOpen(false)
        setSelectedRecord(null)
        resetForm()
      }
    }
  }

  const handleEdit = (record: any) => {
    setSelectedRecord(record)
    setFormData({
      taxType: record.taxType,
      period: record.period,
      startDate: record.startDate.split("T")[0],
      endDate: record.endDate.split("T")[0],
      dueDate: record.dueDate.split("T")[0],
      amount: record.amount.toString(),
      description: record.description || "",
      reference: record.reference || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteTaxRecord(id)
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateTaxRecord(id, { status })
  }

  const calculateTax = (income: number, rate: number) => {
    const result = (income * rate) / 100
    setCalculatorResult(result)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      filed: "outline",
      paid: "default",
      overdue: "destructive",
    } as const

    const icons = {
      pending: Clock,
      filed: FileText,
      paid: CheckCircle,
      overdue: AlertTriangle,
    }

    const Icon = icons[status as keyof typeof icons]

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const columns = [
    {
      accessorKey: "taxType",
      header: "Tax Type",
    },
    {
      accessorKey: "period",
      header: "Period",
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }: any) => format(new Date(row.original.dueDate), "MMM dd, yyyy"),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: any) => `$${row.original.amount.toLocaleString()}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          {row.original.status === "pending" && (
            <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(row.original._id, "filed")}>
              File
            </Button>
          )}
          {row.original.status === "filed" && (
            <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(row.original._id, "paid")}>
              Pay
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Tax Record</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this tax record? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.original._id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tax Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tax Management</h1>
          <p className="text-muted-foreground">Manage tax records and compliance</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calculator className="mr-2 h-4 w-4" />
                Tax Calculator
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tax Calculator</DialogTitle>
                <DialogDescription>Calculate tax amounts based on income and rates</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Income Amount</Label>
                    <Input
                      type="number"
                      placeholder="Enter income"
                      onChange={(e) => {
                        const income = Number.parseFloat(e.target.value) || 0
                        calculateTax(income, 10) // Default 10% rate
                      }}
                    />
                  </div>
                  <div>
                    <Label>Tax Rate (%)</Label>
                    <Select
                      onValueChange={(value) => {
                        const rate = Number.parseFloat(value)
                        const incomeInput = document.querySelector(
                          'input[placeholder="Enter income"]',
                        ) as HTMLInputElement
                        const income = Number.parseFloat(incomeInput?.value || "0")
                        calculateTax(income, rate)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5% - Sales Tax</SelectItem>
                        <SelectItem value="10">10% - Income Tax</SelectItem>
                        <SelectItem value="15">15% - Corporate Tax</SelectItem>
                        <SelectItem value="20">20% - VAT</SelectItem>
                        <SelectItem value="25">25% - Luxury Tax</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <Label>Calculated Tax Amount</Label>
                  <div className="text-2xl font-bold">${calculatorResult.toLocaleString()}</div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Tax Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Tax Record</DialogTitle>
                <DialogDescription>Add a new tax record to track compliance</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taxType">Tax Type</Label>
                    <Select
                      value={formData.taxType}
                      onValueChange={(value) => setFormData({ ...formData, taxType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Income Tax">Income Tax</SelectItem>
                        <SelectItem value="Sales Tax">Sales Tax</SelectItem>
                        <SelectItem value="VAT">VAT</SelectItem>
                        <SelectItem value="Corporate Tax">Corporate Tax</SelectItem>
                        <SelectItem value="Property Tax">Property Tax</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="period">Period</Label>
                    <Input
                      id="period"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="e.g., Q1 2024"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    placeholder="Reference number"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Record</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Liability</p>
                <p className="text-2xl font-bold">${stats?.totalLiability.toLocaleString() || 0}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">${stats?.totalPending.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground">{stats?.pendingCount || 0} records</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">${stats?.totalOverdue.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground">{stats?.overdueCount || 0} records</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold">${stats?.totalPaid.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground">{stats?.paidCount || 0} records</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Records</CardTitle>
          <CardDescription>Manage your tax compliance and filings</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={taxRecords} />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tax Record</DialogTitle>
            <DialogDescription>Update tax record information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-taxType">Tax Type</Label>
                <Select
                  value={formData.taxType}
                  onValueChange={(value) => setFormData({ ...formData, taxType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Income Tax">Income Tax</SelectItem>
                    <SelectItem value="Sales Tax">Sales Tax</SelectItem>
                    <SelectItem value="VAT">VAT</SelectItem>
                    <SelectItem value="Corporate Tax">Corporate Tax</SelectItem>
                    <SelectItem value="Property Tax">Property Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-period">Period</Label>
                <Input
                  id="edit-period"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="e.g., Q1 2024"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-dueDate">Due Date</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-amount">Amount</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-reference">Reference</Label>
              <Input
                id="edit-reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Reference number"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional notes"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Record</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

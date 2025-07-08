"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/DataTable"
import { formatCurrency } from "@/lib/utils"
import { useTaxRecords } from "@/hooks/useTaxRecords"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  ArrowLeft,
  PieChart,
  Calculator,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Download,
  Edit,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

const columns = [
  { key: "taxType", label: "Tax Type", sortable: true },
  { key: "period", label: "Period", sortable: true },
  { key: "taxableAmount", label: "Taxable Amount", sortable: true },
  { key: "taxAmount", label: "Tax Amount", sortable: true },
  { key: "dueDate", label: "Due Date", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
]

export default function TaxManagementPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [calculatorData, setCalculatorData] = useState({
    taxType: "",
    taxableAmount: "",
    taxRate: "",
  })

  const { taxRecords, stats, loading, error, createTaxRecord, updateTaxRecord, deleteTaxRecord, fetchTaxRecords } =
    useTaxRecords()
  const { toast } = useToast()

  const renderCell = (tax: any, column: any) => {
    switch (column.key) {
      case "taxType":
        return <span className="font-medium">{tax.taxType}</span>
      case "period":
        return (
          <span className="text-sm">
            {format(new Date(tax.period.startDate), "MMM yyyy")} - {format(new Date(tax.period.endDate), "MMM yyyy")}
          </span>
        )
      case "taxableAmount":
        return <span className="font-medium">{formatCurrency(tax.taxableAmount)}</span>
      case "taxAmount":
        return (
          <div>
            <div className="font-medium">{formatCurrency(tax.taxAmount)}</div>
            <div className="text-sm text-gray-500">{tax.taxRate}%</div>
          </div>
        )
      case "dueDate":
        return (
          <div>
            <div className="font-medium">{format(new Date(tax.dueDate), "MMM dd, yyyy")}</div>
            {tax.status === "overdue" && <div className="text-xs text-red-500">Overdue</div>}
          </div>
        )
      case "status":
        const statusConfig = {
          pending: { color: "bg-yellow-100 text-yellow-800", icon: Calendar },
          filed: { color: "bg-blue-100 text-blue-800", icon: FileText },
          paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
          overdue: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
        }
        const config = statusConfig[tax.status as keyof typeof statusConfig]
        const StatusIcon = config.icon
        return (
          <Badge className={config.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {tax.status}
          </Badge>
        )
      case "actions":
        return (
          <div className="flex space-x-2">
            {tax.status === "pending" && (
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 bg-transparent"
                onClick={() => handleStatusUpdate(tax._id, "filed")}
              >
                File
              </Button>
            )}
            {tax.status === "filed" && (
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 bg-transparent"
                onClick={() => handleStatusUpdate(tax._id, "paid")}
              >
                Pay
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )
      default:
        return tax[column.key]
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateTaxRecord(id, { status })
      toast({
        title: "Success",
        description: `Tax record ${status} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tax record",
        variant: "destructive",
      })
    }
  }

  const calculateTax = () => {
    const { taxableAmount, taxRate } = calculatorData
    if (taxableAmount && taxRate) {
      const amount = Number.parseFloat(taxableAmount)
      const rate = Number.parseFloat(taxRate)
      const taxAmount = (amount * rate) / 100
      toast({
        title: "Tax Calculation",
        description: `Tax Amount: ${formatCurrency(taxAmount)}`,
      })
    }
  }

  const getStatValue = (statArray: any[], key: string, defaultValue = 0) => {
    const stat = statArray?.find((s) => s._id === key)
    return stat?.total || defaultValue
  }

  if (loading && taxRecords.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const totalTaxAmount = stats?.total.totalTax || 0
  const pendingTax = getStatValue(stats?.byStatus, "pending")
  const overdueTax = getStatValue(stats?.byStatus, "overdue")
  const paidTax = getStatValue(stats?.byStatus, "paid")

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tax Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage tax calculations, filings, and payments</p>
          </div>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Tax Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tax Record</DialogTitle>
            </DialogHeader>
            <AddTaxForm onClose={() => setIsAddModalOpen(false)} onCreate={createTaxRecord} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Tax Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tax Liability</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalTaxAmount)}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full">
                  <PieChart className="h-6 w-6 text-purple-600" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tax</p>
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingTax)}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-yellow-600" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Tax</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(overdueTax)}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Tax</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(paidTax)}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tax Records Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Tax Records</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={taxRecords} columns={columns} searchKey="taxType" renderCell={renderCell} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Tax Calculator */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle>Tax Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Tax Type</Label>
                <Select
                  value={calculatorData.taxType}
                  onValueChange={(value) => setCalculatorData((prev) => ({ ...prev, taxType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income_tax">Income Tax (30%)</SelectItem>
                    <SelectItem value="sales_tax">Sales Tax (7.5%)</SelectItem>
                    <SelectItem value="property_tax">Property Tax (0.5%)</SelectItem>
                    <SelectItem value="payroll_tax">Payroll Tax (10%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Taxable Amount</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={calculatorData.taxableAmount}
                  onChange={(e) => setCalculatorData((prev) => ({ ...prev, taxableAmount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={calculatorData.taxRate}
                  onChange={(e) => setCalculatorData((prev) => ({ ...prev, taxRate: e.target.value }))}
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-[#1B2A41] hover:bg-[#1B2A41]/90" onClick={calculateTax}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function AddTaxForm({ onClose, onCreate }: { onClose: () => void; onCreate: (data: any) => Promise<any> }) {
  const [formData, setFormData] = useState({
    taxType: "",
    startDate: "",
    endDate: "",
    taxableAmount: "",
    taxRate: "",
    dueDate: "",
    reference: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onCreate({
        ...formData,
        taxableAmount: Number.parseFloat(formData.taxableAmount),
        taxRate: Number.parseFloat(formData.taxRate),
        period: {
          startDate: formData.startDate,
          endDate: formData.endDate,
        },
      })

      toast({
        title: "Success",
        description: "Tax record created successfully",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tax record",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxType">Tax Type</Label>
          <Select
            value={formData.taxType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, taxType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tax type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income_tax">Income Tax</SelectItem>
              <SelectItem value="sales_tax">Sales Tax</SelectItem>
              <SelectItem value="property_tax">Property Tax</SelectItem>
              <SelectItem value="payroll_tax">Payroll Tax</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reference">Reference</Label>
          <Input
            id="reference"
            placeholder="Tax reference number"
            value={formData.reference}
            onChange={(e) => setFormData((prev) => ({ ...prev, reference: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Period Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Period End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxableAmount">Taxable Amount</Label>
          <Input
            id="taxableAmount"
            type="number"
            placeholder="0"
            value={formData.taxableAmount}
            onChange={(e) => setFormData((prev) => ({ ...prev, taxableAmount: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            placeholder="0"
            value={formData.taxRate}
            onChange={(e) => setFormData((prev) => ({ ...prev, taxRate: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          placeholder="Additional notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Add Tax Record
        </Button>
      </div>
    </form>
  )
}

"use client"

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
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface TaxRecord {
  id: string
  taxType: string
  period: string
  taxableAmount: number
  taxRate: number
  taxAmount: number
  status: "pending" | "filed" | "paid" | "overdue"
  dueDate: Date
  filedDate?: Date
  paidDate?: Date
}

const taxData: TaxRecord[] = [
  {
    id: "1",
    taxType: "VAT",
    period: "2024-01",
    taxableAmount: 2000000,
    taxRate: 7.5,
    taxAmount: 150000,
    status: "paid",
    dueDate: new Date("2024-02-15"),
    filedDate: new Date("2024-02-10"),
    paidDate: new Date("2024-02-12"),
  },
  {
    id: "2",
    taxType: "Corporate Income Tax",
    period: "2023",
    taxableAmount: 5000000,
    taxRate: 30,
    taxAmount: 1500000,
    status: "filed",
    dueDate: new Date("2024-03-31"),
    filedDate: new Date("2024-03-15"),
  },
  {
    id: "3",
    taxType: "Withholding Tax",
    period: "2024-01",
    taxableAmount: 800000,
    taxRate: 10,
    taxAmount: 80000,
    status: "pending",
    dueDate: new Date("2024-02-21"),
  },
  {
    id: "4",
    taxType: "VAT",
    period: "2024-02",
    taxableAmount: 2200000,
    taxRate: 7.5,
    taxAmount: 165000,
    status: "overdue",
    dueDate: new Date("2024-03-15"),
  },
]

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

  const renderCell = (tax: TaxRecord, column: any) => {
    switch (column.key) {
      case "taxType":
        return <span className="font-medium">{tax.taxType}</span>
      case "period":
        return <span className="text-sm">{tax.period}</span>
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
            <div className="font-medium">{format(tax.dueDate, "MMM dd, yyyy")}</div>
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
        const config = statusConfig[tax.status]
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
              <Button size="sm" variant="outline" className="text-blue-600 bg-transparent">
                File
              </Button>
            )}
            {tax.status === "filed" && (
              <Button size="sm" variant="outline" className="text-green-600 bg-transparent">
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
        return tax[column.key as keyof TaxRecord]
    }
  }

  const totalTaxAmount = taxData.reduce((sum, tax) => sum + tax.taxAmount, 0)
  const pendingTax = taxData.filter((t) => t.status === "pending").reduce((sum, tax) => sum + tax.taxAmount, 0)
  const overdueTax = taxData.filter((t) => t.status === "overdue").reduce((sum, tax) => sum + tax.taxAmount, 0)
  const paidTax = taxData.filter((t) => t.status === "paid").reduce((sum, tax) => sum + tax.taxAmount, 0)

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
            <AddTaxForm onClose={() => setIsAddModalOpen(false)} />
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
            <DataTable data={taxData} columns={columns} searchKey="taxType" renderCell={renderCell} />
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vat">VAT (7.5%)</SelectItem>
                    <SelectItem value="cit">Corporate Income Tax (30%)</SelectItem>
                    <SelectItem value="wht">Withholding Tax (10%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Taxable Amount</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-[#1B2A41] hover:bg-[#1B2A41]/90">
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

function AddTaxForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxType">Tax Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select tax type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vat">VAT</SelectItem>
              <SelectItem value="cit">Corporate Income Tax</SelectItem>
              <SelectItem value="wht">Withholding Tax</SelectItem>
              <SelectItem value="paye">PAYE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="period">Period</Label>
          <Input id="period" placeholder="e.g., 2024-01" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxableAmount">Taxable Amount</Label>
          <Input id="taxableAmount" type="number" placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input id="taxRate" type="number" placeholder="0" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" type="date" />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          Add Tax Record
        </Button>
      </div>
    </form>
  )
}

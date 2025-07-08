"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/DataTable"
import { formatCurrency } from "@/lib/utils"
import {
  Plus,
  ArrowLeft,
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"

interface Budget {
  id: string
  category: string
  budgetAmount: number
  actualAmount: number
  period: string
  status: "on-track" | "over-budget" | "under-budget"
  variance: number
  variancePercentage: number
}

const budgetData: Budget[] = [
  {
    id: "1",
    category: "Room Operations",
    budgetAmount: 500000,
    actualAmount: 450000,
    period: "2024-01",
    status: "under-budget",
    variance: -50000,
    variancePercentage: -10,
  },
  {
    id: "2",
    category: "Staff Salaries",
    budgetAmount: 800000,
    actualAmount: 820000,
    period: "2024-01",
    status: "over-budget",
    variance: 20000,
    variancePercentage: 2.5,
  },
  {
    id: "3",
    category: "Utilities",
    budgetAmount: 200000,
    actualAmount: 195000,
    period: "2024-01",
    status: "on-track",
    variance: -5000,
    variancePercentage: -2.5,
  },
  {
    id: "4",
    category: "Marketing",
    budgetAmount: 150000,
    actualAmount: 180000,
    period: "2024-01",
    status: "over-budget",
    variance: 30000,
    variancePercentage: 20,
  },
  {
    id: "5",
    category: "Maintenance",
    budgetAmount: 300000,
    actualAmount: 275000,
    period: "2024-01",
    status: "under-budget",
    variance: -25000,
    variancePercentage: -8.3,
  },
]

const columns = [
  { key: "category", label: "Category", sortable: true },
  { key: "budgetAmount", label: "Budget", sortable: true },
  { key: "actualAmount", label: "Actual", sortable: true },
  { key: "variance", label: "Variance", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "progress", label: "Progress", sortable: false },
  { key: "actions", label: "Actions", sortable: false },
]

export default function BudgetManagementPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const renderCell = (budget: Budget, column: any) => {
    switch (column.key) {
      case "category":
        return <span className="font-medium">{budget.category}</span>
      case "budgetAmount":
        return <span className="font-medium">{formatCurrency(budget.budgetAmount)}</span>
      case "actualAmount":
        return <span className="font-medium">{formatCurrency(budget.actualAmount)}</span>
      case "variance":
        return (
          <div className="flex items-center space-x-1">
            {budget.variance > 0 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
            <span className={`font-medium ${budget.variance > 0 ? "text-red-600" : "text-green-600"}`}>
              {budget.variance > 0 ? "+" : ""}
              {formatCurrency(budget.variance)}
            </span>
            <span className={`text-sm ${budget.variance > 0 ? "text-red-500" : "text-green-500"}`}>
              ({budget.variancePercentage > 0 ? "+" : ""}
              {budget.variancePercentage.toFixed(1)}%)
            </span>
          </div>
        )
      case "status":
        const statusConfig = {
          "on-track": { color: "bg-green-100 text-green-800", icon: CheckCircle },
          "over-budget": { color: "bg-red-100 text-red-800", icon: AlertTriangle },
          "under-budget": { color: "bg-blue-100 text-blue-800", icon: TrendingDown },
        }
        const config = statusConfig[budget.status]
        const StatusIcon = config.icon
        return (
          <Badge className={config.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {budget.status.replace("-", " ")}
          </Badge>
        )
      case "progress":
        const percentage = (budget.actualAmount / budget.budgetAmount) * 100
        return (
          <div className="w-full">
            <Progress value={Math.min(percentage, 100)} className="w-full" />
            <span className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</span>
          </div>
        )
      case "actions":
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      default:
        return budget[column.key as keyof Budget]
    }
  }

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budgetAmount, 0)
  const totalActual = budgetData.reduce((sum, item) => sum + item.actualAmount, 0)
  const totalVariance = totalActual - totalBudget
  const variancePercentage = (totalVariance / totalBudget) * 100

  const onTrackCount = budgetData.filter((b) => b.status === "on-track").length
  const overBudgetCount = budgetData.filter((b) => b.status === "over-budget").length
  const underBudgetCount = budgetData.filter((b) => b.status === "under-budget").length

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budget Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Plan, track, and manage your financial budgets</p>
          </div>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Budget</DialogTitle>
            </DialogHeader>
            <AddBudgetForm onClose={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalBudget)}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                  <Calculator className="h-6 w-6 text-blue-600" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Actual Spending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalActual)}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Variance</p>
                  <p className={`text-2xl font-bold ${totalVariance > 0 ? "text-red-600" : "text-green-600"}`}>
                    {totalVariance > 0 ? "+" : ""}
                    {formatCurrency(totalVariance)}
                  </p>
                  <div className="flex items-center mt-1">
                    {totalVariance > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span className={`text-sm ${totalVariance > 0 ? "text-red-500" : "text-green-500"}`}>
                      {variancePercentage > 0 ? "+" : ""}
                      {variancePercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-full ${totalVariance > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20"}`}
                >
                  {totalVariance > 0 ? (
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Budget Status</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">On Track</span>
                    <span className="font-medium">{onTrackCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Over Budget</span>
                    <span className="font-medium">{overBudgetCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">Under Budget</span>
                    <span className="font-medium">{underBudgetCount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Budget Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={budgetData} columns={columns} searchKey="category" renderCell={renderCell} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function AddBudgetForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="room-operations">Room Operations</SelectItem>
              <SelectItem value="staff-salaries">Staff Salaries</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="food-beverage">Food & Beverage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="period">Period</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-01">January 2024</SelectItem>
              <SelectItem value="2024-02">February 2024</SelectItem>
              <SelectItem value="2024-03">March 2024</SelectItem>
              <SelectItem value="2024-q1">Q1 2024</SelectItem>
              <SelectItem value="2024">Annual 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budgetAmount">Budget Amount</Label>
        <Input id="budgetAmount" type="number" placeholder="0" />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          Add Budget
        </Button>
      </div>
    </form>
  )
}

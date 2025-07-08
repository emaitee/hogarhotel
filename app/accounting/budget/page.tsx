"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { useBudgets } from "@/hooks/useBudgets"
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
import { toast } from "sonner"

const columns = [
  { key: "name", label: "Budget Name", sortable: true },
  { key: "period", label: "Period", sortable: true },
  { key: "totalBudget", label: "Budget", sortable: true },
  { key: "totalActual", label: "Actual", sortable: true },
  { key: "variance", label: "Variance", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "progress", label: "Progress", sortable: false },
  { key: "actions", label: "Actions", sortable: false },
]

export default function BudgetManagementPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const { budgets, loading, error, createBudget, updateBudget, deleteBudget, fetchBudgets } = useBudgets()

  useEffect(() => {
    // Fetch transaction categories
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/transactions/categories")
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

  const handleDeleteBudget = async (budgetId: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      try {
        await deleteBudget(budgetId)
        toast.success("Budget deleted successfully")
      } catch (error) {
        toast.error("Failed to delete budget")
      }
    }
  }

  const renderCell = (budget: any, column: any) => {
    switch (column.key) {
      case "name":
        return <span className="font-medium">{budget.name}</span>
      case "period":
        return (
          <div>
            <div className="font-medium">{budget.period}</div>
            <div className="text-sm text-gray-500">
              {budget.year}
              {budget.month ? `-${budget.month.toString().padStart(2, "0")}` : ""}
            </div>
          </div>
        )
      case "totalBudget":
        return <span className="font-medium">{formatCurrency(budget.totalBudget)}</span>
      case "totalActual":
        return <span className="font-medium">{formatCurrency(budget.totalActual)}</span>
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
              ({budget.totalBudget > 0 ? ((budget.variance / budget.totalBudget) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        )
      case "status":
        const statusConfig = {
          draft: { color: "bg-gray-100 text-gray-800", icon: Edit },
          approved: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
          active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
          closed: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
        }
        const config = statusConfig[budget.status as keyof typeof statusConfig]
        const StatusIcon = config.icon
        return (
          <Badge className={config.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {budget.status}
          </Badge>
        )
      case "progress":
        const percentage = budget.totalBudget > 0 ? (budget.totalActual / budget.totalBudget) * 100 : 0
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
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 bg-transparent"
              onClick={() => handleDeleteBudget(budget._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      default:
        return budget[column.key]
    }
  }

  const totalBudget = budgets.reduce((sum, item) => sum + item.totalBudget, 0)
  const totalActual = budgets.reduce((sum, item) => sum + item.totalActual, 0)
  const totalVariance = totalActual - totalBudget
  const variancePercentage = totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0

  const onTrackCount = budgets.filter((b) => Math.abs(b.variance / b.totalBudget) <= 0.05).length
  const overBudgetCount = budgets.filter((b) => b.variance > 0).length
  const underBudgetCount = budgets.filter((b) => b.variance < 0).length

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => fetchBudgets()}>Retry</Button>
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
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Budget</DialogTitle>
            </DialogHeader>
            <AddBudgetForm categories={categories} onClose={() => setIsAddModalOpen(false)} onSubmit={createBudget} />
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
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A41]"></div>
              </div>
            ) : (
              <DataTable data={budgets} columns={columns} searchKey="name" renderCell={renderCell} />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function AddBudgetForm({
  categories,
  onClose,
  onSubmit,
}: {
  categories: any[]
  onClose: () => void
  onSubmit: (data: any) => Promise<any>
}) {
  const [formData, setFormData] = useState({
    name: "",
    year: new Date().getFullYear(),
    month: "",
    period: "monthly" as "monthly" | "quarterly" | "annual",
    categories: [] as Array<{ categoryId: string; budgetedAmount: number }>,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        ...formData,
        month: formData.month ? Number.parseInt(formData.month) : undefined,
        createdBy: "current-user",
      })
      toast.success("Budget created successfully")
      onClose()
    } catch (error) {
      toast.error("Failed to create budget")
    } finally {
      setLoading(false)
    }
  }

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, { categoryId: "", budgetedAmount: 0 }],
    }))
  }

  const updateCategory = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat, i) => (i === index ? { ...cat, [field]: value } : cat)),
    }))
  }

  const removeCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Budget Name</Label>
          <Input
            id="name"
            placeholder="Budget name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="period">Period</Label>
          <Select
            value={formData.period}
            onValueChange={(value: "monthly" | "quarterly" | "annual") =>
              setFormData((prev) => ({ ...prev, period: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData((prev) => ({ ...prev, year: Number.parseInt(e.target.value) }))}
            required
          />
        </div>
        {formData.period === "monthly" && (
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select
              value={formData.month}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, month: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(2024, i).toLocaleString("default", { month: "long" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Budget Categories</Label>
          <Button type="button" variant="outline" size="sm" onClick={addCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {formData.categories.map((category, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category.categoryId} onValueChange={(value) => updateCategory(index, "categoryId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Budgeted Amount</Label>
              <Input
                type="number"
                placeholder="0"
                value={category.budgetedAmount}
                onChange={(e) => updateCategory(index, "budgetedAmount", Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-red-600 bg-transparent"
                onClick={() => removeCategory(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90" disabled={loading}>
          {loading ? "Creating..." : "Create Budget"}
        </Button>
      </div>
    </form>
  )
}

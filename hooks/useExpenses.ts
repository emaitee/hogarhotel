"use client"

import { useState, useEffect } from "react"

interface Expense {
  _id: string
  date: string
  vendor: string
  description: string
  categoryId: {
    _id: string
    name: string
    color: string
    type: string
  }
  amount: number
  paymentMethod: string
  reference?: string
  status: "pending" | "approved" | "paid" | "rejected"
  approvedBy?: string
  approvedAt?: string
  paidAt?: string
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface ExpenseStats {
  total: { total: number; count: number; average: number }
  byStatus: Array<{ _id: string; total: number; count: number }>
  byCategory: Array<{ _id: string; categoryName: string; categoryColor: string; total: number; count: number }>
  monthlyTrend: Array<{ _id: { year: number; month: number }; total: number; count: number }>
}

interface UseExpensesReturn {
  expenses: Expense[]
  stats: ExpenseStats | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  createExpense: (expenseData: any) => Promise<Expense>
  updateExpense: (id: string, updates: any) => Promise<Expense>
  deleteExpense: (id: string) => Promise<void>
  fetchExpenses: (filters?: any) => Promise<void>
  fetchStats: (filters?: any) => Promise<void>
}

export function useExpenses(): UseExpensesReturn {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [stats, setStats] = useState<ExpenseStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  const fetchExpenses = async (filters: any = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key])
      })

      const response = await fetch(`/api/expenses?${params}`)
      if (!response.ok) throw new Error("Failed to fetch expenses")

      const data = await response.json()
      setExpenses(data.expenses)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async (filters: any = {}) => {
    try {
      const params = new URLSearchParams()
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key])
      })

      const response = await fetch(`/api/expenses/stats?${params}`)
      if (!response.ok) throw new Error("Failed to fetch expense statistics")

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error("Error fetching expense stats:", err)
    }
  }

  const createExpense = async (expenseData: any): Promise<Expense> => {
    try {
      setError(null)

      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create expense")
      }

      const newExpense = await response.json()
      setExpenses((prev) => [newExpense, ...prev])
      return newExpense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateExpense = async (id: string, updates: any): Promise<Expense> => {
    try {
      setError(null)

      const response = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update expense")
      }

      const updatedExpense = await response.json()
      setExpenses((prev) => prev.map((expense) => (expense._id === id ? updatedExpense : expense)))
      return updatedExpense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteExpense = async (id: string): Promise<void> => {
    try {
      setError(null)

      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete expense")
      }

      setExpenses((prev) => prev.filter((expense) => expense._id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchExpenses()
    fetchStats()
  }, [])

  return {
    expenses,
    stats,
    loading,
    error,
    pagination,
    createExpense,
    updateExpense,
    deleteExpense,
    fetchExpenses,
    fetchStats,
  }
}

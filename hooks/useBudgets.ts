"use client"

import { useState, useEffect } from "react"

interface BudgetCategory {
  categoryId: {
    _id: string
    name: string
    color: string
    type: string
  }
  budgetedAmount: number
  actualAmount: number
  variance: number
  variancePercentage: number
}

interface Budget {
  _id: string
  name: string
  year: number
  month?: number
  period: "monthly" | "quarterly" | "annual"
  categories: BudgetCategory[]
  totalBudget: number
  totalActual: number
  variance: number
  status: "draft" | "approved" | "active" | "closed"
  createdBy: string
  approvedBy?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

interface UseBudgetsReturn {
  budgets: Budget[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  createBudget: (budgetData: any) => Promise<Budget>
  updateBudget: (id: string, updates: any) => Promise<Budget>
  deleteBudget: (id: string) => Promise<void>
  fetchBudgets: (filters?: any) => Promise<void>
}

export function useBudgets(): UseBudgetsReturn {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  const fetchBudgets = async (filters: any = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key])
      })

      const response = await fetch(`/api/budgets?${params}`)
      if (!response.ok) throw new Error("Failed to fetch budgets")

      const data = await response.json()
      setBudgets(data.budgets)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createBudget = async (budgetData: any): Promise<Budget> => {
    try {
      setError(null)

      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create budget")
      }

      const newBudget = await response.json()
      setBudgets((prev) => [newBudget, ...prev])
      return newBudget
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateBudget = async (id: string, updates: any): Promise<Budget> => {
    try {
      setError(null)

      const response = await fetch(`/api/budgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update budget")
      }

      const updatedBudget = await response.json()
      setBudgets((prev) => prev.map((budget) => (budget._id === id ? updatedBudget : budget)))
      return updatedBudget
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteBudget = async (id: string): Promise<void> => {
    try {
      setError(null)

      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete budget")
      }

      setBudgets((prev) => prev.filter((budget) => budget._id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  return {
    budgets,
    loading,
    error,
    pagination,
    createBudget,
    updateBudget,
    deleteBudget,
    fetchBudgets,
  }
}

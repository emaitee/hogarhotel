"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

export interface TransactionEntry {
  accountCode: string
  accountName: string
  debit: number
  credit: number
}

export interface Transaction {
  _id: string
  transactionNumber: string
  date: string
  description: string
  reference?: string
  category: string
  entries: TransactionEntry[]
  totalAmount: number
  status: "Draft" | "Posted" | "Cancelled"
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionData {
  date?: string
  description: string
  reference?: string
  category: string
  entries: TransactionEntry[]
  createdBy?: string
}

export interface TransactionFilters {
  page?: number
  limit?: number
  status?: string
  category?: string
  startDate?: string
  endDate?: string
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  const fetchTransactions = async (filters: TransactionFilters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/transactions?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setTransactions(result.data)
        setPagination(result.pagination)
        setError(null)
      } else {
        setError(result.error || "Failed to fetch transactions")
        toast.error(result.error || "Failed to fetch transactions")
      }
    } catch (err) {
      const errorMessage = "Failed to fetch transactions"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createTransaction = async (transactionData: CreateTransactionData): Promise<boolean> => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      })

      const result = await response.json()

      if (result.success) {
        setTransactions((prev) => [result.data, ...prev])
        toast.success("Transaction created successfully")
        return true
      } else {
        toast.error(result.error || "Failed to create transaction")
        return false
      }
    } catch (err) {
      toast.error("Failed to create transaction")
      return false
    }
  }

  const updateTransactionStatus = async (id: string, status: "Draft" | "Posted" | "Cancelled"): Promise<boolean> => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()

      if (result.success) {
        setTransactions((prev) => prev.map((transaction) => (transaction._id === id ? result.data : transaction)))
        toast.success("Transaction status updated successfully")
        return true
      } else {
        toast.error(result.error || "Failed to update transaction")
        return false
      }
    } catch (err) {
      toast.error("Failed to update transaction")
      return false
    }
  }

  const deleteTransaction = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setTransactions((prev) => prev.filter((transaction) => transaction._id !== id))
        toast.success("Transaction deleted successfully")
        return true
      } else {
        toast.error(result.error || "Failed to delete transaction")
        return false
      }
    } catch (err) {
      toast.error("Failed to delete transaction")
      return false
    }
  }

  const fetchCategories = async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/transactions/categories")
      const result = await response.json()

      if (result.success) {
        return result.data
      } else {
        toast.error("Failed to fetch categories")
        return []
      }
    } catch (err) {
      toast.error("Failed to fetch categories")
      return []
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return {
    transactions,
    loading,
    error,
    pagination,
    fetchTransactions,
    createTransaction,
    updateTransactionStatus,
    deleteTransaction,
    fetchCategories,
  }
}

"use client"

import { useState, useEffect } from "react"
import type { ITransactionWithDetails, ITransactionCategory } from "@/lib/models/Transaction"

export function useTransactions() {
  const [transactions, setTransactions] = useState<ITransactionWithDetails[]>([])
  const [categories, setCategories] = useState<ITransactionCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/transactions")
      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }
      const data = await response.json()
      setTransactions(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/transactions/categories")
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }

  const createTransaction = async (transactionData: any) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create transaction")
      }

      const newTransaction = await response.json()
      await fetchTransactions() // Refetch to get updated data with relations
      return newTransaction
    } catch (err) {
      throw err
    }
  }

  const updateTransaction = async (id: string, updateData: any) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update transaction")
      }

      const updatedTransaction = await response.json()
      await fetchTransactions() // Refetch to get updated data
      return updatedTransaction
    } catch (err) {
      throw err
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete transaction")
      }

      setTransactions((prev) => prev.filter((transaction) => transaction._id?.toString() !== id))
    } catch (err) {
      throw err
    }
  }

  const createCategory = async (categoryData: Omit<ITransactionCategory, "_id">) => {
    try {
      const response = await fetch("/api/transactions/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create category")
      }

      const newCategory = await response.json()
      setCategories((prev) => [...prev, newCategory])
      return newCategory
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchTransactions()
    fetchCategories()
  }, [])

  return {
    transactions,
    categories,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createCategory,
  }
}

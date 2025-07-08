"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

export interface Account {
  _id: string
  code: string
  name: string
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense"
  category: string
  balance: number
  parentAccount?: string
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAccountData {
  code: string
  name: string
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense"
  category: string
  balance?: number
  parentAccount?: string
  description?: string
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/accounts")
      const result = await response.json()

      if (result.success) {
        setAccounts(result.data)
        setError(null)
      } else {
        setError(result.error || "Failed to fetch accounts")
        toast.error(result.error || "Failed to fetch accounts")
      }
    } catch (err) {
      const errorMessage = "Failed to fetch accounts"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createAccount = async (accountData: CreateAccountData): Promise<boolean> => {
    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      })

      const result = await response.json()

      if (result.success) {
        setAccounts((prev) => [...prev, result.data])
        toast.success("Account created successfully")
        return true
      } else {
        toast.error(result.error || "Failed to create account")
        return false
      }
    } catch (err) {
      toast.error("Failed to create account")
      return false
    }
  }

  const updateAccount = async (id: string, accountData: Partial<CreateAccountData>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      })

      const result = await response.json()

      if (result.success) {
        setAccounts((prev) => prev.map((account) => (account._id === id ? result.data : account)))
        toast.success("Account updated successfully")
        return true
      } else {
        toast.error(result.error || "Failed to update account")
        return false
      }
    } catch (err) {
      toast.error("Failed to update account")
      return false
    }
  }

  const deleteAccount = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        setAccounts((prev) => prev.filter((account) => account._id !== id))
        toast.success("Account deleted successfully")
        return true
      } else {
        toast.error(result.error || "Failed to delete account")
        return false
      }
    } catch (err) {
      toast.error("Failed to delete account")
      return false
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  }
}

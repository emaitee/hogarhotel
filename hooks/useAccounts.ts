"use client"

import { useState, useEffect } from "react"
import type { IAccount } from "@/lib/models/Account"

export function useAccounts() {
  const [accounts, setAccounts] = useState<IAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/accounts")
      if (!response.ok) {
        throw new Error("Failed to fetch accounts")
      }
      const data = await response.json()
      setAccounts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createAccount = async (accountData: Omit<IAccount, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create account")
      }

      const newAccount = await response.json()
      setAccounts((prev) => [...prev, newAccount])
      return newAccount
    } catch (err) {
      throw err
    }
  }

  const updateAccount = async (id: string, updateData: Partial<IAccount>) => {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update account")
      }

      const updatedAccount = await response.json()
      setAccounts((prev) => prev.map((account) => (account._id?.toString() === id ? updatedAccount : account)))
      return updatedAccount
    } catch (err) {
      throw err
    }
  }

  const deleteAccount = async (id: string) => {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete account")
      }

      setAccounts((prev) => prev.filter((account) => account._id?.toString() !== id))
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  return {
    accounts,
    loading,
    error,
    refetch: fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  }
}

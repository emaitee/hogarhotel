"use client"

import { useState, useEffect } from "react"
import type { Bill, CreateBillData, UpdateBillData, PaymentData } from "@/lib/models/Bill"

export function useBilling() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBills = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/bills")
      if (!response.ok) throw new Error("Failed to fetch bills")
      const data = await response.json()
      setBills(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createBill = async (billData: CreateBillData) => {
    try {
      const response = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billData),
      })

      if (!response.ok) throw new Error("Failed to create bill")

      const newBill = await response.json()
      setBills((prev) => [newBill, ...prev])
      return newBill
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create bill")
    }
  }

  const updateBill = async (id: string, billData: UpdateBillData) => {
    try {
      const response = await fetch(`/api/bills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billData),
      })

      if (!response.ok) throw new Error("Failed to update bill")

      await fetchBills() // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update bill")
    }
  }

  const deleteBill = async (id: string) => {
    try {
      const response = await fetch(`/api/bills/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete bill")

      setBills((prev) => prev.filter((bill) => bill._id?.toString() !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete bill")
    }
  }

  const payBill = async (id: string, paymentData: PaymentData) => {
    try {
      const response = await fetch(`/api/bills/${id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) throw new Error("Failed to process payment")

      await fetchBills() // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to process payment")
    }
  }

  useEffect(() => {
    fetchBills()
  }, [])

  return {
    bills,
    loading,
    error,
    createBill,
    updateBill,
    deleteBill,
    payBill,
    refetch: fetchBills,
  }
}

"use client"

import { useState, useEffect } from "react"

interface TaxRecord {
  _id: string
  taxType: string
  period: string
  taxableAmount: number
  taxRate: number
  taxAmount: number
  status: "pending" | "filed" | "paid" | "overdue"
  dueDate: string
  filedDate?: string
  paidDate?: string
  reference?: string
  notes?: string
  createdBy: string
  filedBy?: string
  createdAt: string
  updatedAt: string
}

interface TaxStats {
  total: { totalTax: number; totalTaxable: number; count: number }
  byStatus: Array<{ _id: string; total: number; count: number }>
  byType: Array<{ _id: string; total: number; count: number }>
  upcomingDue: TaxRecord[]
}

interface UseTaxRecordsReturn {
  taxRecords: TaxRecord[]
  stats: TaxStats | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  createTaxRecord: (taxData: any) => Promise<TaxRecord>
  updateTaxRecord: (id: string, updates: any) => Promise<TaxRecord>
  deleteTaxRecord: (id: string) => Promise<void>
  fetchTaxRecords: (filters?: any) => Promise<void>
  fetchStats: (filters?: any) => Promise<void>
}

export function useTaxRecords(): UseTaxRecordsReturn {
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([])
  const [stats, setStats] = useState<TaxStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  const fetchTaxRecords = async (filters: any = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key])
      })

      const response = await fetch(`/api/tax-records?${params}`)
      if (!response.ok) throw new Error("Failed to fetch tax records")

      const data = await response.json()
      setTaxRecords(data.taxRecords)
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

      const response = await fetch(`/api/tax-records/stats?${params}`)
      if (!response.ok) throw new Error("Failed to fetch tax statistics")

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error("Error fetching tax stats:", err)
    }
  }

  const createTaxRecord = async (taxData: any): Promise<TaxRecord> => {
    try {
      setError(null)

      const response = await fetch("/api/tax-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taxData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create tax record")
      }

      const newTaxRecord = await response.json()
      setTaxRecords((prev) => [newTaxRecord, ...prev])
      return newTaxRecord
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateTaxRecord = async (id: string, updates: any): Promise<TaxRecord> => {
    try {
      setError(null)

      const response = await fetch(`/api/tax-records/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update tax record")
      }

      const updatedTaxRecord = await response.json()
      setTaxRecords((prev) => prev.map((record) => (record._id === id ? updatedTaxRecord : record)))
      return updatedTaxRecord
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteTaxRecord = async (id: string): Promise<void> => {
    try {
      setError(null)

      const response = await fetch(`/api/tax-records/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete tax record")
      }

      setTaxRecords((prev) => prev.filter((record) => record._id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchTaxRecords()
    fetchStats()
  }, [])

  return {
    taxRecords,
    stats,
    loading,
    error,
    pagination,
    createTaxRecord,
    updateTaxRecord,
    deleteTaxRecord,
    fetchTaxRecords,
    fetchStats,
  }
}

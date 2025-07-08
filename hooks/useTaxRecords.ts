"use client"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

interface TaxRecord {
  _id: string
  taxType: string
  period: string
  startDate: string
  endDate: string
  dueDate: string
  amount: number
  status: "pending" | "filed" | "paid" | "overdue"
  filedDate?: string
  paidDate?: string
  description?: string
  reference?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface TaxStats {
  totalLiability: number
  totalPending: number
  totalOverdue: number
  totalPaid: number
  pendingCount: number
  overdueCount: number
  filedCount: number
  paidCount: number
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
  createTaxRecord: (data: Partial<TaxRecord>) => Promise<boolean>
  updateTaxRecord: (id: string, data: Partial<TaxRecord>) => Promise<boolean>
  deleteTaxRecord: (id: string) => Promise<boolean>
  fetchTaxRecords: (filters?: { status?: string; taxType?: string; page?: number }) => Promise<void>
  refreshStats: () => Promise<void>
}

export function useTaxRecords(): UseTaxRecordsReturn {
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([])
  const [stats, setStats] = useState<TaxStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  const fetchTaxRecords = async (filters: { status?: string; taxType?: string; page?: number } = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.status) params.append("status", filters.status)
      if (filters.taxType) params.append("taxType", filters.taxType)
      params.append("page", (filters.page || pagination.page).toString())
      params.append("limit", pagination.limit.toString())

      const response = await fetch(`/api/tax-records?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch tax records")
      }

      setTaxRecords(result.data)
      setPagination(result.pagination)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshStats = async () => {
    try {
      const response = await fetch("/api/tax-records/stats")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch tax statistics")
      }

      setStats(result.data)
    } catch (err) {
      console.error("Error fetching tax stats:", err)
    }
  }

  const createTaxRecord = async (data: Partial<TaxRecord>): Promise<boolean> => {
    try {
      const response = await fetch("/api/tax-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create tax record")
      }

      toast({
        title: "Success",
        description: "Tax record created successfully",
      })

      await fetchTaxRecords()
      await refreshStats()
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  const updateTaxRecord = async (id: string, data: Partial<TaxRecord>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/tax-records/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update tax record")
      }

      toast({
        title: "Success",
        description: "Tax record updated successfully",
      })

      await fetchTaxRecords()
      await refreshStats()
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  const deleteTaxRecord = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/tax-records/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete tax record")
      }

      toast({
        title: "Success",
        description: "Tax record deleted successfully",
      })

      await fetchTaxRecords()
      await refreshStats()
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  useEffect(() => {
    fetchTaxRecords()
    refreshStats()
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
    refreshStats,
  }
}

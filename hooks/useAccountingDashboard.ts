"use client"

import { useState, useEffect } from "react"

interface DashboardSummary {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  expenses: {
    current: number
    previous: number
    growth: number
  }
  profit: {
    current: number
    previous: number
    growth: number
  }
  cashFlow: {
    current: number
    previous: number
    growth: number
  }
  recentActivity: Array<{
    id: string
    description: string
    reference?: string
    amount: number
    type: "revenue" | "expense" | "neutral"
    accountName: string
    date: string
    createdAt: string
  }>
  period: {
    type: string
    startDate: string
    endDate: string
    year: number
    month: number
  }
}

interface UseAccountingDashboardReturn {
  summary: DashboardSummary | null
  loading: boolean
  error: string | null
  fetchSummary: (filters?: {
    period?: string
    year?: number
    month?: number
  }) => Promise<void>
}

export function useAccountingDashboard(): UseAccountingDashboardReturn {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = async (
    filters: {
      period?: string
      year?: number
      month?: number
    } = {},
  ) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.period) params.append("period", filters.period)
      if (filters.year) params.append("year", filters.year.toString())
      if (filters.month) params.append("month", filters.month.toString())

      const response = await fetch(`/api/accounting/dashboard?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch accounting dashboard data")
      }

      const data = await response.json()
      setSummary(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Error fetching accounting dashboard:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  return {
    summary,
    loading,
    error,
    fetchSummary,
  }
}

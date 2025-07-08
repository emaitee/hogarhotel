"use client"

import { useState, useEffect } from "react"

interface DashboardMetrics {
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
    accounts: number
  }
}

interface RecentActivity {
  id: string
  description: string
  amount: number
  type: "debit" | "credit"
  date: string
  account: string
  accountType: string
  reference?: string
}

interface DashboardData {
  metrics: DashboardMetrics
  recentActivity: RecentActivity[]
  period: {
    type: string
    startDate: string
    endDate: string
    year: number
    month?: number
  }
}

interface UseAccountingDashboardReturn {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refetch: (params?: { period?: string; year?: number; month?: number }) => Promise<void>
}

export function useAccountingDashboard(
  initialParams: { period?: string; year?: number; month?: number } = {},
): UseAccountingDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async (params: { period?: string; year?: number; month?: number } = {}) => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      if (params.period) searchParams.append("period", params.period)
      if (params.year) searchParams.append("year", params.year.toString())
      if (params.month) searchParams.append("month", params.month.toString())

      const response = await fetch(`/api/accounting/dashboard?${searchParams}`)
      if (!response.ok) throw new Error("Failed to fetch dashboard data")

      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard(initialParams)
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  }
}

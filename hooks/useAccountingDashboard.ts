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
    growth: number
  }
}

interface RecentActivity {
  _id: string
  date: string
  description: string
  reference: string
  amount: number
  type: "debit" | "credit"
  account: {
    name: string
    type: string
  }
}

interface DashboardData {
  metrics: DashboardMetrics
  recentActivity: RecentActivity[]
  period: {
    type: string
    startDate: string
    endDate: string
  }
}

export function useAccountingDashboard(period = "monthly", year?: number, month?: number) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        period,
        ...(year && { year: year.toString() }),
        ...(month && { month: month.toString() }),
      })

      const response = await fetch(`/api/accounting/dashboard?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [period, year, month])

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  }
}

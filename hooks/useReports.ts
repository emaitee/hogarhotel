"use client"

import { useState, useEffect } from "react"

interface FinancialReport {
  _id: string
  name: string
  type: "profit-loss" | "balance-sheet" | "cash-flow" | "revenue-analysis" | "expense-analysis" | "budget-variance"
  period: {
    startDate: string
    endDate: string
  }
  data: any
  summary: {
    totalRevenue?: number
    totalExpenses?: number
    netProfit?: number
    profitMargin?: number
  }
  status: "generating" | "completed" | "failed"
  generatedBy: string
  createdAt: string
  updatedAt: string
}

interface UseReportsReturn {
  reports: FinancialReport[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  generateReport: (reportData: any) => Promise<FinancialReport>
  deleteReport: (id: string) => Promise<void>
  fetchReports: (filters?: any) => Promise<void>
}

export function useReports(): UseReportsReturn {
  const [reports, setReports] = useState<FinancialReport[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  const fetchReports = async (filters: any = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key])
      })

      const response = await fetch(`/api/reports?${params}`)
      if (!response.ok) throw new Error("Failed to fetch reports")

      const data = await response.json()
      setReports(data.reports)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async (reportData: any): Promise<FinancialReport> => {
    try {
      setError(null)

      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate report")
      }

      const newReport = await response.json()
      setReports((prev) => [newReport, ...prev])
      return newReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteReport = async (id: string): Promise<void> => {
    try {
      setError(null)

      const response = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete report")
      }

      setReports((prev) => prev.filter((report) => report._id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  return {
    reports,
    loading,
    error,
    pagination,
    generateReport,
    deleteReport,
    fetchReports,
  }
}

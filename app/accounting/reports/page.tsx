"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { formatCurrency } from "@/lib/utils"
import { Download, ArrowLeft, TrendingUp, DollarSign, CreditCard, BarChart3 } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import type { DateRange } from "react-day-picker"

interface FinancialReport {
  revenue: {
    total: number
    roomRevenue: number
    serviceRevenue: number
    otherRevenue: number
  }
  expenses: {
    total: number
    operational: number
    maintenance: number
    staff: number
    utilities: number
  }
  profit: {
    gross: number
    net: number
    margin: number
  }
  cashFlow: {
    inflow: number
    outflow: number
    net: number
  }
}

const reportTypes = [
  { value: "profit-loss", label: "Profit & Loss Statement" },
  { value: "balance-sheet", label: "Balance Sheet" },
  { value: "cash-flow", label: "Cash Flow Statement" },
  { value: "revenue-analysis", label: "Revenue Analysis" },
  { value: "expense-analysis", label: "Expense Analysis" },
]

export default function FinancialReportsPage() {
  const [selectedReport, setSelectedReport] = useState("profit-loss")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [reportData, setReportData] = useState<FinancialReport | null>(null)
  const [loading, setLoading] = useState(false)

  // Sample data - in real app, this would come from API
  const sampleReportData: FinancialReport = {
    revenue: {
      total: 2450000,
      roomRevenue: 1800000,
      serviceRevenue: 450000,
      otherRevenue: 200000,
    },
    expenses: {
      total: 1650000,
      operational: 800000,
      maintenance: 300000,
      staff: 400000,
      utilities: 150000,
    },
    profit: {
      gross: 800000,
      net: 650000,
      margin: 26.5,
    },
    cashFlow: {
      inflow: 2450000,
      outflow: 1650000,
      net: 800000,
    },
  }

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setReportData(sampleReportData)
      setLoading(false)
    }, 1000)
  }, [selectedReport, dateRange])

  const generateReport = () => {
    setLoading(true)
    // Simulate report generation
    setTimeout(() => {
      setReportData(sampleReportData)
      setLoading(false)
    }, 1500)
  }

  const exportReport = (format: "pdf" | "excel") => {
    // Simulate export
    console.log(`Exporting ${selectedReport} as ${format}`)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center space-x-4">
          <Link href="/accounting">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Accounting
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">Generate comprehensive financial statements and analysis</p>
          </div>
        </div>
      </motion.div>

      {/* Report Configuration */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
              <div className="flex items-end space-x-2">
                <Button onClick={generateReport} disabled={loading} className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
                  {loading ? "Generating..." : "Generate Report"}
                </Button>
                <Button variant="outline" onClick={() => exportReport("pdf")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" onClick={() => exportReport("excel")}>
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Summary Cards */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(reportData.revenue.total)}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(reportData.expenses.total)}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(reportData.profit.net)}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">{reportData.profit.margin}% margin</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cash Flow</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(reportData.cashFlow.net)}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Detailed Report */}
      {reportData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>{reportTypes.find((r) => r.value === selectedReport)?.label}</CardTitle>
              <p className="text-sm text-gray-500">Generated on {format(new Date(), "PPP")}</p>
            </CardHeader>
            <CardContent>
              {selectedReport === "profit-loss" && (
                <div className="space-y-6">
                  {/* Revenue Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Revenue</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Room Revenue</span>
                        <span className="font-medium">{formatCurrency(reportData.revenue.roomRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Revenue</span>
                        <span className="font-medium">{formatCurrency(reportData.revenue.serviceRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other Revenue</span>
                        <span className="font-medium">{formatCurrency(reportData.revenue.otherRevenue)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Revenue</span>
                        <span>{formatCurrency(reportData.revenue.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expenses Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Expenses</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Operational Expenses</span>
                        <span className="font-medium">{formatCurrency(reportData.expenses.operational)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maintenance</span>
                        <span className="font-medium">{formatCurrency(reportData.expenses.maintenance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Staff Costs</span>
                        <span className="font-medium">{formatCurrency(reportData.expenses.staff)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilities</span>
                        <span className="font-medium">{formatCurrency(reportData.expenses.utilities)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Expenses</span>
                        <span>{formatCurrency(reportData.expenses.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Profit Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Profit</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Gross Profit</span>
                        <span className="font-medium">{formatCurrency(reportData.profit.gross)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Net Profit</span>
                        <span className="text-green-600">{formatCurrency(reportData.profit.net)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit Margin</span>
                        <span className="font-medium">{reportData.profit.margin}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

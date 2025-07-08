"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { formatCurrency } from "@/lib/utils"
import { Download, ArrowLeft, TrendingUp, DollarSign, CreditCard, BarChart3, FileText, Loader2 } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import type { DateRange } from "react-day-picker"
import { useToast } from "@/hooks/use-toast"

interface FinancialReport {
  _id: string
  name: string
  type: "profit-loss" | "balance-sheet" | "cash-flow" | "revenue-analysis" | "expense-analysis"
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })
  const [reports, setReports] = useState<FinancialReport[]>([])
  const [currentReport, setCurrentReport] = useState<FinancialReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const { toast } = useToast()

  // Fetch existing reports
  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/reports")
      if (!response.ok) throw new Error("Failed to fetch reports")

      const data = await response.json()
      setReports(data.reports || [])
    } catch (error) {
      console.error("Error fetching reports:", error)
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Error",
        description: "Please select a date range",
        variant: "destructive",
      })
      return
    }

    try {
      setGenerating(true)
      const reportName = `${reportTypes.find((r) => r.value === selectedReport)?.label} - ${format(dateRange.from, "MMM yyyy")}`

      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reportName,
          type: selectedReport,
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
          generatedBy: "admin", // In real app, get from auth context
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate report")
      }

      const newReport = await response.json()
      setCurrentReport(newReport)
      setReports((prev) => [newReport, ...prev])

      toast({
        title: "Success",
        description: "Report generated successfully",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const exportReport = (format: "pdf" | "excel") => {
    if (!currentReport) {
      toast({
        title: "Error",
        description: "No report to export",
        variant: "destructive",
      })
      return
    }

    // Create downloadable content
    const content = JSON.stringify(currentReport.data, null, 2)
    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentReport.name}.${format === "pdf" ? "json" : "json"}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: `Report exported as ${format.toUpperCase()}`,
    })
  }

  const loadReport = (report: FinancialReport) => {
    setCurrentReport(report)
    setSelectedReport(report.type)
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
                <Button onClick={generateReport} disabled={generating} className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Report"
                  )}
                </Button>
                <Button variant="outline" onClick={() => exportReport("pdf")} disabled={!currentReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Existing Reports */}
      {reports.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reports.slice(0, 5).map((report) => (
                  <div
                    key={report._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => loadReport(report)}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(report.createdAt), "PPP")} • {report.type.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {report.summary.totalRevenue && (
                        <p className="font-medium">{formatCurrency(report.summary.totalRevenue)}</p>
                      )}
                      <p className="text-sm text-gray-500">{report.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Report Summary Cards */}
      {currentReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(currentReport.summary.totalRevenue || 0)}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(currentReport.summary.totalExpenses || 0)}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-red-600" />
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(currentReport.summary.netProfit || 0)}
                    </p>
                    {currentReport.summary.profitMargin && (
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">
                          {currentReport.summary.profitMargin.toFixed(1)}% margin
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Report Status</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                      {currentReport.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      Generated {format(new Date(currentReport.createdAt), "PPp")}
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
      {currentReport && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader>
              <CardTitle>{currentReport.name}</CardTitle>
              <p className="text-sm text-gray-500">
                Period: {format(new Date(currentReport.period.startDate), "PPP")} -{" "}
                {format(new Date(currentReport.period.endDate), "PPP")}
              </p>
            </CardHeader>
            <CardContent>
              {currentReport.type === "profit-loss" && currentReport.data && (
                <div className="space-y-6">
                  {/* Revenue Section */}
                  {currentReport.data.revenue && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Revenue</h3>
                      <div className="space-y-2">
                        {Object.entries(currentReport.data.revenue.byCategory || {}).map(([category, amount]) => (
                          <div key={category} className="flex justify-between">
                            <span>{category}</span>
                            <span className="font-medium">{formatCurrency(amount as number)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total Revenue</span>
                          <span>{formatCurrency(currentReport.data.revenue.total || 0)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expenses Section */}
                  {currentReport.data.expenses && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Expenses</h3>
                      <div className="space-y-2">
                        {Object.entries(currentReport.data.expenses.byCategory || {}).map(([category, amount]) => (
                          <div key={category} className="flex justify-between">
                            <span>{category}</span>
                            <span className="font-medium">{formatCurrency(amount as number)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total Expenses</span>
                          <span>{formatCurrency(currentReport.data.expenses.total || 0)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Profit Section */}
                  {currentReport.data.profit && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Profit</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Gross Profit</span>
                          <span className="font-medium">{formatCurrency(currentReport.data.profit.gross || 0)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Net Profit</span>
                          <span className={currentReport.data.profit.net >= 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(currentReport.data.profit.net || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Profit Margin</span>
                          <span className="font-medium">{(currentReport.data.profit.margin || 0).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Other report types */}
              {currentReport.type !== "profit-loss" && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Report data visualization for {currentReport.type} coming soon...</p>
                  <pre className="mt-4 text-left bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(currentReport.data, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {!currentReport && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Report Generated</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Select a report type and date range, then click "Generate Report" to create your financial statement.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

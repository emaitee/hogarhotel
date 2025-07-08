"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { useAccountingDashboard } from "@/hooks/useAccountingDashboard"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  CreditCard,
  PieChart,
  BarChart3,
  FileText,
  Calculator,
  Wallet,
  RefreshCw,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountingPage() {
  const { summary, loading, error, fetchSummary } = useAccountingDashboard()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  const quickActions = [
    {
      title: "Chart of Accounts",
      description: "Manage your account structure",
      href: "/accounting/chart-of-accounts",
      icon: BarChart3,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Transactions",
      description: "Record and view transactions",
      href: "/accounting/transactions",
      icon: Receipt,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Expenses",
      description: "Track and manage expenses",
      href: "/accounting/expenses",
      icon: CreditCard,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Financial Reports",
      description: "Generate financial statements",
      href: "/accounting/reports",
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Budget Management",
      description: "Plan and track budgets",
      href: "/accounting/budget",
      icon: Calculator,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Tax Management",
      description: "Handle tax calculations",
      href: "/accounting/tax",
      icon: PieChart,
      color: "bg-indigo-50 text-indigo-600",
    },
  ]

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    fetchSummary({ period, year: selectedYear, month: selectedMonth })
  }

  const handleYearChange = (year: string) => {
    const yearNum = Number.parseInt(year)
    setSelectedYear(yearNum)
    fetchSummary({ period: selectedPeriod, year: yearNum, month: selectedMonth })
  }

  const handleMonthChange = (month: string) => {
    const monthNum = Number.parseInt(month)
    setSelectedMonth(monthNum)
    fetchSummary({ period: selectedPeriod, year: selectedYear, month: monthNum })
  }

  const handleRefresh = () => {
    fetchSummary({ period: selectedPeriod, year: selectedYear, month: selectedMonth })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "revenue":
        return "bg-green-500"
      case "expense":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  const formatActivityAmount = (amount: number, type: string) => {
    const prefix = type === "expense" ? "-" : ""
    return `${prefix}${formatCurrency(amount)}`
  }

  const formatActivityColor = (type: string) => {
    return type === "expense" ? "text-red-600" : "text-green-600"
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accounting</h1>
            <p className="text-gray-600 dark:text-gray-400">Complete financial management and accounting system</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading accounting data: {error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accounting</h1>
          <p className="text-gray-600 dark:text-gray-400">Complete financial management and accounting system</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedPeriod === "month" && (
            <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {new Date(2024, month - 1).toLocaleString("default", { month: "long" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </motion.div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {selectedPeriod === "month" ? "Monthly" : selectedPeriod === "quarter" ? "Quarterly" : "Yearly"}{" "}
                      Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(summary?.revenue.current || 0)}
                    </p>
                    <div className="flex items-center mt-1">
                      {(summary?.revenue.growth || 0) > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm ${(summary?.revenue.growth || 0) > 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {(summary?.revenue.growth || 0) > 0 ? "+" : ""}
                        {(summary?.revenue.growth || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {selectedPeriod === "month" ? "Monthly" : selectedPeriod === "quarter" ? "Quarterly" : "Yearly"}{" "}
                      Expenses
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(summary?.expenses.current || 0)}
                    </p>
                    <div className="flex items-center mt-1">
                      {(summary?.expenses.growth || 0) < 0 ? (
                        <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm ${(summary?.expenses.growth || 0) < 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {(summary?.expenses.growth || 0) > 0 ? "+" : ""}
                        {(summary?.expenses.growth || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(summary?.profit.current || 0)}
                    </p>
                    <div className="flex items-center mt-1">
                      {(summary?.profit.growth || 0) > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm ${(summary?.profit.growth || 0) > 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {(summary?.profit.growth || 0) > 0 ? "+" : ""}
                        {(summary?.profit.growth || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cash Flow</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(summary?.cashFlow.current || 0)}
                    </p>
                    <div className="flex items-center mt-1">
                      {(summary?.cashFlow.growth || 0) > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm ${(summary?.cashFlow.growth || 0) > 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {(summary?.cashFlow.growth || 0) > 0 ? "+" : ""}
                        {(summary?.cashFlow.growth || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full">
                    <Wallet className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link key={action.title} href={action.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{action.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Financial Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-2 h-2 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : summary?.recentActivity && summary.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {summary.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getActivityIcon(activity.type)}`}></div>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">
                          {activity.reference ? `${activity.reference} - ` : ""}
                          {activity.accountName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${formatActivityColor(activity.type)}`}>
                        {formatActivityAmount(activity.amount, activity.type)}
                      </p>
                      <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent financial activity found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Recent transactions will appear here once you start recording financial data
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

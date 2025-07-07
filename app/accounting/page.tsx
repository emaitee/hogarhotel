'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { monthlyFinancialSummary } from '@/lib/accountingData';
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
  Wallet
} from 'lucide-react';
import Link from 'next/link';

export default function AccountingPage() {
  const { revenue, expenses, profit, cashFlow } = monthlyFinancialSummary;

  const quickActions = [
    { 
      title: 'Chart of Accounts', 
      description: 'Manage your account structure',
      href: '/accounting/chart-of-accounts',
      icon: BarChart3,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      title: 'Transactions', 
      description: 'Record and view transactions',
      href: '/accounting/transactions',
      icon: Receipt,
      color: 'bg-green-50 text-green-600'
    },
    { 
      title: 'Expenses', 
      description: 'Track and manage expenses',
      href: '/accounting/expenses',
      icon: CreditCard,
      color: 'bg-red-50 text-red-600'
    },
    { 
      title: 'Financial Reports', 
      description: 'Generate financial statements',
      href: '/accounting/reports',
      icon: FileText,
      color: 'bg-purple-50 text-purple-600'
    },
    { 
      title: 'Budget Management', 
      description: 'Plan and track budgets',
      href: '/accounting/budget',
      icon: Calculator,
      color: 'bg-yellow-50 text-yellow-600'
    },
    { 
      title: 'Tax Management', 
      description: 'Handle tax calculations',
      href: '/accounting/tax',
      icon: PieChart,
      color: 'bg-indigo-50 text-indigo-600'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accounting</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete financial management and accounting system
          </p>
        </div>
      </motion.div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(revenue.current)}
                  </p>
                  <div className="flex items-center mt-1">
                    {revenue.growth > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${revenue.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {revenue.growth > 0 ? '+' : ''}{revenue.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monthly Expenses
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(expenses.current)}
                  </p>
                  <div className="flex items-center mt-1">
                    {expenses.growth < 0 ? (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${expenses.growth < 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {expenses.growth > 0 ? '+' : ''}{expenses.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Net Profit
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(profit.current)}
                  </p>
                  <div className="flex items-center mt-1">
                    {profit.growth > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${profit.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {profit.growth > 0 ? '+' : ''}{profit.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Cash Flow
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(cashFlow.current)}
                  </p>
                  <div className="flex items-center mt-1">
                    {cashFlow.growth > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${cashFlow.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {cashFlow.growth > 0 ? '+' : ''}{cashFlow.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
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
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Financial Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Room Revenue Received</p>
                    <p className="text-sm text-gray-500">Payment from Adebayo Ogundimu</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{formatCurrency(158400)}</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Utility Payment</p>
                    <p className="text-sm text-gray-500">Electricity bill payment</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-{formatCurrency(450000)}</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Staff Salary</p>
                    <p className="text-sm text-gray-500">Monthly salary payment</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-{formatCurrency(1200000)}</p>
                  <p className="text-sm text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

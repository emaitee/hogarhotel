'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { hrMetrics } from '@/lib/hrData';
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Clock,
  Award,
  FileText,
  UserCheck,
  Building
} from 'lucide-react';
import Link from 'next/link';

export default function HRPage() {
  const quickActions = [
    { 
      title: 'Employee Management', 
      description: 'Manage employee records and information',
      href: '/hr/employees',
      icon: Users,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      title: 'Payroll Management', 
      description: 'Process payroll and manage compensation',
      href: '/hr/payroll',
      icon: DollarSign,
      color: 'bg-green-50 text-green-600'
    },
    { 
      title: 'Attendance Tracking', 
      description: 'Monitor employee attendance and time',
      href: '/hr/attendance',
      icon: Clock,
      color: 'bg-purple-50 text-purple-600'
    },
    { 
      title: 'Leave Management', 
      description: 'Handle leave requests and approvals',
      href: '/hr/leave',
      icon: Calendar,
      color: 'bg-orange-50 text-orange-600'
    },
    { 
      title: 'Performance Reviews', 
      description: 'Conduct and track performance evaluations',
      href: '/hr/performance',
      icon: Award,
      color: 'bg-red-50 text-red-600'
    },
    { 
      title: 'Departments & Positions', 
      description: 'Manage organizational structure',
      href: '/hr/organization',
      icon: Building,
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Human Resources</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete HR and payroll management system
          </p>
        </div>
      </motion.div>

      {/* HR Metrics Cards */}
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
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {hrMetrics.totalEmployees}
                  </p>
                  <div className="flex items-center mt-1">
                    <UserPlus className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">
                      +{hrMetrics.newHires} this month
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
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
                    Monthly Payroll
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(hrMetrics.totalPayroll)}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">
                      Avg: {formatCurrency(hrMetrics.averageSalary)}
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
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Attendance Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {hrMetrics.attendanceRate}%
                  </p>
                  <div className="flex items-center mt-1">
                    <UserCheck className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-500">
                      {hrMetrics.activeEmployees} active today
                    </span>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
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
                    Turnover Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {hrMetrics.turnoverRate}%
                  </p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-500">
                      {hrMetrics.pendingLeaves} pending leaves
                    </span>
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
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
            <CardTitle>Recent HR Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">New Employee Onboarded</p>
                    <p className="text-sm text-gray-500">Grace Okafor joined Housekeeping department</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Payroll Processed</p>
                    <p className="text-sm text-gray-500">January 2024 payroll completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Leave Request Pending</p>
                    <p className="text-sm text-gray-500">Usman Garba requested annual leave</p>
                  </div>
                </div>
                <div className="text-right">
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

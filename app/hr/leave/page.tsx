'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/DataTable';
import { leaveRequests } from '@/lib/hrData';
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

const columns = [
  { key: 'employee', label: 'Employee', sortable: true },
  { key: 'leaveType', label: 'Leave Type', sortable: true },
  { key: 'startDate', label: 'Start Date', sortable: true },
  { key: 'endDate', label: 'End Date', sortable: true },
  { key: 'totalDays', label: 'Days', sortable: true },
  { key: 'reason', label: 'Reason', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

export default function LeavePage() {
  const renderCell = (leave: any, column: any) => {
    switch (column.key) {
      case 'employee':
        return (
          <div>
            <div className="font-medium">{leave.employee.personalInfo.firstName} {leave.employee.personalInfo.lastName}</div>
            <div className="text-sm text-gray-500">{leave.employee.employeeId}</div>
          </div>
        );
      case 'leaveType':
        const typeColors = {
          annual: 'bg-blue-100 text-blue-800',
          sick: 'bg-red-100 text-red-800',
          maternity: 'bg-pink-100 text-pink-800',
          paternity: 'bg-green-100 text-green-800',
          emergency: 'bg-orange-100 text-orange-800',
          unpaid: 'bg-gray-100 text-gray-800'
        };
        return (
          <Badge className={typeColors[leave.leaveType]}>
            {leave.leaveType}
          </Badge>
        );
      case 'startDate':
        return format(new Date(leave.startDate), 'MMM dd, yyyy');
      case 'endDate':
        return format(new Date(leave.endDate), 'MMM dd, yyyy');
      case 'totalDays':
        return <span className="font-medium">{leave.totalDays} days</span>;
      case 'reason':
        return <span className="text-sm">{leave.reason}</span>;
      case 'status':
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800',
          cancelled: 'bg-gray-100 text-gray-800'
        };
        return (
          <Badge className={statusColors[leave.status]}>
            {leave.status}
          </Badge>
        );
      case 'actions':
        return (
          <div className="flex space-x-2">
            {leave.status === 'pending' && (
              <>
                <Button size="sm" variant="outline" className="text-green-600">
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button size="sm" variant="outline">
              View
            </Button>
          </div>
        );
      default:
        return leave[column.key];
    }
  };

  const pendingRequests = leaveRequests.filter(req => req.status === 'pending').length;
  const approvedRequests = leaveRequests.filter(req => req.status === 'approved').length;
  const totalDaysRequested = leaveRequests.reduce((sum, req) => sum + req.totalDays, 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center space-x-4">
          <Link href="/hr">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to HR
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Handle employee leave requests and approvals
            </p>
          </div>
        </div>
        <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          <Plus className="h-4 w-4 mr-2" />
          New Leave Request
        </Button>
      </motion.div>

      {/* Leave Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    Pending Requests
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pendingRequests}
                  </p>
                  <p className="text-sm text-yellow-600">
                    Awaiting approval
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
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
                    Approved Requests
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {approvedRequests}
                  </p>
                  <p className="text-sm text-green-600">
                    This month
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
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
                    Total Days
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalDaysRequested}
                  </p>
                  <p className="text-sm text-blue-600">
                    Days requested
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
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
                    Average Days
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(totalDaysRequested / leaveRequests.length).toFixed(1)}
                  </p>
                  <p className="text-sm text-purple-600">
                    Per request
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Leave Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={leaveRequests}
              columns={columns}
              searchKey="employee.personalInfo.firstName"
              renderCell={renderCell}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

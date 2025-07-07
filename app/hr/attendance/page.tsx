'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/DataTable';
import { attendanceRecords, employees } from '@/lib/hrData';
import { ArrowLeft, Clock, UserCheck, UserX, Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

const columns = [
  { key: 'employee', label: 'Employee', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'clockIn', label: 'Clock In', sortable: true },
  { key: 'clockOut', label: 'Clock Out', sortable: true },
  { key: 'totalHours', label: 'Total Hours', sortable: true },
  { key: 'overtimeHours', label: 'Overtime', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

export default function AttendancePage() {
  const renderCell = (attendance: any, column: any) => {
    const employee = employees.find(e => e.id === attendance.employeeId);
    
    switch (column.key) {
      case 'employee':
        return (
          <div>
            <div className="font-medium">{employee?.personalInfo.firstName} {employee?.personalInfo.lastName}</div>
            <div className="text-sm text-gray-500">{employee?.employeeId}</div>
          </div>
        );
      case 'date':
        return format(new Date(attendance.date), 'MMM dd, yyyy');
      case 'clockIn':
        return attendance.clockIn ? format(new Date(attendance.clockIn), 'HH:mm') : '-';
      case 'clockOut':
        return attendance.clockOut ? format(new Date(attendance.clockOut), 'HH:mm') : '-';
      case 'totalHours':
        return <span className="font-medium">{attendance.totalHours}h</span>;
      case 'overtimeHours':
        return attendance.overtimeHours > 0 ? (
          <span className="font-medium text-orange-600">{attendance.overtimeHours}h</span>
        ) : '-';
      case 'status':
        const statusColors = {
          present: 'bg-green-100 text-green-800',
          absent: 'bg-red-100 text-red-800',
          late: 'bg-yellow-100 text-yellow-800',
          'half-day': 'bg-blue-100 text-blue-800',
          'on-leave': 'bg-purple-100 text-purple-800'
        };
        return (
          <Badge className={statusColors[attendance.status]}>
            {attendance.status.replace('-', ' ')}
          </Badge>
        );
      case 'actions':
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>
        );
      default:
        return attendance[column.key];
    }
  };

  const todayAttendance = attendanceRecords.filter(record => 
    format(new Date(record.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const presentToday = todayAttendance.filter(record => record.status === 'present').length;
  const lateToday = todayAttendance.filter(record => record.status === 'late').length;
  const absentToday = employees.length - todayAttendance.length;
  const totalOvertimeHours = attendanceRecords.reduce((sum, record) => sum + record.overtimeHours, 0);

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance Tracking</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor employee attendance and working hours
            </p>
          </div>
        </div>
        <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          <Plus className="h-4 w-4 mr-2" />
          Mark Attendance
        </Button>
      </motion.div>

      {/* Attendance Summary */}
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
                    Present Today
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {presentToday + lateToday}
                  </p>
                  <p className="text-sm text-green-600">
                    {((presentToday + lateToday) / employees.length * 100).toFixed(1)}% attendance
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
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
                    Late Today
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {lateToday}
                  </p>
                  <p className="text-sm text-yellow-600">
                    {(lateToday / employees.length * 100).toFixed(1)}% late arrivals
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
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Absent Today
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {absentToday}
                  </p>
                  <p className="text-sm text-red-600">
                    {(absentToday / employees.length * 100).toFixed(1)}% absent
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full">
                  <UserX className="h-6 w-6 text-red-600" />
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
                    Total Overtime
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalOvertimeHours}h
                  </p>
                  <p className="text-sm text-purple-600">
                    This month
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

      {/* Attendance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={attendanceRecords}
              columns={columns}
              searchKey="employeeId"
              renderCell={renderCell}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

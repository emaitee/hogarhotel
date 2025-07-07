'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/DataTable';
import { payrollPeriods, payrollEntries } from '@/lib/hrData';
import { formatCurrency } from '@/lib/utils';
import { Plus, ArrowLeft, DollarSign, Users, Calculator, FileText, Eye, Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

const periodColumns = [
  { key: 'name', label: 'Period', sortable: true },
  { key: 'startDate', label: 'Start Date', sortable: true },
  { key: 'endDate', label: 'End Date', sortable: true },
  { key: 'payDate', label: 'Pay Date', sortable: true },
  { key: 'totalEmployees', label: 'Employees', sortable: true },
  { key: 'totalNetPay', label: 'Total Net Pay', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

const entryColumns = [
  { key: 'employee', label: 'Employee', sortable: true },
  { key: 'baseSalary', label: 'Base Salary', sortable: true },
  { key: 'grossPay', label: 'Gross Pay', sortable: true },
  { key: 'totalDeductions', label: 'Deductions', sortable: true },
  { key: 'netPay', label: 'Net Pay', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

export default function PayrollPage() {
  const [selectedPeriod, setSelectedPeriod] = useState(payrollPeriods[0]);
  const [view, setView] = useState<'periods' | 'entries'>('periods');

  const renderPeriodCell = (period: any, column: any) => {
    switch (column.key) {
      case 'name':
        return <span className="font-medium">{period.name}</span>;
      case 'startDate':
        return format(new Date(period.startDate), 'MMM dd, yyyy');
      case 'endDate':
        return format(new Date(period.endDate), 'MMM dd, yyyy');
      case 'payDate':
        return format(new Date(period.payDate), 'MMM dd, yyyy');
      case 'totalEmployees':
        return <span className="text-center">{period.totalEmployees}</span>;
      case 'totalNetPay':
        return <span className="font-medium">{formatCurrency(period.totalNetPay)}</span>;
      case 'status':
        const statusColors = {
          draft: 'bg-gray-100 text-gray-800',
          processing: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-blue-100 text-blue-800',
          paid: 'bg-green-100 text-green-800'
        };
        return (
          <Badge className={statusColors[period.status]}>
            {period.status}
          </Badge>
        );
      case 'actions':
        return (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setSelectedPeriod(period);
                setView('entries');
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return period[column.key];
    }
  };

  const renderEntryCell = (entry: any, column: any) => {
    switch (column.key) {
      case 'employee':
        return (
          <div>
            <div className="font-medium">{entry.employee.personalInfo.firstName} {entry.employee.personalInfo.lastName}</div>
            <div className="text-sm text-gray-500">{entry.employee.employeeId}</div>
          </div>
        );
      case 'baseSalary':
        return <span className="font-medium">{formatCurrency(entry.baseSalary)}</span>;
      case 'grossPay':
        return <span className="font-medium">{formatCurrency(entry.grossPay)}</span>;
      case 'totalDeductions':
        return <span className="font-medium text-red-600">{formatCurrency(entry.totalDeductions)}</span>;
      case 'netPay':
        return <span className="font-medium text-green-600">{formatCurrency(entry.netPay)}</span>;
      case 'status':
        const statusColors = {
          draft: 'bg-gray-100 text-gray-800',
          approved: 'bg-blue-100 text-blue-800',
          paid: 'bg-green-100 text-green-800'
        };
        return (
          <Badge className={statusColors[entry.status]}>
            {entry.status}
          </Badge>
        );
      case 'actions':
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return entry[column.key];
    }
  };

  const currentPeriodEntries = payrollEntries.filter(entry => entry.payrollPeriodId === selectedPeriod.id);

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payroll Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Process and manage employee payroll
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          {view === 'entries' && (
            <Button variant="outline" onClick={() => setView('periods')}>
              Back to Periods
            </Button>
          )}
          <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
            <Plus className="h-4 w-4 mr-2" />
            {view === 'periods' ? 'New Payroll Period' : 'Process Payroll'}
          </Button>
        </div>
      </motion.div>

      {/* Payroll Summary */}
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
                    Current Period
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedPeriod.name}
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
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedPeriod.totalEmployees}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
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
                    Gross Pay
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(selectedPeriod.totalGrossPay)}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full">
                  <Calculator className="h-6 w-6 text-purple-600" />
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
                    Net Pay
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(selectedPeriod.totalNetPay)}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payroll Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              {view === 'periods' ? 'Payroll Periods' : `${selectedPeriod.name} - Employee Payroll`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {view === 'periods' ? (
              <DataTable
                data={payrollPeriods}
                columns={periodColumns}
                searchKey="name"
                renderCell={renderPeriodCell}
              />
            ) : (
              <DataTable
                data={currentPeriodEntries}
                columns={entryColumns}
                searchKey="employee.personalInfo.firstName"
                renderCell={renderEntryCell}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

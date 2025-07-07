'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/ui/status-badge';
import { dummyBills } from '@/lib/dummyData';
import { formatCurrency } from '@/lib/utils';
import { Plus, Download, Eye, DollarSign, Receipt, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

const columns = [
  { key: 'id', label: 'Bill ID', sortable: true },
  { key: 'reservation.guest.name', label: 'Guest Name', sortable: true },
  { key: 'reservation.room.number', label: 'Room', sortable: true },
  { key: 'total', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

export default function BillingPage() {
  const renderCell = (bill: any, column: any) => {
    switch (column.key) {
      case 'id':
        return <span className="font-mono text-sm">#{bill.id}</span>;
      case 'reservation.guest.name':
        return (
          <div>
            <div className="font-medium">{bill.reservation.guest.name}</div>
            <div className="text-sm text-gray-500">{bill.reservation.guest.email}</div>
          </div>
        );
      case 'reservation.room.number':
        return <span className="font-medium">Room {bill.reservation.room.number}</span>;
      case 'total':
        return <span className="font-medium">{formatCurrency(bill.total)}</span>;
      case 'status':
        return <StatusBadge status={bill.status} variant="bill" />;
      case 'createdAt':
        return format(new Date(bill.createdAt), 'MMM dd, yyyy');
      case 'actions':
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return bill[column.key];
    }
  };

  const totalRevenue = dummyBills.reduce((sum, bill) => sum + (bill.status === 'paid' ? bill.total : 0), 0);
  const pendingAmount = dummyBills.reduce((sum, bill) => sum + (bill.status === 'pending' ? bill.total : 0), 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage invoices and payments
          </p>
        </div>
        <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Bill
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalRevenue)}
                  </p>
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
                    Pending Payments
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(pendingAmount)}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
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
                    Total Bills
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dummyBills.length}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bills Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={dummyBills}
              columns={columns}
              searchKey="reservation.guest.name"
              renderCell={renderCell}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

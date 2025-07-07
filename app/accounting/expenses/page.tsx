'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/ui/status-badge';
import { dummyExpenses, transactionCategories } from '@/lib/accountingData';
import { formatCurrency } from '@/lib/utils';
import { Plus, ArrowLeft, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'vendor', label: 'Vendor', sortable: true },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'paymentMethod', label: 'Payment Method', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'card', label: 'Card' }
];

export default function ExpensesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const renderCell = (expense: any, column: any) => {
    switch (column.key) {
      case 'date':
        return format(new Date(expense.date), 'MMM dd, yyyy');
      case 'vendor':
        return <span className="font-medium">{expense.vendor}</span>;
      case 'description':
        return <span className="text-sm">{expense.description}</span>;
      case 'category':
        return (
          <Badge style={{ backgroundColor: expense.category.color + '20', color: expense.category.color }}>
            {expense.category.name}
          </Badge>
        );
      case 'amount':
        return <span className="font-medium text-red-600">{formatCurrency(expense.amount)}</span>;
      case 'paymentMethod':
        const method = paymentMethods.find(m => m.value === expense.paymentMethod);
        return <span className="text-sm">{method?.label}</span>;
      case 'status':
        return <StatusBadge status={expense.status} variant="expense" />;
      case 'actions':
        return (
          <div className="flex space-x-2">
            {expense.status === 'pending' && (
              <>
                <Button size="sm" variant="outline" className="text-green-600">
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
            {expense.status === 'approved' && (
              <Button size="sm" variant="outline" className="text-blue-600">
                Pay
              </Button>
            )}
            <Button size="sm" variant="outline">
              View
            </Button>
          </div>
        );
      default:
        return expense[column.key];
    }
  };

  const expenseStats = {
    total: dummyExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    pending: dummyExpenses.filter(exp => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0),
    approved: dummyExpenses.filter(exp => exp.status === 'approved').reduce((sum, exp) => sum + exp.amount, 0),
    paid: dummyExpenses.filter(exp => exp.status === 'paid').reduce((sum, exp) => sum + exp.amount, 0)
  };

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expense Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage all business expenses
            </p>
          </div>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <AddExpenseForm onClose={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Expense Summary */}
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
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(expenseStats.total)}
                  </p>
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
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pending Approval
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(expenseStats.pending)}
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
                    Approved
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(expenseStats.approved)}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
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
                    Paid
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(expenseStats.paid)}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Expenses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={dummyExpenses}
              columns={columns}
              searchKey="vendor"
              renderCell={renderCell}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function AddExpenseForm({ onClose }: { onClose: () => void }) {
  const expenseCategories = transactionCategories.filter(cat => cat.type === 'expense');

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor</Label>
          <Input id="vendor" placeholder="Vendor name" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="Expense description" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" placeholder="0" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map(method => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reference">Reference</Label>
          <Input id="reference" placeholder="Reference number" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea id="notes" placeholder="Additional notes..." />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          Add Expense
        </Button>
      </div>
    </form>
  );
}

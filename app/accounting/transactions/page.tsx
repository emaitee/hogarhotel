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
import { dummyTransactions, chartOfAccounts, transactionCategories } from '@/lib/accountingData';
import { formatCurrency } from '@/lib/utils';
import { Plus, ArrowLeft, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'reference', label: 'Reference', sortable: true },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'account', label: 'Account', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

export default function TransactionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const renderCell = (transaction: any, column: any) => {
    switch (column.key) {
      case 'date':
        return format(new Date(transaction.date), 'MMM dd, yyyy');
      case 'reference':
        return <span className="font-mono text-sm">{transaction.reference}</span>;
      case 'description':
        return <span className="font-medium">{transaction.description}</span>;
      case 'account':
        return (
          <div>
            <div className="font-medium">{transaction.account.name}</div>
            <div className="text-sm text-gray-500">{transaction.account.code}</div>
          </div>
        );
      case 'category':
        return (
          <Badge style={{ backgroundColor: transaction.category.color + '20', color: transaction.category.color }}>
            {transaction.category.name}
          </Badge>
        );
      case 'type':
        return (
          <div className="flex items-center space-x-1">
            {transaction.type === 'credit' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <Badge className={transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {transaction.type === 'credit' ? 'Credit' : 'Debit'}
            </Badge>
          </div>
        );
      case 'amount':
        return (
          <span className={`font-medium ${
            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </span>
        );
      case 'actions':
        return (
          <Button size="sm" variant="outline">
            View
          </Button>
        );
      default:
        return transaction[column.key];
    }
  };

  const totalCredits = dummyTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = dummyTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Record and manage all financial transactions
            </p>
          </div>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <AddTransactionForm onClose={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Transaction Summary */}
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
                    Total Credits
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalCredits)}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
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
                    Total Debits
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalDebits)}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full">
                  <TrendingDown className="h-6 w-6 text-red-600" />
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
                    Net Balance
                  </p>
                  <p className={`text-2xl font-bold ${
                    totalCredits - totalDebits >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(Math.abs(totalCredits - totalDebits))}
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

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={dummyTransactions}
              columns={columns}
              searchKey="description"
              renderCell={renderCell}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function AddTransactionForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reference">Reference</Label>
          <Input id="reference" placeholder="e.g., TXN-001" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="Transaction description" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="account">Account</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {chartOfAccounts.map(account => (
                <SelectItem key={account.id} value={account.id}>
                  {account.code} - {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {transactionCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Transaction Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="debit">Debit</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" placeholder="0" />
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
          Add Transaction
        </Button>
      </div>
    </form>
  );
}

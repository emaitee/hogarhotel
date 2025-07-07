'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/DataTable';
import { chartOfAccounts } from '@/lib/accountingData';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const columns = [
  { key: 'code', label: 'Account Code', sortable: true },
  { key: 'name', label: 'Account Name', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'balance', label: 'Balance', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

const accountTypes = [
  { value: 'asset', label: 'Asset', color: 'bg-green-100 text-green-800' },
  { value: 'liability', label: 'Liability', color: 'bg-red-100 text-red-800' },
  { value: 'equity', label: 'Equity', color: 'bg-blue-100 text-blue-800' },
  { value: 'revenue', label: 'Revenue', color: 'bg-purple-100 text-purple-800' },
  { value: 'expense', label: 'Expense', color: 'bg-orange-100 text-orange-800' }
];

export default function ChartOfAccountsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const renderCell = (account: any, column: any) => {
    switch (column.key) {
      case 'code':
        return <span className="font-mono text-sm">{account.code}</span>;
      case 'name':
        return <span className="font-medium">{account.name}</span>;
      case 'type':
        const typeConfig = accountTypes.find(t => t.value === account.type);
        return (
          <Badge className={typeConfig?.color}>
            {typeConfig?.label}
          </Badge>
        );
      case 'category':
        return <span className="text-sm">{account.category}</span>;
      case 'balance':
        return (
          <span className={`font-medium ${
            account.balance > 0 ? 'text-green-600' : 
            account.balance < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {formatCurrency(Math.abs(account.balance))}
          </span>
        );
      case 'status':
        return (
          <Badge className={account.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {account.isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      case 'actions':
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return account[column.key];
    }
  };

  const accountSummary = accountTypes.map(type => ({
    ...type,
    count: chartOfAccounts.filter(acc => acc.type === type.value).length,
    balance: chartOfAccounts
      .filter(acc => acc.type === type.value)
      .reduce((sum, acc) => sum + acc.balance, 0)
  }));

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chart of Accounts</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account structure and balances
            </p>
          </div>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
            </DialogHeader>
            <AddAccountForm onClose={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Account Type Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {accountSummary.map((type, index) => (
          <motion.div
            key={type.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Badge className={type.color + ' mb-2'}>
                    {type.label}
                  </Badge>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {type.count}
                  </div>
                  <div className="text-sm text-gray-500">accounts</div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
                    {formatCurrency(Math.abs(type.balance))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Accounts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={chartOfAccounts}
              columns={columns}
              searchKey="name"
              renderCell={renderCell}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function AddAccountForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Account Code</Label>
          <Input id="code" placeholder="e.g., 1003" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Account Name</Label>
          <Input id="name" placeholder="e.g., Petty Cash" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Account Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {accountTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" placeholder="e.g., Current Assets" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="balance">Opening Balance</Label>
        <Input id="balance" type="number" placeholder="0" />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          Add Account
        </Button>
      </div>
    </form>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { dummyGuests } from '@/lib/dummyData';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit, Eye, Phone, Mail } from 'lucide-react';

const columns = [
  { key: 'name', label: 'Guest Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Phone', sortable: true },
  { key: 'totalStays', label: 'Total Stays', sortable: true },
  { key: 'totalSpent', label: 'Total Spent', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

export default function GuestsPage() {
  const renderCell = (guest: any, column: any) => {
    switch (column.key) {
      case 'name':
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#468DD6] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {guest.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-medium">{guest.name}</div>
              <div className="text-sm text-gray-500">{guest.idNumber}</div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{guest.email}</span>
          </div>
        );
      case 'phone':
        return (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{guest.phone}</span>
          </div>
        );
      case 'totalStays':
        return (
          <div className="text-center">
            <div className="font-medium">{guest.totalStays}</div>
            <div className="text-sm text-gray-500">stays</div>
          </div>
        );
      case 'totalSpent':
        return <span className="font-medium">{formatCurrency(guest.totalSpent)}</span>;
      case 'actions':
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return guest[column.key];
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guest Registry</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage guest information and history
          </p>
        </div>
        <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Guest
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={dummyGuests}
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

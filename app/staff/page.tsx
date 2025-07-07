'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/DataTable';
import { dummyStaff } from '@/lib/dummyData';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'phone', label: 'Phone', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true },
  { key: 'hireDate', label: 'Hire Date', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'manager':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'receptionist':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'cleaner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function StaffPage() {
  const renderCell = (staff: any, column: any) => {
    switch (column.key) {
      case 'name':
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#468DD6] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {staff.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-medium">{staff.name}</div>
              <div className="text-sm text-gray-500">
                {staff.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{staff.email}</span>
          </div>
        );
      case 'role':
        return (
          <Badge className={getRoleColor(staff.role)}>
            {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
          </Badge>
        );
      case 'phone':
        return (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{staff.phone}</span>
          </div>
        );
      case 'salary':
        return <span className="font-medium">{formatCurrency(staff.salary)}</span>;
      case 'hireDate':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{format(new Date(staff.hireDate), 'MMM dd, yyyy')}</span>
          </div>
        );
      case 'actions':
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return staff[column.key];
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage hotel staff and roles
          </p>
        </div>
        <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={dummyStaff}
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

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
import { dummyGuests, dummyReservations } from '@/lib/dummyData';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit, Eye, Phone, Mail, MapPin, Calendar, DollarSign, Star, Filter } from 'lucide-react';

const columns = [
  { key: 'name', label: 'Customer Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Phone', sortable: true },
  { key: 'totalStays', label: 'Total Stays', sortable: true },
  { key: 'totalSpent', label: 'Total Spent', sortable: true },
  { key: 'lastStay', label: 'Last Stay', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

const customerTypes = [
  { value: 'vip', label: 'VIP', color: 'bg-purple-100 text-purple-800' },
  { value: 'regular', label: 'Regular', color: 'bg-blue-100 text-blue-800' },
  { value: 'new', label: 'New', color: 'bg-green-100 text-green-800' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' }
];

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const getCustomerType = (guest: any) => {
    if (guest.totalSpent > 800000) return 'vip';
    if (guest.totalStays === 0) return 'new';
    if (guest.totalStays > 0 && guest.totalSpent > 0) return 'regular';
    return 'inactive';
  };

  const getLastStayDate = (guestId: string) => {
    const guestReservations = dummyReservations.filter(r => r.guestId === guestId);
    if (guestReservations.length === 0) return 'Never';
    const lastReservation = guestReservations.sort((a, b) => 
      new Date(b.checkOutDate).getTime() - new Date(a.checkOutDate).getTime()
    )[0];
    return new Date(lastReservation.checkOutDate).toLocaleDateString();
  };

  const renderCell = (guest: any, column: any) => {
    switch (column.key) {
      case 'name':
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#468DD6] to-[#1B2A41] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {guest.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-medium">{guest.name}</div>
              <div className="text-sm text-gray-500">ID: {guest.idNumber}</div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{guest.email}</span>
          </div>
        );
      case 'phone':
        return (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{guest.phone}</span>
          </div>
        );
      case 'totalStays':
        return (
          <div className="text-center">
            <div className="font-medium text-lg">{guest.totalStays}</div>
            <div className="text-xs text-gray-500">stays</div>
          </div>
        );
      case 'totalSpent':
        return (
          <div className="text-center">
            <div className="font-medium text-lg">{formatCurrency(guest.totalSpent)}</div>
            <div className="text-xs text-gray-500">lifetime</div>
          </div>
        );
      case 'lastStay':
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{getLastStayDate(guest.id)}</span>
          </div>
        );
      case 'status':
        const type = getCustomerType(guest);
        const typeConfig = customerTypes.find(t => t.value === type);
        return (
          <Badge className={typeConfig?.color}>
            {typeConfig?.label}
          </Badge>
        );
      case 'actions':
        return (
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setSelectedCustomer(guest)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Customer Details</DialogTitle>
                </DialogHeader>
                {selectedCustomer && <CustomerDetailsModal customer={selectedCustomer} />}
              </DialogContent>
            </Dialog>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return guest[column.key];
    }
  };

  const filteredGuests = filterType === 'all' 
    ? dummyGuests 
    : dummyGuests.filter(guest => getCustomerType(guest) === filterType);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer information, history, and relationships
          </p>
        </div>
        <div className="flex space-x-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              {customerTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <AddCustomerForm onClose={() => setIsAddModalOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Customer Stats */}
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
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dummyGuests.length}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                  <Star className="h-6 w-6 text-blue-600" />
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
                    VIP Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dummyGuests.filter(g => getCustomerType(g) === 'vip').length}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full">
                  <Star className="h-6 w-6 text-purple-600" />
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
                    New This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dummyGuests.filter(g => getCustomerType(g) === 'new').length}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <Plus className="h-6 w-6 text-green-600" />
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
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(dummyGuests.reduce((sum, g) => sum + g.totalSpent, 0))}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Customer Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredGuests}
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

function CustomerDetailsModal({ customer }: { customer: any }) {
  const customerReservations = dummyReservations.filter(r => r.guestId === customer.id);
  
  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{customer.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{customer.address}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Stay Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-xl font-bold text-[#1B2A41] dark:text-white">{customer.totalStays}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Stays</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-xl font-bold text-[#1B2A41] dark:text-white">{formatCurrency(customer.totalSpent)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation History */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Reservation History</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {customerReservations.length > 0 ? (
            customerReservations.map((reservation) => (
              <div key={reservation.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">Room {reservation.room.number}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(reservation.checkInDate).toLocaleDateString()} - {new Date(reservation.checkOutDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(reservation.totalAmount)}</div>
                    <Badge className="text-xs">
                      {reservation.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No reservation history</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AddCustomerForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Enter full name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter email address" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" placeholder="Enter phone number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="idNumber">ID Number</Label>
          <Input id="idNumber" placeholder="Enter ID number" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" placeholder="Enter full address" />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          Add Customer
        </Button>
      </div>
    </form>
  );
}

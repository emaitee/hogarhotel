'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared/DataTable';
import { departments } from '@/lib/hrData'; // Keep departments for the form
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit, Eye, Phone, Mail, ArrowLeft, User, Building, Calendar } from 'lucide-react';
import Link from 'next/link';

const columns = [
  { key: 'employeeId', label: 'Employee ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'position', label: 'Position', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/hr/employees');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setEmployees(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const renderCell = (employee: any, column: any) => {
    switch (column.key) {
      case 'employeeId':
        return <span className="font-mono text-sm">{employee.employeeId}</span>;
      case 'name':
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#468DD6] to-[#1B2A41] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {employee.personalInfo.firstName.charAt(0)}{employee.personalInfo.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-medium">{employee.personalInfo.firstName} {employee.personalInfo.lastName}</div>
              <div className="text-sm text-gray-500">{employee.personalInfo.phone}</div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{employee.personalInfo.email}</span>
          </div>
        );
      case 'department':
        return (
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{employee.employment.department}</span>
          </div>
        );
      case 'position':
        return <span className="text-sm">{employee.employment.position}</span>;
      case 'salary':
        return <span className="font-medium">{formatCurrency(employee.compensation.baseSalary)}</span>;
      case 'status':
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-gray-100 text-gray-800',
          terminated: 'bg-red-100 text-red-800',
          'on-leave': 'bg-yellow-100 text-yellow-800'
        };
        return (
          <Badge className={statusColors[employee.employment.status]}>
            {employee.employment.status.replace('-', ' ')}
          </Badge>
        );
      case 'actions':
        return (
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setSelectedEmployee(employee)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Employee Details</DialogTitle>
                </DialogHeader>
                {selectedEmployee && <EmployeeDetailsModal employee={selectedEmployee} />}
              </DialogContent>
            </Dialog>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return employee[column.key];
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage employee records and information
            </p>
          </div>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <AddEmployeeForm onClose={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Employee Stats */}
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
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {employees.length}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
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
                    Active Employees
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {employees.filter(e => e.employment.status === 'active').length}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <User className="h-6 w-6 text-green-600" />
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
                    Departments
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {departments.length}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full">
                  <Building className="h-6 w-6 text-purple-600" />
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
                    Avg. Tenure
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    1.8 years
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Employees Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={employees}
              columns={columns}
              searchKey="personalInfo.firstName"
              renderCell={renderCell}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function EmployeeDetailsModal({ employee }: { employee: any }) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Full Name:</span>
                <span className="text-sm font-medium">{employee.personalInfo.firstName} {employee.personalInfo.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Email:</span>
                <span className="text-sm">{employee.personalInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Phone:</span>
                <span className="text-sm">{employee.personalInfo.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Gender:</span>
                <span className="text-sm capitalize">{employee.personalInfo.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Marital Status:</span>
                <span className="text-sm capitalize">{employee.personalInfo.maritalStatus}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Employment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Employee ID:</span>
                <span className="text-sm font-mono">{employee.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Department:</span>
                <span className="text-sm">{employee.employment.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Position:</span>
                <span className="text-sm">{employee.employment.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Hire Date:</span>
                <span className="text-sm">{new Date(employee.employment.hireDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status:</span>
                <Badge className="text-xs">
                  {employee.employment.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compensation */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Compensation Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Base Salary:</span>
              <span className="text-sm font-medium">{formatCurrency(employee.compensation.baseSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Pay Frequency:</span>
              <span className="text-sm capitalize">{employee.compensation.payFrequency}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Bank:</span>
              <span className="text-sm">{employee.compensation.bankDetails.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Account:</span>
              <span className="text-sm font-mono">{employee.compensation.bankDetails.accountNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Allowances and Deductions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Allowances</h4>
          <div className="space-y-2">
            {employee.compensation.allowances.map((allowance: any) => (
              <div key={allowance.id} className="flex justify-between text-sm">
                <span>{allowance.name}:</span>
                <span className="font-medium">{formatCurrency(allowance.amount)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Deductions</h4>
          <div className="space-y-2">
            {employee.compensation.deductions.map((deduction: any) => (
              <div key={deduction.id} className="flex justify-between text-sm">
                <span>{deduction.name}:</span>
                <span className="font-medium">
                  {deduction.isPercentage ? `${deduction.amount}%` : formatCurrency(deduction.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddEmployeeForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Enter first name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Enter last name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="Enter phone number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Employment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input id="employeeId" placeholder="e.g., EMP004" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hireDate">Hire Date</Label>
            <Input id="hireDate" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input id="position" placeholder="Enter position title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employmentType">Employment Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseSalary">Base Salary</Label>
            <Input id="baseSalary" type="number" placeholder="Enter base salary" />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          Add Employee
        </Button>
      </div>
    </form>
  );
}

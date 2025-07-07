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
import { formatCurrency } from '@/lib/utils';
import { Plus, ArrowLeft, Star, TrendingUp, Target, Award, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

// Mock data for performance reviews
const performanceReviews = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Adunni Olatunji',
    position: 'Admin',
    reviewPeriod: '2024 Q1',
    overallRating: 4.5,
    status: 'completed',
    reviewDate: new Date('2024-03-15'),
    goals: [
      { id: '1', title: 'Improve customer service', status: 'achieved', rating: 5 },
      { id: '2', title: 'Complete training program', status: 'in-progress', rating: 4 }
    ]
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Usman Garba',
    position: 'Receptionist',
    reviewPeriod: '2024 Q1',
    overallRating: 4.2,
    status: 'completed',
    reviewDate: new Date('2024-03-10'),
    goals: [
      { id: '3', title: 'Reduce check-in time', status: 'achieved', rating: 4 },
      { id: '4', title: 'Learn new booking system', status: 'achieved', rating: 4 }
    ]
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Blessing Adamu',
    position: 'Cleaner',
    reviewPeriod: '2024 Q1',
    overallRating: 4.8,
    status: 'pending',
    reviewDate: new Date('2024-03-20'),
    goals: [
      { id: '5', title: 'Maintain room quality standards', status: 'achieved', rating: 5 },
      { id: '6', title: 'Reduce cleaning time', status: 'in-progress', rating: 4 }
    ]
  }
];

const columns = [
  { key: 'employeeName', label: 'Employee', sortable: true },
  { key: 'position', label: 'Position', sortable: true },
  { key: 'reviewPeriod', label: 'Review Period', sortable: true },
  { key: 'overallRating', label: 'Overall Rating', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'reviewDate', label: 'Review Date', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

export default function PerformancePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const renderCell = (review: any, column: any) => {
    switch (column.key) {
      case 'employeeName':
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#468DD6] to-[#1B2A41] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {review.employeeName.charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-medium">{review.employeeName}</div>
              <div className="text-sm text-gray-500">ID: {review.employeeId}</div>
            </div>
          </div>
        );
      case 'position':
        return <span className="font-medium">{review.position}</span>;
      case 'reviewPeriod':
        return <span className="text-sm">{review.reviewPeriod}</span>;
      case 'overallRating':
        return (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(review.overallRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{review.overallRating}</span>
          </div>
        );
      case 'status':
        return (
          <Badge className={
            review.status === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : review.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }>
            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
          </Badge>
        );
      case 'reviewDate':
        return format(new Date(review.reviewDate), 'MMM dd, yyyy');
      case 'actions':
        return (
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setSelectedReview(review)}>
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Performance Review Details</DialogTitle>
                </DialogHeader>
                {selectedReview && <ReviewDetailsModal review={selectedReview} />}
              </DialogContent>
            </Dialog>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>
        );
      default:
        return review[column.key];
    }
  };

  const avgRating = performanceReviews.reduce((sum, review) => sum + review.overallRating, 0) / performanceReviews.length;
  const completedReviews = performanceReviews.filter(r => r.status === 'completed').length;
  const pendingReviews = performanceReviews.filter(r => r.status === 'pending').length;

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Reviews</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage employee performance evaluations
            </p>
          </div>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
              <Plus className="h-4 w-4 mr-2" />
              New Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Performance Review</DialogTitle>
            </DialogHeader>
            <CreateReviewForm onClose={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Performance Summary */}
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
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {avgRating.toFixed(1)}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
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
                    Completed Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completedReviews}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
                  <Award className="h-6 w-6 text-green-600" />
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
                    Pending Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pendingReviews}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-orange-600" />
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
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {performanceReviews.length}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Reviews Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Performance Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={performanceReviews}
              columns={columns}
              searchKey="employeeName"
              renderCell={renderCell}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function ReviewDetailsModal({ review }: { review: any }) {
  return (
    <div className="space-y-6">
      {/* Employee Info */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#468DD6] to-[#1B2A41] rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-medium">
            {review.employeeName.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {review.employeeName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{review.position}</p>
          <p className="text-sm text-gray-500">{review.reviewPeriod}</p>
        </div>
      </div>

      {/* Overall Rating */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Overall Rating</h4>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(review.overallRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-bold">{review.overallRating}</span>
            </div>
          </div>
          <Badge className={
            review.status === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }>
            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Goals */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Goals & Objectives</h4>
        <div className="space-y-3">
          {review.goals.map((goal: any) => (
            <div key={goal.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">{goal.title}</h5>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={
                      goal.status === 'achieved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }>
                      {goal.status.replace('-', ' ')}
                    </Badge>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < goal.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{goal.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateReviewForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employee">Employee</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Adunni Olatunji</SelectItem>
              <SelectItem value="2">Usman Garba</SelectItem>
              <SelectItem value="3">Blessing Adamu</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reviewPeriod">Review Period</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-q1">2024 Q1</SelectItem>
              <SelectItem value="2024-q2">2024 Q2</SelectItem>
              <SelectItem value="2024-q3">2024 Q3</SelectItem>
              <SelectItem value="2024-q4">2024 Q4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reviewDate">Review Date</Label>
          <Input id="reviewDate" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="overallRating">Overall Rating</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 - Excellent</SelectItem>
              <SelectItem value="4">4 - Good</SelectItem>
              <SelectItem value="3">3 - Average</SelectItem>
              <SelectItem value="2">2 - Below Average</SelectItem>
              <SelectItem value="1">1 - Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="strengths">Strengths</Label>
        <Textarea id="strengths" placeholder="List employee strengths..." />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="improvements">Areas for Improvement</Label>
        <Textarea id="improvements" placeholder="List areas for improvement..." />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="goals">Goals for Next Period</Label>
        <Textarea id="goals" placeholder="Set goals for the next review period..." />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          Create Review
        </Button>
      </div>
    </form>
  );
}

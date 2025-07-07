'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OccupancyChart } from '@/components/charts/OccupancyChart';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { weeklyBookingData, monthlyRevenueData } from '@/lib/dummyData';
import { formatCurrency } from '@/lib/utils';
import { Download, Calendar, BarChart3, TrendingUp, Users } from 'lucide-react';

const reportTypes = [
  { value: 'occupancy', label: 'Occupancy Report', icon: BarChart3 },
  { value: 'revenue', label: 'Revenue Report', icon: TrendingUp },
  { value: 'guest', label: 'Guest Report', icon: Users },
  { value: 'staff', label: 'Staff Report', icon: Users }
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate and export detailed reports
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    defaultValue="2024-01-01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    defaultValue="2024-01-31"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Export Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-[#1B2A41] hover:bg-[#1B2A41]/90">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-[#1B2A41] dark:text-white">85%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Occupancy</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-[#1B2A41] dark:text-white">{formatCurrency(18112000)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-[#1B2A41] dark:text-white">156</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Guests</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-[#1B2A41] dark:text-white">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Staff Members</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Weekly Bookings Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <OccupancyChart data={weeklyBookingData} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={monthlyRevenueData} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Monthly Revenue Report</div>
                  <div className="text-sm text-gray-500">Generated on Jan 15, 2024</div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Occupancy Report</div>
                  <div className="text-sm text-gray-500">Generated on Jan 10, 2024</div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Guest Statistics</div>
                  <div className="text-sm text-gray-500">Generated on Jan 5, 2024</div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

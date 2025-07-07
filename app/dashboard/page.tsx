'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OccupancyChart } from '@/components/charts/OccupancyChart';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { dummyKPIData, weeklyBookingData, monthlyRevenueData } from '@/lib/dummyData';
import { formatCurrency } from '@/lib/utils';
import { 
  Users, 
  Bed, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  UserCheck,
  UserX,
  Home
} from 'lucide-react';

const kpiCards = [
  {
    title: 'Occupancy Rate',
    value: `${dummyKPIData.occupancyRate}%`,
    icon: Home,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    title: 'Today\'s Bookings',
    value: dummyKPIData.todayBookings,
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    title: 'Daily Revenue',
    value: formatCurrency(dummyKPIData.revenue),
    icon: DollarSign,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  {
    title: 'Available Rooms',
    value: `${dummyKPIData.availableRooms}/${dummyKPIData.totalRooms}`,
    icon: Bed,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    title: 'Check-ins Today',
    value: dummyKPIData.checkInsToday,
    icon: UserCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    title: 'Check-outs Today',
    value: dummyKPIData.checkOutsToday,
    icon: UserX,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20'
  },
  {
    title: 'Average Daily Rate',
    value: formatCurrency(dummyKPIData.avgDailyRate),
    icon: TrendingUp,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
  },
  {
    title: 'Total Guests',
    value: '156',
    icon: Users,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20'
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your hotel's performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {card.value}
                      </p>
                    </div>
                    <div className={`${card.bgColor} p-3 rounded-full`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
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
              <CardTitle>Weekly Bookings</CardTitle>
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
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={monthlyRevenueData} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  New reservation from Adebayo Ogundimu - Room 302
                </p>
                <span className="text-xs text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Room 201 cleaning completed
                </p>
                <span className="text-xs text-gray-500">15 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payment received for reservation #12345
                </p>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

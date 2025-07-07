'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { dummyHousekeepingTasks } from '@/lib/dummyData';
import { Plus, User, Clock, AlertCircle } from 'lucide-react';

const priorityColors = {
  low: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  high: 'text-red-600 bg-red-50 dark:bg-red-900/20'
};

const taskTypeIcons = {
  cleaning: '🧹',
  maintenance: '🔧',
  inspection: '👁️'
};

export default function HousekeepingPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Housekeeping</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage cleaning and maintenance tasks
          </p>
        </div>
        <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks by Status */}
        {['pending', 'in-progress', 'completed'].map((status, index) => (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="capitalize flex items-center justify-between">
                  <span>{status.replace('-', ' ')}</span>
                  <StatusBadge status={status} variant="task" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dummyHousekeepingTasks
                    .filter(task => task.status === status)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{taskTypeIcons[task.taskType]}</span>
                            <div>
                              <h3 className="font-medium">Room {task.room.number}</h3>
                              <p className="text-sm text-gray-500 capitalize">
                                {task.taskType}
                              </p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </div>
                        </div>

                        {task.assignedTo && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <User className="h-4 w-4" />
                            <span>{task.assignedTo}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>

                        {task.notes && (
                          <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <AlertCircle className="h-4 w-4 mt-0.5" />
                            <span>{task.notes}</span>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          {task.status === 'pending' && (
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Assign to..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="maria">Maria Garcia</SelectItem>
                                <SelectItem value="carlos">Carlos Rodriguez</SelectItem>
                                <SelectItem value="ana">Ana Martinez</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          {task.status === 'in-progress' && (
                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                              Mark Complete
                            </Button>
                          )}
                          {task.status === 'completed' && (
                            <Button size="sm" variant="outline" className="w-full">
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

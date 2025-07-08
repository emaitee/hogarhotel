"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useHousekeeping } from "@/hooks/useHousekeeping"
import { useRooms } from "@/hooks/useRooms"
import { Plus, User, Clock, AlertCircle, CheckCircle, Play, Pause } from "lucide-react"
import { toast } from "sonner"

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
}

const statusColors = {
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
}

const taskTypeIcons = {
  cleaning: "🧹",
  maintenance: "🔧",
  inspection: "👁️",
}

const housekeepingStaff = ["Maria Garcia", "Carlos Rodriguez", "Ana Martinez", "Luis Fernandez", "Sofia Morales"]

export default function HousekeepingPage() {
  const { tasks, loading, createTask, updateTask, deleteTask, assignTask, completeTask } = useHousekeeping()
  const { rooms } = useRooms()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  // Form state for creating new task
  const [newTask, setNewTask] = useState({
    roomId: "",
    taskType: "cleaning" as "cleaning" | "maintenance" | "inspection",
    priority: "medium" as "low" | "medium" | "high",
    notes: "",
    assignedTo: "",
    estimatedDuration: 30,
  })

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTask.roomId || !newTask.taskType) {
      toast.error("Please select a room and task type")
      return
    }

    try {
      await createTask({
        roomId: newTask.roomId,
        taskType: newTask.taskType,
        priority: newTask.priority,
        notes: newTask.notes,
        assignedTo: newTask.assignedTo || undefined,
        estimatedDuration: newTask.estimatedDuration,
      })

      setNewTask({
        roomId: "",
        taskType: "cleaning",
        priority: "medium",
        notes: "",
        assignedTo: "",
        estimatedDuration: 30,
      })
      setIsCreateModalOpen(false)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleAssignTask = async (taskId: string, assignedTo: string) => {
    try {
      await assignTask(taskId, assignedTo)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleUpdateStatus = async (taskId: string, status: "pending" | "in-progress" | "completed") => {
    try {
      await updateTask(taskId, { status })
    } catch (error) {
      // Error is handled in the hook
    }
  }

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.roomId.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assignedTo && task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      task.notes.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Group tasks by status
  const tasksByStatus = {
    pending: filteredTasks.filter((task) => task.status === "pending"),
    "in-progress": filteredTasks.filter((task) => task.status === "in-progress"),
    completed: filteredTasks.filter((task) => task.status === "completed"),
  }

  // Calculate statistics
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    highPriority: tasks.filter((t) => t.priority === "high" && t.status !== "completed").length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A41]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Housekeeping</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage cleaning and maintenance tasks</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Housekeeping Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <Label htmlFor="room">Room</Label>
                <Select
                  value={newTask.roomId}
                  onValueChange={(value) => setNewTask((prev) => ({ ...prev, roomId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room._id} value={room._id}>
                        Room {room.number} - {room.type} ({room.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="taskType">Task Type</Label>
                <Select
                  value={newTask.taskType}
                  onValueChange={(value: "cleaning" | "maintenance" | "inspection") =>
                    setNewTask((prev) => ({ ...prev, taskType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning">🧹 Cleaning</SelectItem>
                    <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                    <SelectItem value="inspection">👁️ Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setNewTask((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignedTo">Assign To (Optional)</Label>
                <Select
                  value={newTask.assignedTo}
                  onValueChange={(value) => setNewTask((prev) => ({ ...prev, assignedTo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {housekeepingStaff.map((staff) => (
                      <SelectItem key={staff} value={staff}>
                        {staff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
                <Input
                  type="number"
                  value={newTask.estimatedDuration}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, estimatedDuration: Number.parseInt(e.target.value) || 30 }))
                  }
                  min="15"
                  max="480"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  value={newTask.notes}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any special instructions or notes..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
                  Create Task
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#1B2A41]">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by room, staff, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(["pending", "in-progress", "completed"] as const).map((status, index) => (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="capitalize flex items-center justify-between">
                  <span>{status.replace("-", " ")}</span>
                  <Badge className={statusColors[status]}>{tasksByStatus[status].length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasksByStatus[status].map((task) => (
                    <div
                      key={task._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{taskTypeIcons[task.taskType]}</span>
                          <div>
                            <h3 className="font-medium">Room {task.roomId.number}</h3>
                            <p className="text-sm text-gray-500 capitalize">{task.taskType}</p>
                          </div>
                        </div>
                        <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                      </div>

                      {task.assignedTo && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <User className="h-4 w-4" />
                          <span>{task.assignedTo}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>{task.estimatedDuration} min</span>
                        <span>•</span>
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>

                      {task.notes && (
                        <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <AlertCircle className="h-4 w-4 mt-0.5" />
                          <span>{task.notes}</span>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {task.status === "pending" && (
                          <>
                            <Select onValueChange={(value) => handleAssignTask(task._id, value)}>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Assign to..." />
                              </SelectTrigger>
                              <SelectContent>
                                {housekeepingStaff.map((staff) => (
                                  <SelectItem key={staff} value={staff}>
                                    {staff}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(task._id, "in-progress")}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {task.status === "in-progress" && (
                          <>
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleCompleteTask(task._id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(task._id, "pending")}>
                              <Pause className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {task.status === "completed" && (
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed {task.completedAt && new Date(task.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {tasksByStatus[status].length === 0 && (
                    <div className="text-center text-gray-500 py-8">No {status.replace("-", " ")} tasks</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

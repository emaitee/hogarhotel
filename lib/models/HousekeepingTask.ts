import mongoose from "mongoose"

const housekeepingTaskSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    taskType: {
      type: String,
      enum: ["cleaning", "maintenance", "inspection"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    assignedTo: {
      type: String,
      default: null,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    notes: {
      type: String,
      default: "",
    },
    estimatedDuration: {
      type: Number, // in minutes
      default: 30,
    },
    actualDuration: {
      type: Number, // in minutes
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.HousekeepingTask || mongoose.model("HousekeepingTask", housekeepingTaskSchema)

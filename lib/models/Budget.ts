import mongoose from "mongoose"

const budgetItemSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TransactionCategory",
    required: true,
  },
  budgetedAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  actualAmount: {
    type: Number,
    default: 0,
  },
  variance: {
    type: Number,
    default: 0,
  },
  variancePercentage: {
    type: Number,
    default: 0,
  },
})

const budgetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    period: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    totalActual: {
      type: Number,
      default: 0,
    },
    totalVariance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed", "archived"],
      default: "draft",
    },
    items: [budgetItemSchema],
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    approvedBy: {
      type: String,
      trim: true,
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

budgetSchema.index({ period: 1 })
budgetSchema.index({ status: 1 })
budgetSchema.index({ startDate: 1, endDate: 1 })
budgetSchema.index({ createdBy: 1 })

export default mongoose.models.Budget || mongoose.model("Budget", budgetSchema)

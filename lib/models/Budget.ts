import mongoose from "mongoose"

const budgetItemSchema = new mongoose.Schema({
  category: {
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
    min: 0,
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
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    type: {
      type: String,
      enum: ["annual", "quarterly", "monthly", "project"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed", "archived"],
      default: "draft",
    },
    totalBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    totalActual: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalVariance: {
      type: Number,
      default: 0,
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
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

budgetSchema.index({ status: 1 })
budgetSchema.index({ type: 1 })
budgetSchema.index({ "period.startDate": 1, "period.endDate": 1 })
budgetSchema.index({ createdBy: 1 })

// Pre-save middleware to calculate totals
budgetSchema.pre("save", function (next) {
  this.totalBudget = this.items.reduce((sum, item) => sum + item.budgetedAmount, 0)
  this.totalActual = this.items.reduce((sum, item) => sum + item.actualAmount, 0)
  this.totalVariance = this.totalActual - this.totalBudget
  next()
})

export default mongoose.models.Budget || mongoose.model("Budget", budgetSchema)

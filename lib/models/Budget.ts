import mongoose from "mongoose"

const budgetCategorySchema = new mongoose.Schema({
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
    year: {
      type: Number,
      required: true,
      min: 2020,
      max: 2050,
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
    },
    period: {
      type: String,
      enum: ["monthly", "quarterly", "annual"],
      required: true,
    },
    categories: [budgetCategorySchema],
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
    variance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "approved", "active", "closed"],
      default: "draft",
    },
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

// Indexes
budgetSchema.index({ year: 1, month: 1 })
budgetSchema.index({ status: 1 })
budgetSchema.index({ createdBy: 1 })
budgetSchema.index({ period: 1 })

// Pre-save middleware to calculate totals
budgetSchema.pre("save", function (next) {
  this.totalBudget = this.categories.reduce((sum, cat) => sum + cat.budgetedAmount, 0)
  this.totalActual = this.categories.reduce((sum, cat) => sum + cat.actualAmount, 0)
  this.variance = this.totalActual - this.totalBudget

  // Calculate variance for each category
  this.categories.forEach((cat) => {
    cat.variance = cat.actualAmount - cat.budgetedAmount
    cat.variancePercentage = cat.budgetedAmount > 0 ? (cat.variance / cat.budgetedAmount) * 100 : 0
  })

  next()
})

export default mongoose.models.Budget || mongoose.model("Budget", budgetSchema)

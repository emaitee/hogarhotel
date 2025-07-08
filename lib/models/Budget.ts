import mongoose from "mongoose"

const BudgetCategorySchema = new mongoose.Schema({
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

const BudgetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
    },
    categories: [BudgetCategorySchema],
    totalBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    totalActual: {
      type: Number,
      default: 0,
    },
    variance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "approved", "active"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
)

BudgetSchema.index({ year: 1, month: 1 })
BudgetSchema.index({ status: 1 })

export default mongoose.models.Budget || mongoose.model("Budget", BudgetSchema)

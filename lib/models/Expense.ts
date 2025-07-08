import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransactionCategory",
      required: true,
    },
    vendor: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "rejected"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "check", "credit_card", "bank_transfer", "other"],
    },
    reference: {
      type: String,
      trim: true,
    },
    receiptUrl: {
      type: String,
    },
    notes: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: String,
      trim: true,
    },
    approvedAt: {
      type: Date,
    },
    paidAt: {
      type: Date,
    },
    tags: [String],
  },
  {
    timestamps: true,
  },
)

expenseSchema.index({ status: 1 })
expenseSchema.index({ date: -1 })
expenseSchema.index({ vendor: 1 })
expenseSchema.index({ categoryId: 1 })
expenseSchema.index({ dueDate: 1 })

export default mongoose.models.Expense || mongoose.model("Expense", expenseSchema)

import mongoose from "mongoose"

const ExpenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    vendor: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransactionCategory",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "cheque", "card"],
      required: true,
    },
    reference: {
      type: String,
      trim: true,
    },
    receipt: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "rejected"],
      default: "pending",
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
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

ExpenseSchema.index({ date: -1 })
ExpenseSchema.index({ vendor: 1 })
ExpenseSchema.index({ status: 1 })
ExpenseSchema.index({ categoryId: 1 })

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema)

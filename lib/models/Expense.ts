import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema(
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
      type: String, // URL to receipt image/document
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

// Indexes
expenseSchema.index({ date: -1 })
expenseSchema.index({ vendor: 1 })
expenseSchema.index({ status: 1 })
expenseSchema.index({ categoryId: 1 })
expenseSchema.index({ createdBy: 1 })

// Virtual for category population
expenseSchema.virtual("category", {
  ref: "TransactionCategory",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
})

expenseSchema.set("toJSON", { virtuals: true })
expenseSchema.set("toObject", { virtuals: true })

export default mongoose.models.Expense || mongoose.model("Expense", expenseSchema)

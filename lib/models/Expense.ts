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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransactionCategory",
      required: true,
    },
    vendor: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
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
      enum: ["cash", "check", "bank_transfer", "credit_card", "other"],
    },
    reference: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
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
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
  },
)

expenseSchema.index({ status: 1 })
expenseSchema.index({ date: 1 })
expenseSchema.index({ category: 1 })
expenseSchema.index({ "vendor.name": 1 })
expenseSchema.index({ createdBy: 1 })

export default mongoose.models.Expense || mongoose.model("Expense", expenseSchema)

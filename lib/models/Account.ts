import mongoose from "mongoose"

export interface IAccount extends mongoose.Document {
  code: string
  name: string
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense"
  category: string
  balance: number
  parentAccount?: string
  isActive: boolean
  description?: string
  createdAt: Date
  updatedAt: Date
}

const AccountSchema = new mongoose.Schema<IAccount>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Asset", "Liability", "Equity", "Revenue", "Expense"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    parentAccount: {
      type: String,
      ref: "Account",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
AccountSchema.index({ code: 1 })
AccountSchema.index({ type: 1 })
AccountSchema.index({ isActive: 1 })

export const Account = mongoose.models.Account || mongoose.model<IAccount>("Account", AccountSchema)

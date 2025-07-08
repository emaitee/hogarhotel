import mongoose from "mongoose"

export interface ITransactionEntry {
  accountCode: string
  accountName: string
  debit: number
  credit: number
}

export interface ITransaction extends mongoose.Document {
  transactionNumber: string
  date: Date
  description: string
  reference?: string
  category: string
  entries: ITransactionEntry[]
  totalAmount: number
  status: "Draft" | "Posted" | "Cancelled"
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

const TransactionEntrySchema = new mongoose.Schema<ITransactionEntry>({
  accountCode: {
    type: String,
    required: true,
    ref: "Account",
  },
  accountName: {
    type: String,
    required: true,
  },
  debit: {
    type: Number,
    default: 0,
    min: 0,
  },
  credit: {
    type: Number,
    default: 0,
    min: 0,
  },
})

const TransactionSchema = new mongoose.Schema<ITransaction>(
  {
    transactionNumber: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    entries: [TransactionEntrySchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Posted", "Cancelled"],
      default: "Draft",
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
TransactionSchema.index({ transactionNumber: 1 })
TransactionSchema.index({ date: -1 })
TransactionSchema.index({ status: 1 })
TransactionSchema.index({ category: 1 })

// Pre-save middleware to generate transaction number
TransactionSchema.pre("save", async function (next) {
  if (this.isNew && !this.transactionNumber) {
    const count = await mongoose.model("Transaction").countDocuments()
    this.transactionNumber = `TXN-${String(count + 1).padStart(6, "0")}`
  }
  next()
})

export const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema)

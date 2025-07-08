import mongoose, { type Document, Schema } from "mongoose"

export interface ITaxRecord extends Document {
  taxType: string
  period: string
  startDate: Date
  endDate: Date
  dueDate: Date
  amount: number
  status: "pending" | "filed" | "paid" | "overdue"
  filedDate?: Date
  paidDate?: Date
  description?: string
  reference?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const TaxRecordSchema = new Schema<ITaxRecord>(
  {
    taxType: {
      type: String,
      required: true,
      trim: true,
    },
    period: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "filed", "paid", "overdue"],
      default: "pending",
    },
    filedDate: {
      type: Date,
    },
    paidDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
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

TaxRecordSchema.index({ taxType: 1, period: 1 })
TaxRecordSchema.index({ status: 1, dueDate: 1 })
TaxRecordSchema.index({ dueDate: 1 })

// Virtual to check if overdue
TaxRecordSchema.virtual("isOverdue").get(function () {
  return this.status !== "paid" && new Date() > this.dueDate
})

const TaxRecord = mongoose.models.TaxRecord || mongoose.model<ITaxRecord>("TaxRecord", TaxRecordSchema)

export default TaxRecord

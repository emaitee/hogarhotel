import mongoose from "mongoose"

const TaxRecordSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["vat", "income_tax", "withholding_tax"],
      required: true,
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
    taxableAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    taxRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    taxAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "filed", "paid"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    filedAt: {
      type: Date,
    },
    paidAt: {
      type: Date,
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

TaxRecordSchema.index({ type: 1 })
TaxRecordSchema.index({ status: 1 })
TaxRecordSchema.index({ dueDate: 1 })
TaxRecordSchema.index({ "period.startDate": 1, "period.endDate": 1 })

export default mongoose.models.TaxRecord || mongoose.model("TaxRecord", TaxRecordSchema)

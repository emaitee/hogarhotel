import mongoose from "mongoose"

const taxRecordSchema = new mongoose.Schema(
  {
    taxType: {
      type: String,
      required: true,
      enum: ["income_tax", "sales_tax", "property_tax", "payroll_tax", "other"],
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
      enum: ["pending", "filed", "paid", "overdue"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    filedDate: {
      type: Date,
    },
    paidDate: {
      type: Date,
    },
    reference: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    filedBy: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
)

taxRecordSchema.index({ taxType: 1 })
taxRecordSchema.index({ status: 1 })
taxRecordSchema.index({ dueDate: 1 })
taxRecordSchema.index({ "period.startDate": 1, "period.endDate": 1 })

export default mongoose.models.TaxRecord || mongoose.model("TaxRecord", taxRecordSchema)

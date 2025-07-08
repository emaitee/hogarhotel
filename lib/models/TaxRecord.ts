import mongoose from "mongoose"

const taxRecordSchema = new mongoose.Schema(
  {
    taxType: {
      type: String,
      enum: ["VAT", "Corporate Income Tax", "Withholding Tax", "PAYE", "Personal Income Tax"],
      required: true,
    },
    period: {
      type: String,
      required: true,
      trim: true,
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
    notes: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    filedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
taxRecordSchema.index({ taxType: 1 })
taxRecordSchema.index({ period: 1 })
taxRecordSchema.index({ status: 1 })
taxRecordSchema.index({ dueDate: 1 })
taxRecordSchema.index({ createdBy: 1 })

// Pre-save middleware to calculate tax amount
taxRecordSchema.pre("save", function (next) {
  if (this.isModified("taxableAmount") || this.isModified("taxRate")) {
    this.taxAmount = (this.taxableAmount * this.taxRate) / 100
  }
  next()
})

// Method to check if overdue
taxRecordSchema.methods.isOverdue = function () {
  return this.status !== "paid" && new Date() > this.dueDate
}

export default mongoose.models.TaxRecord || mongoose.model("TaxRecord", taxRecordSchema)

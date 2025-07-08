import mongoose from "mongoose"

const FinancialReportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["balance_sheet", "income_statement", "cash_flow", "trial_balance"],
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
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    generatedBy: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "final"],
      default: "final",
    },
  },
  {
    timestamps: true,
  },
)

FinancialReportSchema.index({ type: 1 })
FinancialReportSchema.index({ generatedAt: -1 })
FinancialReportSchema.index({ "period.startDate": 1, "period.endDate": 1 })

export default mongoose.models.FinancialReport || mongoose.model("FinancialReport", FinancialReportSchema)

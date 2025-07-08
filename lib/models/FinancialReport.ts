import mongoose from "mongoose"

const financialReportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["profit-loss", "balance-sheet", "cash-flow", "revenue-analysis", "expense-analysis", "budget-variance"],
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
    summary: {
      totalRevenue: { type: Number, default: 0 },
      totalExpenses: { type: Number, default: 0 },
      netProfit: { type: Number, default: 0 },
      profitMargin: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["generating", "completed", "failed"],
      default: "generating",
    },
    generatedBy: {
      type: String,
      required: true,
      trim: true,
    },
    parameters: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
financialReportSchema.index({ type: 1 })
financialReportSchema.index({ "period.startDate": 1, "period.endDate": 1 })
financialReportSchema.index({ generatedBy: 1 })
financialReportSchema.index({ status: 1 })
financialReportSchema.index({ createdAt: -1 })

export default mongoose.models.FinancialReport || mongoose.model("FinancialReport", financialReportSchema)

import mongoose from "mongoose"

const TransactionCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    color: {
      type: String,
      default: "#3B82F6",
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransactionCategory",
    },
  },
  {
    timestamps: true,
  },
)

TransactionCategorySchema.index({ name: 1, type: 1 })

export default mongoose.models.TransactionCategory || mongoose.model("TransactionCategory", TransactionCategorySchema)

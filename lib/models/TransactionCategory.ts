import mongoose from "mongoose"

const transactionCategorySchema = new mongoose.Schema(
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
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: "#3B82F6",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransactionCategory",
    },
    code: {
      type: String,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

transactionCategorySchema.index({ name: 1 })
transactionCategorySchema.index({ type: 1 })
transactionCategorySchema.index({ isActive: 1 })

export default mongoose.models.TransactionCategory || mongoose.model("TransactionCategory", transactionCategorySchema)

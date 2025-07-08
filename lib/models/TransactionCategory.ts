import mongoose, { type Document, Schema } from "mongoose"

export interface ITransactionCategory extends Document {
  name: string
  code: string
  type: "income" | "expense"
  description?: string
  color: string
  isActive: boolean
  parentCategory?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const TransactionCategorySchema = new Schema<ITransactionCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      default: "#3B82F6",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "TransactionCategory",
    },
  },
  {
    timestamps: true,
  },
)

TransactionCategorySchema.index({ code: 1 })
TransactionCategorySchema.index({ type: 1, isActive: 1 })

const TransactionCategory =
  mongoose.models.TransactionCategory ||
  mongoose.model<ITransactionCategory>("TransactionCategory", TransactionCategorySchema)

export default TransactionCategory

import { ObjectId } from "mongodb"
import type { IAccount } from "./Account"

export interface ITransactionCategory {
  _id?: ObjectId
  name: string
  type: "income" | "expense"
  color: string
  description?: string
}

export interface ITransaction {
  _id?: ObjectId
  date: Date
  description: string
  reference: string
  type: "debit" | "credit"
  amount: number
  accountId: string
  categoryId: string
  attachments?: string[]
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface ITransactionWithDetails extends ITransaction {
  account: IAccount
  category: ITransactionCategory
}

export class Transaction {
  static collectionName = "transactions"
  static categoryCollectionName = "transaction_categories"

  static async create(transactionData: Omit<ITransaction, "_id" | "createdAt" | "updatedAt">): Promise<ITransaction> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()
    const { Account } = await import("./Account")

    const transaction: ITransaction = {
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Start a session for transaction
    const session = db.client.startSession()

    try {
      await session.withTransaction(async () => {
        // Insert the transaction
        const result = await db.collection(this.collectionName).insertOne(transaction, { session })
        transaction._id = result.insertedId

        // Update account balance
        await Account.updateBalance(transactionData.accountId, transactionData.amount, transactionData.type === "debit")
      })

      return transaction
    } finally {
      await session.endSession()
    }
  }

  static async findAll(): Promise<ITransactionWithDetails[]> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()

    const transactions = await db
      .collection(this.collectionName)
      .aggregate([
        {
          $lookup: {
            from: "accounts",
            localField: "accountId",
            foreignField: "_id",
            as: "account",
            pipeline: [{ $project: { code: 1, name: 1, type: 1 } }],
          },
        },
        {
          $lookup: {
            from: this.categoryCollectionName,
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$account",
        },
        {
          $unwind: "$category",
        },
        {
          $sort: { date: -1 },
        },
      ])
      .toArray()

    return transactions as ITransactionWithDetails[]
  }

  static async findById(id: string): Promise<ITransactionWithDetails | null> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()

    const transactions = await db
      .collection(this.collectionName)
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "accounts",
            localField: "accountId",
            foreignField: "_id",
            as: "account",
          },
        },
        {
          $lookup: {
            from: this.categoryCollectionName,
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$account",
        },
        {
          $unwind: "$category",
        },
      ])
      .toArray()

    return (transactions[0] as ITransactionWithDetails) || null
  }

  static async update(id: string, updateData: Partial<ITransaction>): Promise<ITransaction | null> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()

    const result = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result as ITransaction | null
  }

  static async delete(id: string): Promise<boolean> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()

    const result = await db.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) })

    return result.deletedCount === 1
  }

  // Category methods
  static async createCategory(categoryData: Omit<ITransactionCategory, "_id">): Promise<ITransactionCategory> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()

    const result = await db.collection(this.categoryCollectionName).insertOne(categoryData)
    return { ...categoryData, _id: result.insertedId }
  }

  static async findAllCategories(): Promise<ITransactionCategory[]> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()

    return (await db
      .collection(this.categoryCollectionName)
      .find({})
      .sort({ name: 1 })
      .toArray()) as ITransactionCategory[]
  }
}

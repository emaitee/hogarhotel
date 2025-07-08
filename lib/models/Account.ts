import { ObjectId } from "mongodb"

export interface IAccount {
  _id?: ObjectId
  code: string
  name: string
  type: "asset" | "liability" | "equity" | "revenue" | "expense"
  category: string
  balance: number
  isActive: boolean
  parentId?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export class Account {
  static collectionName = "accounts"

  static async create(accountData: Omit<IAccount, "_id" | "createdAt" | "updatedAt">): Promise<IAccount> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()

    const account: IAccount = {
      ...accountData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(this.collectionName).insertOne(account)
    return { ...account, _id: result.insertedId }
  }

  static async findAll(): Promise<IAccount[]> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()

    return (await db.collection(this.collectionName).find({}).sort({ code: 1 }).toArray()) as IAccount[]
  }

  static async findById(id: string): Promise<IAccount | null> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()

    return (await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) })) as IAccount | null
  }

  static async findByCode(code: string): Promise<IAccount | null> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()

    return (await db.collection(this.collectionName).findOne({ code })) as IAccount | null
  }

  static async update(id: string, updateData: Partial<IAccount>): Promise<IAccount | null> {
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

    return result as IAccount | null
  }

  static async delete(id: string): Promise<boolean> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()

    const result = await db.collection(this.collectionName).deleteOne({ _id: new ObjectId(id) })

    return result.deletedCount === 1
  }

  static async updateBalance(id: string, amount: number, isDebit: boolean): Promise<void> {
    const { connectToDatabase } = await import("../mongodb")
    const { db } = await connectToDatabase()

    const account = await this.findById(id)
    if (!account) throw new Error("Account not found")

    let newBalance = account.balance

    // For asset and expense accounts, debit increases balance
    // For liability, equity, and revenue accounts, credit increases balance
    if (account.type === "asset" || account.type === "expense") {
      newBalance = isDebit ? account.balance + amount : account.balance - amount
    } else {
      newBalance = isDebit ? account.balance - amount : account.balance + amount
    }

    await db.collection(this.collectionName).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          balance: newBalance,
          updatedAt: new Date(),
        },
      },
    )
  }
}

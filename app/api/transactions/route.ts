import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Transaction } from "@/lib/models/Transaction"
import { Account } from "@/lib/models/Account"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build query
    const query: any = {}
    if (status) query.status = status
    if (category) query.category = category
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const skip = (page - 1) * limit

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Transaction.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { date, description, reference, category, entries, createdBy } = body

    // Validate required fields
    if (!description || !category || !entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Validate entries
    let totalDebits = 0
    let totalCredits = 0

    for (const entry of entries) {
      if (!entry.accountCode || (!entry.debit && !entry.credit)) {
        return NextResponse.json({ success: false, error: "Invalid transaction entry" }, { status: 400 })
      }

      // Verify account exists
      const account = await Account.findOne({ code: entry.accountCode, isActive: true })
      if (!account) {
        return NextResponse.json({ success: false, error: `Account ${entry.accountCode} not found` }, { status: 400 })
      }

      entry.accountName = account.name
      totalDebits += entry.debit || 0
      totalCredits += entry.credit || 0
    }

    // Validate double-entry bookkeeping
    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      return NextResponse.json(
        { success: false, error: "Transaction is not balanced. Debits must equal credits." },
        { status: 400 },
      )
    }

    // Create transaction
    const transaction = new Transaction({
      date: date ? new Date(date) : new Date(),
      description,
      reference,
      category,
      entries,
      totalAmount: totalDebits,
      createdBy: createdBy || "System",
    })

    await transaction.save()

    // Update account balances if transaction is posted
    if (transaction.status === "Posted") {
      for (const entry of entries) {
        const account = await Account.findOne({ code: entry.accountCode })
        if (account) {
          // For assets and expenses, debit increases balance
          // For liabilities, equity, and revenue, credit increases balance
          if (["Asset", "Expense"].includes(account.type)) {
            account.balance += (entry.debit || 0) - (entry.credit || 0)
          } else {
            account.balance += (entry.credit || 0) - (entry.debit || 0)
          }
          await account.save()
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: transaction,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ success: false, error: "Failed to create transaction" }, { status: 500 })
  }
}

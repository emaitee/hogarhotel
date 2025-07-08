import { type NextRequest, NextResponse } from "next/server"
import { Transaction } from "@/lib/models/Transaction"

export async function GET() {
  try {
    const transactions = await Transaction.findAll()
    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { date, description, reference, type, amount, accountId, categoryId, createdBy = "system" } = body

    if (!date || !description || !reference || !type || !amount || !accountId || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate transaction type
    if (!["debit", "credit"].includes(type)) {
      return NextResponse.json({ error: "Invalid transaction type. Must be debit or credit" }, { status: 400 })
    }

    // Validate amount
    const parsedAmount = Number.parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 })
    }

    const transaction = await Transaction.create({
      date: new Date(date),
      description,
      reference,
      type,
      amount: parsedAmount,
      accountId,
      categoryId,
      attachments: body.attachments || [],
      notes: body.notes,
      createdBy,
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}

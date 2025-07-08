import { type NextRequest, NextResponse } from "next/server"
import { Transaction } from "@/lib/models/Transaction"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transaction = await Transaction.findById(params.id)

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate transaction type if provided
    if (body.type && !["debit", "credit"].includes(body.type)) {
      return NextResponse.json({ error: "Invalid transaction type. Must be debit or credit" }, { status: 400 })
    }

    // Validate amount if provided
    if (body.amount !== undefined) {
      const parsedAmount = Number.parseFloat(body.amount)
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 })
      }
      body.amount = parsedAmount
    }

    // Convert date if provided
    if (body.date) {
      body.date = new Date(body.date)
    }

    const transaction = await Transaction.update(params.id, body)

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await Transaction.delete(params.id)

    if (!success) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
  }
}

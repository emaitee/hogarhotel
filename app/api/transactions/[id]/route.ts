import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Transaction } from "@/lib/models/Transaction"
import { Account } from "@/lib/models/Account"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const transaction = await Transaction.findById(params.id).lean()

    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    })
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch transaction" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const body = await request.json()
    const { status } = body

    const transaction = await Transaction.findById(params.id)
    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 })
    }

    // Only allow status updates for now
    if (status && ["Draft", "Posted", "Cancelled"].includes(status)) {
      const oldStatus = transaction.status
      transaction.status = status

      // Update account balances when posting or cancelling
      if (oldStatus !== "Posted" && status === "Posted") {
        // Post transaction - update balances
        for (const entry of transaction.entries) {
          const account = await Account.findOne({ code: entry.accountCode })
          if (account) {
            if (["Asset", "Expense"].includes(account.type)) {
              account.balance += (entry.debit || 0) - (entry.credit || 0)
            } else {
              account.balance += (entry.credit || 0) - (entry.debit || 0)
            }
            await account.save()
          }
        }
      } else if (oldStatus === "Posted" && status !== "Posted") {
        // Reverse transaction - update balances
        for (const entry of transaction.entries) {
          const account = await Account.findOne({ code: entry.accountCode })
          if (account) {
            if (["Asset", "Expense"].includes(account.type)) {
              account.balance -= (entry.debit || 0) - (entry.credit || 0)
            } else {
              account.balance -= (entry.credit || 0) - (entry.debit || 0)
            }
            await account.save()
          }
        }
      }

      await transaction.save()
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    })
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json({ success: false, error: "Failed to update transaction" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const transaction = await Transaction.findById(params.id)
    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 })
    }

    // Only allow deletion of draft transactions
    if (transaction.status !== "Draft") {
      return NextResponse.json({ success: false, error: "Only draft transactions can be deleted" }, { status: 400 })
    }

    await Transaction.findByIdAndDelete(params.id)

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json({ success: false, error: "Failed to delete transaction" }, { status: 500 })
  }
}

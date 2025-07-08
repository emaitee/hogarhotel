import { type NextRequest, NextResponse } from "next/server"
import { Account } from "@/lib/models/Account"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const account = await Account.findById(params.id)

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error("Error fetching account:", error)
    return NextResponse.json({ error: "Failed to fetch account" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate account type if provided
    if (body.type) {
      const validTypes = ["asset", "liability", "equity", "revenue", "expense"]
      if (!validTypes.includes(body.type)) {
        return NextResponse.json({ error: "Invalid account type" }, { status: 400 })
      }
    }

    // Check if new code conflicts with existing accounts
    if (body.code) {
      const existingAccount = await Account.findByCode(body.code)
      if (existingAccount && existingAccount._id?.toString() !== params.id) {
        return NextResponse.json({ error: "Account code already exists" }, { status: 409 })
      }
    }

    const account = await Account.update(params.id, body)

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error("Error updating account:", error)
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await Account.delete(params.id)

    if (!success) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}

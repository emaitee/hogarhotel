import { type NextRequest, NextResponse } from "next/server"
import { Account } from "@/lib/models/Account"

export async function GET() {
  try {
    const accounts = await Account.findAll()
    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { code, name, type, category, balance = 0, isActive = true } = body

    if (!code || !name || !type || !category) {
      return NextResponse.json({ error: "Missing required fields: code, name, type, category" }, { status: 400 })
    }

    // Check if account code already exists
    const existingAccount = await Account.findByCode(code)
    if (existingAccount) {
      return NextResponse.json({ error: "Account code already exists" }, { status: 409 })
    }

    // Validate account type
    const validTypes = ["asset", "liability", "equity", "revenue", "expense"]
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid account type" }, { status: 400 })
    }

    const account = await Account.create({
      code,
      name,
      type,
      category,
      balance: Number.parseFloat(balance) || 0,
      isActive: Boolean(isActive),
      parentId: body.parentId,
      description: body.description,
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error("Error creating account:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}

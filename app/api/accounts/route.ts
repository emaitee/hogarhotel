import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Account } from "@/lib/models/Account"

export async function GET() {
  try {
    await connectDB()

    const accounts = await Account.find({ isActive: true }).sort({ code: 1 }).lean()

    return NextResponse.json({
      success: true,
      data: accounts,
    })
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch accounts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { code, name, type, category, balance = 0, parentAccount, description } = body

    // Validate required fields
    if (!code || !name || !type || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if account code already exists
    const existingAccount = await Account.findOne({ code })
    if (existingAccount) {
      return NextResponse.json({ success: false, error: "Account code already exists" }, { status: 400 })
    }

    // Create new account
    const account = new Account({
      code,
      name,
      type,
      category,
      balance,
      parentAccount,
      description,
    })

    await account.save()

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating account:", error)
    return NextResponse.json({ success: false, error: "Failed to create account" }, { status: 500 })
  }
}

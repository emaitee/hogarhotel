import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Account } from "@/lib/models/Account"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const account = await Account.findById(params.id).lean()

    if (!account) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: account,
    })
  } catch (error) {
    console.error("Error fetching account:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch account" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const body = await request.json()
    const { code, name, type, category, balance, parentAccount, description, isActive } = body

    // Check if account exists
    const account = await Account.findById(params.id)
    if (!account) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 })
    }

    // Check if new code conflicts with existing account (if code is being changed)
    if (code && code !== account.code) {
      const existingAccount = await Account.findOne({ code, _id: { $ne: params.id } })
      if (existingAccount) {
        return NextResponse.json({ success: false, error: "Account code already exists" }, { status: 400 })
      }
    }

    // Update account
    const updatedAccount = await Account.findByIdAndUpdate(
      params.id,
      {
        ...(code && { code }),
        ...(name && { name }),
        ...(type && { type }),
        ...(category && { category }),
        ...(balance !== undefined && { balance }),
        ...(parentAccount !== undefined && { parentAccount }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true },
    )

    return NextResponse.json({
      success: true,
      data: updatedAccount,
    })
  } catch (error) {
    console.error("Error updating account:", error)
    return NextResponse.json({ success: false, error: "Failed to update account" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // Soft delete by setting isActive to false
    const account = await Account.findByIdAndUpdate(params.id, { isActive: false }, { new: true })

    if (!account) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Account deactivated successfully",
    })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ success: false, error: "Failed to delete account" }, { status: 500 })
  }
}

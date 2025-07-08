import { type NextRequest, NextResponse } from "next/server"
import { Transaction } from "@/lib/models/Transaction"

export async function GET() {
  try {
    const categories = await Transaction.findAllCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching transaction categories:", error)
    return NextResponse.json({ error: "Failed to fetch transaction categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, type, color } = body

    if (!name || !type || !color) {
      return NextResponse.json({ error: "Missing required fields: name, type, color" }, { status: 400 })
    }

    // Validate type
    if (!["income", "expense"].includes(type)) {
      return NextResponse.json({ error: "Invalid type. Must be income or expense" }, { status: 400 })
    }

    const category = await Transaction.createCategory({
      name,
      type,
      color,
      description: body.description,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction category:", error)
    return NextResponse.json({ error: "Failed to create transaction category" }, { status: 500 })
  }
}

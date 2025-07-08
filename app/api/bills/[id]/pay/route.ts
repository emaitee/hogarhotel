import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import type { PaymentData } from "@/lib/models/Bill"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentData: PaymentData = await request.json()
    const { db } = await connectToDatabase()

    // Get the bill
    const bill = await db.collection("bills").findOne({
      _id: new ObjectId(params.id),
    })

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    if (bill.status === "paid") {
      return NextResponse.json({ error: "Bill is already paid" }, { status: 400 })
    }

    // Update bill status to paid
    await db.collection("bills").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status: "paid",
          paymentMethod: paymentData.paymentMethod,
          paidAt: new Date(),
          updatedAt: new Date(),
          notes: paymentData.notes || bill.notes,
        },
      },
    )

    return NextResponse.json({ message: "Payment processed successfully" })
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
  }
}

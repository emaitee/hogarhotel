import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import TaxRecord from "@/lib/models/TaxRecord"

export async function GET() {
  try {
    await connectDB()

    // Update overdue records first
    await TaxRecord.updateMany(
      {
        status: { $in: ["pending", "filed"] },
        dueDate: { $lt: new Date() },
      },
      { status: "overdue" },
    )

    const [stats] = await TaxRecord.aggregate([
      {
        $group: {
          _id: null,
          totalLiability: {
            $sum: {
              $cond: [{ $ne: ["$status", "paid"] }, "$amount", 0],
            },
          },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0],
            },
          },
          totalOverdue: {
            $sum: {
              $cond: [{ $eq: ["$status", "overdue"] }, "$amount", 0],
            },
          },
          totalPaid: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0],
            },
          },
          pendingCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
          overdueCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "overdue"] }, 1, 0],
            },
          },
          filedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "filed"] }, 1, 0],
            },
          },
          paidCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, 1, 0],
            },
          },
        },
      },
    ])

    const defaultStats = {
      totalLiability: 0,
      totalPending: 0,
      totalOverdue: 0,
      totalPaid: 0,
      pendingCount: 0,
      overdueCount: 0,
      filedCount: 0,
      paidCount: 0,
    }

    return NextResponse.json({
      success: true,
      data: stats || defaultStats,
    })
  } catch (error) {
    console.error("Error fetching tax stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tax statistics" }, { status: 500 })
  }
}

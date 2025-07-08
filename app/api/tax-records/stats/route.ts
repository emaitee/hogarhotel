import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import TaxRecord from "@/lib/models/TaxRecord"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year")

    // Build date filter
    const dateFilter: any = {}
    if (year) {
      const startDate = new Date(`${year}-01-01`)
      const endDate = new Date(`${year}-12-31`)
      dateFilter.dueDate = { $gte: startDate, $lte: endDate }
    }

    const [totalStats, statusStats, typeStats, upcomingDue] = await Promise.all([
      // Total tax amounts
      TaxRecord.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalTax: { $sum: "$taxAmount" },
            totalTaxable: { $sum: "$taxableAmount" },
            count: { $sum: 1 },
          },
        },
      ]),

      // By status
      TaxRecord.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$status",
            total: { $sum: "$taxAmount" },
            count: { $sum: 1 },
          },
        },
      ]),

      // By tax type
      TaxRecord.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$taxType",
            total: { $sum: "$taxAmount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),

      // Upcoming due dates (next 30 days)
      TaxRecord.find({
        status: { $in: ["pending", "filed"] },
        dueDate: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
        .sort({ dueDate: 1 })
        .limit(10)
        .lean(),
    ])

    return NextResponse.json({
      total: totalStats[0] || { totalTax: 0, totalTaxable: 0, count: 0 },
      byStatus: statusStats,
      byType: typeStats,
      upcomingDue,
    })
  } catch (error) {
    console.error("Error fetching tax stats:", error)
    return NextResponse.json({ error: "Failed to fetch tax statistics" }, { status: 500 })
  }
}

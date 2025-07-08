import { NextResponse } from "next/server"

const transactionCategories = [
  "Room Revenue",
  "Food & Beverage",
  "Laundry Services",
  "Spa Services",
  "Conference & Events",
  "Parking",
  "Telephone",
  "Internet",
  "Minibar",
  "Room Service",
  "Utilities",
  "Maintenance",
  "Supplies",
  "Marketing",
  "Administrative",
  "Payroll",
  "Insurance",
  "Taxes",
  "Bank Charges",
  "Depreciation",
  "Other Income",
  "Other Expenses",
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: transactionCategories,
  })
}

import type { ObjectId } from "mongodb"

export interface Bill {
  _id?: ObjectId
  billNumber: string
  reservationId: ObjectId
  guestId: ObjectId
  roomId: ObjectId
  items: BillItem[]
  subtotal: number
  tax: number
  total: number
  status: "pending" | "paid" | "cancelled" | "overdue"
  paymentMethod?: "cash" | "card" | "bank_transfer" | "mobile_money"
  paidAt?: Date
  dueDate: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface BillItem {
  _id?: ObjectId
  description: string
  quantity: number
  unitPrice: number
  total: number
  category: "accommodation" | "food" | "beverage" | "service" | "other"
}

export interface CreateBillData {
  reservationId: string
  items: Omit<BillItem, "_id">[]
  dueDate: Date
  notes?: string
}

export interface UpdateBillData {
  items?: Omit<BillItem, "_id">[]
  status?: "pending" | "paid" | "cancelled" | "overdue"
  paymentMethod?: "cash" | "card" | "bank_transfer" | "mobile_money"
  paidAt?: Date
  dueDate?: Date
  notes?: string
}

export interface PaymentData {
  paymentMethod: "cash" | "card" | "bank_transfer" | "mobile_money"
  amount: number
  notes?: string
}

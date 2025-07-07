import type { ObjectId } from "mongodb"

export interface Reservation {
  _id?: ObjectId
  guestId: ObjectId
  roomId: ObjectId
  checkInDate: Date
  checkOutDate: Date
  status: "confirmed" | "checked-in" | "checked-out" | "cancelled"
  totalAmount: number
  specialRequests?: string
  adults: number
  children: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateReservationData {
  guestId: string
  roomId: string
  checkInDate: Date
  checkOutDate: Date
  specialRequests?: string
  adults: number
  children: number
}

export interface UpdateReservationData {
  checkInDate?: Date
  checkOutDate?: Date
  status?: "confirmed" | "checked-in" | "checked-out" | "cancelled"
  specialRequests?: string
  adults?: number
  children?: number
}

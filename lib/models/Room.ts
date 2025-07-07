import type { ObjectId } from "mongodb"

export interface Room {
  _id?: ObjectId
  number: string
  floor: number
  type: "standard" | "deluxe" | "suite"
  status: "available" | "occupied" | "maintenance" | "cleaning"
  price: number
  amenities: string[]
  lastCleaned?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateRoomData {
  number: string
  floor: number
  type: "standard" | "deluxe" | "suite"
  price: number
  amenities: string[]
}

export interface UpdateRoomData {
  number?: string
  floor?: number
  type?: "standard" | "deluxe" | "suite"
  status?: "available" | "occupied" | "maintenance" | "cleaning"
  price?: number
  amenities?: string[]
  lastCleaned?: Date
}

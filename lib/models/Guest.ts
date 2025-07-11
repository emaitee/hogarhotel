import type { ObjectId } from "mongodb"

export interface Guest {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  address: string
  nationality?: string
  dateOfBirth?: Date
  idNumber: string
  emergencyContact?: string
  specialRequests?: string
  totalStays: number
  totalSpent: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateGuestData {
  name: string
  email: string
  phone: string
  address: string
  nationality?: string
  dateOfBirth?: string
  idNumber: string
  emergencyContact?: string
  specialRequests?: string
}

export interface UpdateGuestData {
  name?: string
  email?: string
  phone?: string
  address?: string
  nationality?: string
  dateOfBirth?: string
  idNumber?: string
  emergencyContact?: string
  specialRequests?: string
}

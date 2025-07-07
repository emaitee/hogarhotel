import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const today = new Date()
  return dateObj.toDateString() === today.toDateString()
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "checked-in":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "checked-out":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "available":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "occupied":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "cleaning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "maintenance":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

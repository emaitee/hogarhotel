export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'receptionist' | 'cleaner';
  avatar?: string;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: 'standard' | 'deluxe' | 'suite';
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  price: number;
  amenities: string[];
  lastCleaned?: Date;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  idNumber: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  totalStays: number;
  totalSpent: number;
}

export interface Reservation {
  id: string;
  guestId: string;
  guest: Guest;
  roomId: string;
  room: Room;
  checkInDate: Date;
  checkOutDate: Date;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  specialRequests?: string;
  adults: number;
  children: number;
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  room: Room;
  taskType: 'cleaning' | 'maintenance' | 'inspection';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Bill {
  id: string;
  reservationId: string;
  reservation: Reservation;
  amount: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  createdAt: Date;
  paidAt?: Date;
  items: BillItem[];
}

export interface BillItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'receptionist' | 'cleaner' | 'manager';
  phone: string;
  salary: number;
  hireDate: Date;
  isActive: boolean;
}

export interface KPIData {
  occupancyRate: number;
  todayBookings: number;
  revenue: number;
  availableRooms: number;
  totalRooms: number;
  avgDailyRate: number;
  checkInsToday: number;
  checkOutsToday: number;
}

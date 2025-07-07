import { Room, Guest, Reservation, HousekeepingTask, Bill, Staff, KPIData } from '@/types';

export const dummyRooms: Room[] = [
  {
    id: '1',
    number: '101',
    floor: 1,
    type: 'standard',
    status: 'available',
    price: 48000,
    amenities: ['WiFi', 'TV', 'AC'],
    lastCleaned: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: '2',
    number: '102',
    floor: 1,
    type: 'standard',
    status: 'occupied',
    price: 48000,
    amenities: ['WiFi', 'TV', 'AC'],
    lastCleaned: new Date('2024-01-14T14:00:00Z')
  },
  {
    id: '3',
    number: '103',
    floor: 1,
    type: 'standard',
    status: 'available',
    price: 48000,
    amenities: ['WiFi', 'TV', 'AC'],
    lastCleaned: new Date('2024-01-15T09:00:00Z')
  },
  {
    id: '4',
    number: '201',
    floor: 2,
    type: 'deluxe',
    status: 'cleaning',
    price: 72000,
    amenities: ['WiFi', 'TV', 'AC', 'Minibar', 'Balcony'],
    lastCleaned: new Date('2024-01-15T08:00:00Z')
  },
  {
    id: '5',
    number: '202',
    floor: 2,
    type: 'deluxe',
    status: 'available',
    price: 72000,
    amenities: ['WiFi', 'TV', 'AC', 'Minibar', 'Balcony'],
    lastCleaned: new Date('2024-01-15T11:00:00Z')
  },
  {
    id: '6',
    number: '203',
    floor: 2,
    type: 'deluxe',
    status: 'occupied',
    price: 72000,
    amenities: ['WiFi', 'TV', 'AC', 'Minibar', 'Balcony'],
    lastCleaned: new Date('2024-01-14T16:00:00Z')
  },
  {
    id: '7',
    number: '301',
    floor: 3,
    type: 'suite',
    status: 'available',
    price: 120000,
    amenities: ['WiFi', 'TV', 'AC', 'Minibar', 'Balcony', 'Jacuzzi'],
    lastCleaned: new Date('2024-01-15T12:00:00Z')
  },
  {
    id: '8',
    number: '302',
    floor: 3,
    type: 'suite',
    status: 'maintenance',
    price: 120000,
    amenities: ['WiFi', 'TV', 'AC', 'Minibar', 'Balcony', 'Jacuzzi'],
    lastCleaned: new Date('2024-01-13T16:00:00Z')
  },
  {
    id: '9',
    number: '303',
    floor: 3,
    type: 'suite',
    status: 'available',
    price: 120000,
    amenities: ['WiFi', 'TV', 'AC', 'Minibar', 'Balcony', 'Jacuzzi'],
    lastCleaned: new Date('2024-01-15T13:00:00Z')
  },
  {
    id: '10',
    number: '401',
    floor: 4,
    type: 'suite',
    status: 'occupied',
    price: 140000,
    amenities: ['WiFi', 'TV', 'AC', 'Minibar', 'Balcony', 'Jacuzzi'],
    lastCleaned: new Date('2024-01-14T15:00:00Z')
  }
];

export const dummyGuests: Guest[] = [
  {
    id: '1',
    name: 'Adebayo Ogundimu',
    email: 'adebayo.ogundimu@email.com',
    phone: '+234-803-123-4567',
    address: '15 Victoria Island, Lagos, Nigeria',
    idNumber: 'NIN12345678901',
    totalStays: 5,
    totalSpent: 960000
  },
  {
    id: '2',
    name: 'Fatima Abdullahi',
    email: 'fatima.abdullahi@email.com',
    phone: '+234-806-234-5678',
    address: '42 Garki District, Abuja, Nigeria',
    idNumber: 'NIN98765432109',
    totalStays: 3,
    totalSpent: 720000
  },
  {
    id: '3',
    name: 'Chinedu Okwu',
    email: 'chinedu.okwu@email.com',
    phone: '+234-809-345-6789',
    address: '28 GRA, Port Harcourt, Nigeria',
    idNumber: 'NIN45678912345',
    totalStays: 1,
    totalSpent: 240000
  },
  {
    id: '4',
    name: 'Aisha Mohammed',
    email: 'aisha.mohammed@email.com',
    phone: '+234-812-456-7890',
    address: '67 Nassarawa GRA, Kano, Nigeria',
    idNumber: 'NIN78912345678',
    totalStays: 7,
    totalSpent: 1280000
  },
  {
    id: '5',
    name: 'Emeka Nwosu',
    email: 'emeka.nwosu@email.com',
    phone: '+234-815-567-8901',
    address: '33 New Haven, Enugu, Nigeria',
    idNumber: 'NIN32165498765',
    totalStays: 2,
    totalSpent: 360000
  },
  {
    id: '6',
    name: 'Kemi Adebisi',
    email: 'kemi.adebisi@email.com',
    phone: '+234-818-678-9012',
    address: '19 Bodija Estate, Ibadan, Nigeria',
    idNumber: 'NIN65498732165',
    totalStays: 4,
    totalSpent: 640000
  }
];

export const dummyReservations: Reservation[] = [
  {
    id: '1',
    guestId: '1',
    guest: dummyGuests[0],
    roomId: '2',
    room: dummyRooms[1],
    checkInDate: new Date('2024-01-15T15:00:00Z'),
    checkOutDate: new Date('2024-01-18T11:00:00Z'),
    status: 'checked-in',
    totalAmount: 144000,
    adults: 2,
    children: 0,
    specialRequests: 'Late checkout requested'
  },
  {
    id: '2',
    guestId: '2',
    guest: dummyGuests[1],
    roomId: '1',
    room: dummyRooms[0],
    checkInDate: new Date('2024-01-16T15:00:00Z'),
    checkOutDate: new Date('2024-01-19T11:00:00Z'),
    status: 'confirmed',
    totalAmount: 144000,
    adults: 1,
    children: 1
  },
  {
    id: '3',
    guestId: '3',
    guest: dummyGuests[2],
    roomId: '7',
    room: dummyRooms[6],
    checkInDate: new Date('2024-01-17T15:00:00Z'),
    checkOutDate: new Date('2024-01-20T11:00:00Z'),
    status: 'confirmed',
    totalAmount: 360000,
    adults: 2,
    children: 0
  },
  {
    id: '4',
    guestId: '4',
    guest: dummyGuests[3],
    roomId: '6',
    room: dummyRooms[5],
    checkInDate: new Date('2024-01-14T15:00:00Z'),
    checkOutDate: new Date('2024-01-17T11:00:00Z'),
    status: 'checked-in',
    totalAmount: 216000,
    adults: 2,
    children: 1
  },
  {
    id: '5',
    guestId: '5',
    guest: dummyGuests[4],
    roomId: '10',
    room: dummyRooms[9],
    checkInDate: new Date('2024-01-13T15:00:00Z'),
    checkOutDate: new Date('2024-01-16T11:00:00Z'),
    status: 'checked-in',
    totalAmount: 420000,
    adults: 2,
    children: 0,
    specialRequests: 'Anniversary celebration'
  },
  {
    id: '6',
    guestId: '6',
    guest: dummyGuests[5],
    roomId: '5',
    room: dummyRooms[4],
    checkInDate: new Date('2024-01-18T15:00:00Z'),
    checkOutDate: new Date('2024-01-21T11:00:00Z'),
    status: 'confirmed',
    totalAmount: 216000,
    adults: 1,
    children: 0
  }
];

export const dummyHousekeepingTasks: HousekeepingTask[] = [
  {
    id: '1',
    roomId: '4',
    room: dummyRooms[3],
    taskType: 'cleaning',
    status: 'in-progress',
    assignedTo: 'Blessing Adamu',
    priority: 'high',
    notes: 'Guest checkout cleaning',
    createdAt: new Date('2024-01-15T09:00:00Z')
  },
  {
    id: '2',
    roomId: '8',
    room: dummyRooms[7],
    taskType: 'maintenance',
    status: 'pending',
    priority: 'medium',
    notes: 'AC unit needs repair',
    createdAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: '3',
    roomId: '3',
    room: dummyRooms[2],
    taskType: 'inspection',
    status: 'completed',
    assignedTo: 'Ibrahim Musa',
    priority: 'low',
    notes: 'Routine inspection',
    createdAt: new Date('2024-01-15T08:00:00Z'),
    completedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '4',
    roomId: '5',
    room: dummyRooms[4],
    taskType: 'cleaning',
    status: 'pending',
    priority: 'medium',
    notes: 'Deep cleaning required',
    createdAt: new Date('2024-01-15T11:00:00Z')
  },
  {
    id: '5',
    roomId: '9',
    room: dummyRooms[8],
    taskType: 'cleaning',
    status: 'completed',
    assignedTo: 'Grace Okafor',
    priority: 'high',
    notes: 'Pre-arrival cleaning',
    createdAt: new Date('2024-01-15T07:00:00Z'),
    completedAt: new Date('2024-01-15T09:30:00Z')
  },
  {
    id: '6',
    roomId: '1',
    room: dummyRooms[0],
    taskType: 'maintenance',
    status: 'in-progress',
    assignedTo: 'Ibrahim Musa',
    priority: 'low',
    notes: 'Light bulb replacement',
    createdAt: new Date('2024-01-15T12:00:00Z')
  }
];

export const dummyBills: Bill[] = [
  {
    id: '1',
    reservationId: '1',
    reservation: dummyReservations[0],
    amount: 144000,
    tax: 14400,
    total: 158400,
    status: 'paid',
    createdAt: new Date('2024-01-15T15:00:00Z'),
    paidAt: new Date('2024-01-15T15:30:00Z'),
    items: [
      { id: '1', description: 'Room charges (3 nights)', amount: 144000, quantity: 1 }
    ]
  },
  {
    id: '2',
    reservationId: '2',
    reservation: dummyReservations[1],
    amount: 144000,
    tax: 14400,
    total: 158400,
    status: 'pending',
    createdAt: new Date('2024-01-16T15:00:00Z'),
    items: [
      { id: '2', description: 'Room charges (3 nights)', amount: 144000, quantity: 1 }
    ]
  },
  {
    id: '3',
    reservationId: '3',
    reservation: dummyReservations[2],
    amount: 360000,
    tax: 36000,
    total: 396000,
    status: 'pending',
    createdAt: new Date('2024-01-17T15:00:00Z'),
    items: [
      { id: '3', description: 'Suite charges (3 nights)', amount: 360000, quantity: 1 }
    ]
  },
  {
    id: '4',
    reservationId: '4',
    reservation: dummyReservations[3],
    amount: 216000,
    tax: 21600,
    total: 237600,
    status: 'paid',
    createdAt: new Date('2024-01-14T15:00:00Z'),
    paidAt: new Date('2024-01-14T15:45:00Z'),
    items: [
      { id: '4', description: 'Deluxe room charges (3 nights)', amount: 216000, quantity: 1 }
    ]
  },
  {
    id: '5',
    reservationId: '5',
    reservation: dummyReservations[4],
    amount: 420000,
    tax: 42000,
    total: 462000,
    status: 'paid',
    createdAt: new Date('2024-01-13T15:00:00Z'),
    paidAt: new Date('2024-01-13T15:20:00Z'),
    items: [
      { id: '5', description: 'Presidential suite charges (3 nights)', amount: 420000, quantity: 1 }
    ]
  }
];

export const dummyStaff: Staff[] = [
  {
    id: '1',
    name: 'Adunni Olatunji',
    email: 'adunni.olatunji@hotel.com',
    role: 'admin',
    phone: '+234-803-111-2222',
    salary: 2600000,
    hireDate: new Date('2022-03-15'),
    isActive: true
  },
  {
    id: '2',
    name: 'Usman Garba',
    email: 'usman.garba@hotel.com',
    role: 'receptionist',
    phone: '+234-806-333-4444',
    salary: 1400000,
    hireDate: new Date('2023-06-20'),
    isActive: true
  },
  {
    id: '3',
    name: 'Blessing Adamu',
    email: 'blessing.adamu@hotel.com',
    role: 'cleaner',
    phone: '+234-809-555-6666',
    salary: 1120000,
    hireDate: new Date('2023-01-10'),
    isActive: true
  },
  {
    id: '4',
    name: 'Olumide Fashola',
    email: 'olumide.fashola@hotel.com',
    role: 'manager',
    phone: '+234-812-777-8888',
    salary: 2200000,
    hireDate: new Date('2021-11-05'),
    isActive: true
  },
  {
    id: '5',
    name: 'Ibrahim Musa',
    email: 'ibrahim.musa@hotel.com',
    role: 'cleaner',
    phone: '+234-815-999-0000',
    salary: 1120000,
    hireDate: new Date('2023-04-12'),
    isActive: true
  },
  {
    id: '6',
    name: 'Grace Okafor',
    email: 'grace.okafor@hotel.com',
    role: 'cleaner',
    phone: '+234-818-111-2222',
    salary: 1120000,
    hireDate: new Date('2023-08-01'),
    isActive: true
  },
  {
    id: '7',
    name: 'Hauwa Aliyu',
    email: 'hauwa.aliyu@hotel.com',
    role: 'receptionist',
    phone: '+234-821-333-4444',
    salary: 1400000,
    hireDate: new Date('2023-02-28'),
    isActive: true
  },
  {
    id: '8',
    name: 'Tunde Bakare',
    email: 'tunde.bakare@hotel.com',
    role: 'manager',
    phone: '+234-824-555-6666',
    salary: 2200000,
    hireDate: new Date('2022-09-15'),
    isActive: false
  }
];

export const dummyKPIData: KPIData = {
  occupancyRate: 75,
  todayBookings: 8,
  revenue: 6168000,
  availableRooms: 12,
  totalRooms: 48,
  avgDailyRate: 74000,
  checkInsToday: 3,
  checkOutsToday: 2
};

export const weeklyBookingData = [
  { day: 'Mon', bookings: 12 },
  { day: 'Tue', bookings: 8 },
  { day: 'Wed', bookings: 15 },
  { day: 'Thu', bookings: 10 },
  { day: 'Fri', bookings: 18 },
  { day: 'Sat', bookings: 22 },
  { day: 'Sun', bookings: 16 }
];

export const monthlyRevenueData = [
  { month: 'Jan', revenue: 18000000 },
  { month: 'Feb', revenue: 20800000 },
  { month: 'Mar', revenue: 19200000 },
  { month: 'Apr', revenue: 24400000 },
  { month: 'May', revenue: 22000000 },
  { month: 'Jun', revenue: 26800000 }
];

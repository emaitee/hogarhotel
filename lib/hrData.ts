import { Employee, Department, Position, Attendance, LeaveRequest, PayrollPeriod, PayrollEntry, PerformanceReview } from '@/types/hr';

export const departments: Department[] = [
  {
    id: '1',
    name: 'Front Office',
    description: 'Guest services, reception, and customer relations',
    managerId: '4',
    employeeCount: 8,
    budget: 12000000,
    isActive: true
  },
  {
    id: '2',
    name: 'Housekeeping',
    description: 'Room cleaning, maintenance, and facility management',
    managerId: '2',
    employeeCount: 12,
    budget: 8000000,
    isActive: true
  },
  {
    id: '3',
    name: 'Food & Beverage',
    description: 'Restaurant, bar, and catering services',
    managerId: '3',
    employeeCount: 15,
    budget: 10000000,
    isActive: true
  },
  {
    id: '4',
    name: 'Administration',
    description: 'HR, accounting, and general administration',
    managerId: '1',
    employeeCount: 6,
    budget: 15000000,
    isActive: true
  },
  {
    id: '5',
    name: 'Security',
    description: 'Hotel security and safety management',
    employeeCount: 8,
    budget: 6000000,
    isActive: true
  }
];

export const positions: Position[] = [
  {
    id: '1',
    title: 'General Manager',
    departmentId: '4',
    department: departments[3],
    description: 'Overall hotel operations management',
    requirements: ['Bachelor\'s degree', '5+ years management experience', 'Hotel industry experience'],
    salaryRange: { min: 3000000, max: 5000000 },
    isActive: true
  },
  {
    id: '2',
    title: 'Front Desk Manager',
    departmentId: '1',
    department: departments[0],
    description: 'Manage front office operations and guest services',
    requirements: ['Diploma/Degree', '3+ years experience', 'Customer service skills'],
    salaryRange: { min: 1800000, max: 2500000 },
    isActive: true
  },
  {
    id: '3',
    title: 'Receptionist',
    departmentId: '1',
    department: departments[0],
    description: 'Guest check-in/out, reservations, and customer service',
    requirements: ['High school diploma', 'Customer service experience', 'Computer skills'],
    salaryRange: { min: 800000, max: 1200000 },
    isActive: true
  },
  {
    id: '4',
    title: 'Housekeeping Supervisor',
    departmentId: '2',
    department: departments[1],
    description: 'Supervise cleaning staff and maintain room standards',
    requirements: ['High school diploma', '2+ years experience', 'Leadership skills'],
    salaryRange: { min: 1000000, max: 1500000 },
    isActive: true
  },
  {
    id: '5',
    title: 'Room Attendant',
    departmentId: '2',
    department: departments[1],
    description: 'Clean and maintain guest rooms and public areas',
    requirements: ['Basic education', 'Physical fitness', 'Attention to detail'],
    salaryRange: { min: 600000, max: 900000 },
    isActive: true
  }
];

export const employees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    personalInfo: {
      firstName: 'Adunni',
      lastName: 'Olatunji',
      email: 'adunni.olatunji@hotel.com',
      phone: '+234-803-111-2222',
      address: '15 Lekki Phase 1, Lagos, Nigeria',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'female',
      maritalStatus: 'married',
      emergencyContact: {
        name: 'Tunde Olatunji',
        relationship: 'Spouse',
        phone: '+234-803-111-2223'
      }
    },
    employment: {
      hireDate: new Date('2022-03-15'),
      department: 'Administration',
      position: 'General Manager',
      employmentType: 'full-time',
      status: 'active',
      workLocation: 'Head Office'
    },
    compensation: {
      baseSalary: 4200000,
      currency: 'NGN',
      payFrequency: 'monthly',
      allowances: [
        { id: '1', type: 'housing', name: 'Housing Allowance', amount: 1000000, isFixed: true, isTaxable: false },
        { id: '2', type: 'transport', name: 'Transport Allowance', amount: 300000, isFixed: true, isTaxable: false }
      ],
      deductions: [
        { id: '1', type: 'tax', name: 'PAYE Tax', amount: 0, isFixed: false, isPercentage: true },
        { id: '2', type: 'pension', name: 'Pension Contribution', amount: 8, isFixed: false, isPercentage: true }
      ],
      bankDetails: {
        accountName: 'Adunni Olatunji',
        accountNumber: '0123456789',
        bankName: 'GTBank',
        bankCode: '058'
      }
    },
    documents: [],
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    employeeId: 'EMP002',
    personalInfo: {
      firstName: 'Usman',
      lastName: 'Garba',
      email: 'usman.garba@hotel.com',
      phone: '+234-806-333-4444',
      address: '42 Garki District, Abuja, Nigeria',
      dateOfBirth: new Date('1990-06-20'),
      gender: 'male',
      maritalStatus: 'single',
      emergencyContact: {
        name: 'Fatima Garba',
        relationship: 'Sister',
        phone: '+234-806-333-4445'
      }
    },
    employment: {
      hireDate: new Date('2023-06-20'),
      department: 'Front Office',
      position: 'Front Desk Manager',
      employmentType: 'full-time',
      status: 'active',
      reportingManager: '1',
      workLocation: 'Front Desk'
    },
    compensation: {
      baseSalary: 2200000,
      currency: 'NGN',
      payFrequency: 'monthly',
      allowances: [
        { id: '3', type: 'transport', name: 'Transport Allowance', amount: 200000, isFixed: true, isTaxable: false },
        { id: '4', type: 'meal', name: 'Meal Allowance', amount: 100000, isFixed: true, isTaxable: false }
      ],
      deductions: [
        { id: '3', type: 'tax', name: 'PAYE Tax', amount: 0, isFixed: false, isPercentage: true },
        { id: '4', type: 'pension', name: 'Pension Contribution', amount: 8, isFixed: false, isPercentage: true }
      ],
      bankDetails: {
        accountName: 'Usman Garba',
        accountNumber: '0987654321',
        bankName: 'Access Bank',
        bankCode: '044'
      }
    },
    documents: [],
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    employeeId: 'EMP003',
    personalInfo: {
      firstName: 'Blessing',
      lastName: 'Adamu',
      email: 'blessing.adamu@hotel.com',
      phone: '+234-809-555-6666',
      address: '28 GRA, Port Harcourt, Nigeria',
      dateOfBirth: new Date('1992-01-10'),
      gender: 'female',
      maritalStatus: 'single',
      emergencyContact: {
        name: 'Mary Adamu',
        relationship: 'Mother',
        phone: '+234-809-555-6667'
      }
    },
    employment: {
      hireDate: new Date('2023-01-10'),
      department: 'Housekeeping',
      position: 'Housekeeping Supervisor',
      employmentType: 'full-time',
      status: 'active',
      reportingManager: '1',
      workLocation: 'Hotel Floors'
    },
    compensation: {
      baseSalary: 1300000,
      currency: 'NGN',
      payFrequency: 'monthly',
      allowances: [
        { id: '5', type: 'transport', name: 'Transport Allowance', amount: 150000, isFixed: true, isTaxable: false }
      ],
      deductions: [
        { id: '5', type: 'tax', name: 'PAYE Tax', amount: 0, isFixed: false, isPercentage: true },
        { id: '6', type: 'pension', name: 'Pension Contribution', amount: 8, isFixed: false, isPercentage: true }
      ],
      bankDetails: {
        accountName: 'Blessing Adamu',
        accountNumber: '1122334455',
        bankName: 'First Bank',
        bankCode: '011'
      }
    },
    documents: [],
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2024-01-15')
  }
];

export const attendanceRecords: Attendance[] = [
  {
    id: '1',
    employeeId: '1',
    date: new Date('2024-01-15'),
    clockIn: new Date('2024-01-15T08:00:00Z'),
    clockOut: new Date('2024-01-15T17:00:00Z'),
    totalHours: 9,
    overtimeHours: 1,
    status: 'present'
  },
  {
    id: '2',
    employeeId: '2',
    date: new Date('2024-01-15'),
    clockIn: new Date('2024-01-15T08:30:00Z'),
    clockOut: new Date('2024-01-15T17:30:00Z'),
    totalHours: 9,
    overtimeHours: 1,
    status: 'late'
  },
  {
    id: '3',
    employeeId: '3',
    date: new Date('2024-01-15'),
    clockIn: new Date('2024-01-15T07:00:00Z'),
    clockOut: new Date('2024-01-15T16:00:00Z'),
    totalHours: 9,
    overtimeHours: 1,
    status: 'present'
  }
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '2',
    employee: employees[1],
    leaveType: 'annual',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-05'),
    totalDays: 5,
    reason: 'Family vacation',
    status: 'pending',
    appliedAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: '2',
    employeeId: '3',
    employee: employees[2],
    leaveType: 'sick',
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-12'),
    totalDays: 3,
    reason: 'Medical treatment',
    status: 'approved',
    appliedAt: new Date('2024-01-09T14:00:00Z'),
    reviewedBy: '1',
    reviewedAt: new Date('2024-01-09T16:00:00Z')
  }
];

export const payrollPeriods: PayrollPeriod[] = [
  {
    id: '1',
    name: 'January 2024',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    payDate: new Date('2024-02-05'),
    status: 'processing',
    totalEmployees: 45,
    totalGrossPay: 85000000,
    totalDeductions: 12750000,
    totalNetPay: 72250000,
    createdBy: '1',
    createdAt: new Date('2024-01-25T10:00:00Z')
  },
  {
    id: '2',
    name: 'December 2023',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2023-12-31'),
    payDate: new Date('2024-01-05'),
    status: 'paid',
    totalEmployees: 43,
    totalGrossPay: 82000000,
    totalDeductions: 12300000,
    totalNetPay: 69700000,
    createdBy: '1',
    createdAt: new Date('2023-12-25T10:00:00Z'),
    approvedBy: '1',
    approvedAt: new Date('2024-01-03T14:00:00Z')
  }
];

export const payrollEntries: PayrollEntry[] = [
  {
    id: '1',
    payrollPeriodId: '1',
    employeeId: '1',
    employee: employees[0],
    workingDays: 22,
    actualDays: 22,
    baseSalary: 4200000,
    allowances: [
      { id: '1', type: 'housing', name: 'Housing Allowance', amount: 1000000 },
      { id: '2', type: 'transport', name: 'Transport Allowance', amount: 300000 }
    ],
    deductions: [
      { id: '1', type: 'tax', name: 'PAYE Tax', amount: 550000 },
      { id: '2', type: 'pension', name: 'Pension Contribution', amount: 336000 }
    ],
    grossPay: 5500000,
    totalDeductions: 886000,
    netPay: 4614000,
    status: 'approved',
    paymentMethod: 'bank_transfer'
  },
  {
    id: '2',
    payrollPeriodId: '1',
    employeeId: '2',
    employee: employees[1],
    workingDays: 22,
    actualDays: 20,
    baseSalary: 2200000,
    allowances: [
      { id: '3', type: 'transport', name: 'Transport Allowance', amount: 200000 },
      { id: '4', type: 'meal', name: 'Meal Allowance', amount: 100000 }
    ],
    deductions: [
      { id: '3', type: 'tax', name: 'PAYE Tax', amount: 250000 },
      { id: '4', type: 'pension', name: 'Pension Contribution', amount: 176000 }
    ],
    grossPay: 2500000,
    totalDeductions: 426000,
    netPay: 2074000,
    status: 'draft',
    paymentMethod: 'bank_transfer'
  }
];

export const performanceReviews: PerformanceReview[] = [
  {
    id: '1',
    employeeId: '2',
    employee: employees[1],
    reviewPeriod: {
      startDate: new Date('2023-07-01'),
      endDate: new Date('2023-12-31')
    },
    reviewerId: '1',
    reviewer: employees[0],
    goals: [
      {
        id: '1',
        description: 'Improve guest satisfaction scores',
        targetDate: new Date('2023-12-31'),
        weight: 40,
        achievement: 85,
        rating: 4,
        comments: 'Exceeded expectations with 92% satisfaction rate'
      },
      {
        id: '2',
        description: 'Complete customer service training',
        targetDate: new Date('2023-10-31'),
        weight: 30,
        achievement: 100,
        rating: 5,
        comments: 'Completed training ahead of schedule'
      }
    ],
    overallRating: 4.2,
    strengths: ['Excellent customer service', 'Strong leadership skills', 'Reliable and punctual'],
    areasForImprovement: ['Time management', 'Delegation skills'],
    developmentPlan: 'Enroll in management development program',
    comments: 'Strong performer with leadership potential',
    status: 'approved',
    createdAt: new Date('2024-01-05T10:00:00Z'),
    submittedAt: new Date('2024-01-08T14:00:00Z'),
    reviewedAt: new Date('2024-01-10T16:00:00Z')
  }
];

export const hrMetrics = {
  totalEmployees: 45,
  activeEmployees: 43,
  newHires: 8,
  turnoverRate: 12.5,
  averageSalary: 1888888,
  totalPayroll: 85000000,
  pendingLeaves: 3,
  attendanceRate: 94.2
};

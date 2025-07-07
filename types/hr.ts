export interface Employee {
  id: string;
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  employment: {
    hireDate: Date;
    department: string;
    position: string;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
    status: 'active' | 'inactive' | 'terminated' | 'on-leave';
    reportingManager?: string;
    workLocation: string;
  };
  compensation: {
    baseSalary: number;
    currency: string;
    payFrequency: 'monthly' | 'bi-weekly' | 'weekly';
    allowances: Allowance[];
    deductions: Deduction[];
    bankDetails: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      bankCode: string;
    };
  };
  documents: EmployeeDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Allowance {
  id: string;
  type: 'housing' | 'transport' | 'meal' | 'medical' | 'bonus' | 'overtime' | 'other';
  name: string;
  amount: number;
  isFixed: boolean;
  isTaxable: boolean;
}

export interface Deduction {
  id: string;
  type: 'tax' | 'pension' | 'insurance' | 'loan' | 'advance' | 'other';
  name: string;
  amount: number;
  isFixed: boolean;
  isPercentage: boolean;
}

export interface EmployeeDocument {
  id: string;
  type: 'resume' | 'contract' | 'id_copy' | 'certificate' | 'other';
  name: string;
  url: string;
  uploadedAt: Date;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  breakStart?: Date;
  breakEnd?: Date;
  totalHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'on-leave';
  notes?: string;
  approvedBy?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee: Employee;
  leaveType: 'annual' | 'sick' | 'maternity' | 'paternity' | 'emergency' | 'unpaid';
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  comments?: string;
}

export interface PayrollPeriod {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  payDate: Date;
  status: 'draft' | 'processing' | 'approved' | 'paid';
  totalEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  createdBy: string;
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface PayrollEntry {
  id: string;
  payrollPeriodId: string;
  employeeId: string;
  employee: Employee;
  workingDays: number;
  actualDays: number;
  baseSalary: number;
  allowances: PayrollAllowance[];
  deductions: PayrollDeduction[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'approved' | 'paid';
  paymentMethod: 'bank_transfer' | 'cash' | 'cheque';
  paidAt?: Date;
}

export interface PayrollAllowance {
  id: string;
  type: string;
  name: string;
  amount: number;
}

export interface PayrollDeduction {
  id: string;
  type: string;
  name: string;
  amount: number;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employee: Employee;
  reviewPeriod: {
    startDate: Date;
    endDate: Date;
  };
  reviewerId: string;
  reviewer: Employee;
  goals: PerformanceGoal[];
  overallRating: number;
  strengths: string[];
  areasForImprovement: string[];
  developmentPlan: string;
  comments: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  createdAt: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
}

export interface PerformanceGoal {
  id: string;
  description: string;
  targetDate: Date;
  weight: number;
  achievement: number;
  rating: number;
  comments: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string;
  manager?: Employee;
  employeeCount: number;
  budget: number;
  isActive: boolean;
}

export interface Position {
  id: string;
  title: string;
  departmentId: string;
  department: Department;
  description: string;
  requirements: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  isActive: boolean;
}

import mongoose, { Document, Schema } from 'mongoose';

interface Allowance {
  id: string;
  name: string;
  amount: number;
}

interface Deduction {
  id: string;
  name: string;
  amount: number;
  isPercentage: boolean;
}

interface BankDetails {
  bankName: string;
  accountNumber: string;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
}

interface Employment {
  department: string;
  position: string;
  hireDate: Date;
  status: 'active' | 'inactive' | 'terminated' | 'on-leave';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
}

interface Compensation {
  baseSalary: number;
  payFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'annually';
  bankDetails: BankDetails;
  allowances: Allowance[];
  deductions: Deduction[];
}

export interface IEmployee extends Document {
  employeeId: string;
  personalInfo: PersonalInfo;
  employment: Employment;
  compensation: Compensation;
}

const EmployeeSchema: Schema = new Schema({
  employeeId: { type: String, required: true, unique: true },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    maritalStatus: { type: String, required: true, enum: ['single', 'married', 'divorced', 'widowed'] },
  },
  employment: {
    department: { type: String, required: true },
    position: { type: String, required: true },
    hireDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ['active', 'inactive', 'terminated', 'on-leave'] },
    employmentType: { type: String, required: true, enum: ['full-time', 'part-time', 'contract', 'intern'] },
  },
  compensation: {
    baseSalary: { type: Number, required: true },
    payFrequency: { type: String, required: true, enum: ['weekly', 'bi-weekly', 'monthly', 'annually'] },
    bankDetails: {
      bankName: { type: String, required: true },
      accountNumber: { type: String, required: true },
    },
    allowances: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    deductions: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        isPercentage: { type: Boolean, required: true },
      },
    ],
  },
});

const Employee = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
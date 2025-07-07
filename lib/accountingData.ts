import { 
  Account, 
  Transaction, 
  TransactionCategory, 
  JournalEntry, 
  Budget, 
  TaxRecord, 
  Expense, 
  Invoice, 
  PaymentRecord 
} from '@/types/accounting';

export const chartOfAccounts: Account[] = [
  // Assets
  { id: '1', code: '1000', name: 'Cash in Hand', type: 'asset', category: 'Current Assets', balance: 2500000, isActive: true },
  { id: '2', code: '1001', name: 'Bank Account - GTBank', type: 'asset', category: 'Current Assets', balance: 15800000, isActive: true },
  { id: '3', code: '1002', name: 'Bank Account - Access Bank', type: 'asset', category: 'Current Assets', balance: 8200000, isActive: true },
  { id: '4', code: '1100', name: 'Accounts Receivable', type: 'asset', category: 'Current Assets', balance: 3200000, isActive: true },
  { id: '5', code: '1200', name: 'Inventory - Food & Beverage', type: 'asset', category: 'Current Assets', balance: 1800000, isActive: true },
  { id: '6', code: '1300', name: 'Prepaid Expenses', type: 'asset', category: 'Current Assets', balance: 950000, isActive: true },
  { id: '7', code: '1500', name: 'Hotel Building', type: 'asset', category: 'Fixed Assets', balance: 250000000, isActive: true },
  { id: '8', code: '1501', name: 'Furniture & Equipment', type: 'asset', category: 'Fixed Assets', balance: 45000000, isActive: true },
  { id: '9', code: '1502', name: 'Vehicles', type: 'asset', category: 'Fixed Assets', balance: 12000000, isActive: true },

  // Liabilities
  { id: '10', code: '2000', name: 'Accounts Payable', type: 'liability', category: 'Current Liabilities', balance: 2800000, isActive: true },
  { id: '11', code: '2001', name: 'Accrued Expenses', type: 'liability', category: 'Current Liabilities', balance: 1200000, isActive: true },
  { id: '12', code: '2002', name: 'VAT Payable', type: 'liability', category: 'Current Liabilities', balance: 850000, isActive: true },
  { id: '13', code: '2003', name: 'Withholding Tax Payable', type: 'liability', category: 'Current Liabilities', balance: 420000, isActive: true },
  { id: '14', code: '2100', name: 'Bank Loan - First Bank', type: 'liability', category: 'Long-term Liabilities', balance: 35000000, isActive: true },
  { id: '15', code: '2101', name: 'Equipment Loan', type: 'liability', category: 'Long-term Liabilities', balance: 8500000, isActive: true },

  // Equity
  { id: '16', code: '3000', name: 'Owner\'s Capital', type: 'equity', category: 'Equity', balance: 180000000, isActive: true },
  { id: '17', code: '3001', name: 'Retained Earnings', type: 'equity', category: 'Equity', balance: 25000000, isActive: true },

  // Revenue
  { id: '18', code: '4000', name: 'Room Revenue', type: 'revenue', category: 'Operating Revenue', balance: 0, isActive: true },
  { id: '19', code: '4001', name: 'Food & Beverage Revenue', type: 'revenue', category: 'Operating Revenue', balance: 0, isActive: true },
  { id: '20', code: '4002', name: 'Conference Room Revenue', type: 'revenue', category: 'Operating Revenue', balance: 0, isActive: true },
  { id: '21', code: '4003', name: 'Laundry Revenue', type: 'revenue', category: 'Operating Revenue', balance: 0, isActive: true },
  { id: '22', code: '4100', name: 'Other Income', type: 'revenue', category: 'Other Revenue', balance: 0, isActive: true },

  // Expenses
  { id: '23', code: '5000', name: 'Staff Salaries', type: 'expense', category: 'Operating Expenses', balance: 0, isActive: true },
  { id: '24', code: '5001', name: 'Utilities', type: 'expense', category: 'Operating Expenses', balance: 0, isActive: true },
  { id: '25', code: '5002', name: 'Housekeeping Supplies', type: 'expense', category: 'Operating Expenses', balance: 0, isActive: true },
  { id: '26', code: '5003', name: 'Food & Beverage Costs', type: 'expense', category: 'Operating Expenses', balance: 0, isActive: true },
  { id: '27', code: '5004', name: 'Marketing & Advertising', type: 'expense', category: 'Operating Expenses', balance: 0, isActive: true },
  { id: '28', code: '5005', name: 'Maintenance & Repairs', type: 'expense', category: 'Operating Expenses', balance: 0, isActive: true },
  { id: '29', code: '5100', name: 'Depreciation Expense', type: 'expense', category: 'Non-Operating Expenses', balance: 0, isActive: true },
  { id: '30', code: '5101', name: 'Interest Expense', type: 'expense', category: 'Non-Operating Expenses', balance: 0, isActive: true },
];

export const transactionCategories: TransactionCategory[] = [
  { id: '1', name: 'Room Revenue', type: 'income', color: '#10B981', description: 'Revenue from room bookings' },
  { id: '2', name: 'Food & Beverage', type: 'income', color: '#3B82F6', description: 'Restaurant and bar revenue' },
  { id: '3', name: 'Conference & Events', type: 'income', color: '#8B5CF6', description: 'Event hosting revenue' },
  { id: '4', name: 'Other Services', type: 'income', color: '#06B6D4', description: 'Laundry, spa, and other services' },
  
  { id: '5', name: 'Staff Costs', type: 'expense', color: '#EF4444', description: 'Salaries, benefits, and training' },
  { id: '6', name: 'Utilities', type: 'expense', color: '#F59E0B', description: 'Electricity, water, internet, phone' },
  { id: '7', name: 'Supplies', type: 'expense', color: '#84CC16', description: 'Housekeeping and operational supplies' },
  { id: '8', name: 'Maintenance', type: 'expense', color: '#6366F1', description: 'Repairs and maintenance costs' },
  { id: '9', name: 'Marketing', type: 'expense', color: '#EC4899', description: 'Advertising and promotional expenses' },
  { id: '10', name: 'Administrative', type: 'expense', color: '#64748B', description: 'Office supplies, legal, accounting' },
];

export const dummyTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date('2024-01-15'),
    description: 'Room booking payment - Adebayo Ogundimu',
    reference: 'RES-001',
    type: 'credit',
    amount: 158400,
    accountId: '18',
    account: chartOfAccounts.find(a => a.id === '18')!,
    categoryId: '1',
    category: transactionCategories.find(c => c.id === '1')!,
    createdBy: 'system',
    createdAt: new Date('2024-01-15T15:30:00Z')
  },
  {
    id: '2',
    date: new Date('2024-01-15'),
    description: 'Staff salary payment - January',
    reference: 'SAL-001',
    type: 'debit',
    amount: 1200000,
    accountId: '23',
    account: chartOfAccounts.find(a => a.id === '23')!,
    categoryId: '5',
    category: transactionCategories.find(c => c.id === '5')!,
    createdBy: 'admin',
    createdAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: '3',
    date: new Date('2024-01-14'),
    description: 'Electricity bill payment',
    reference: 'UTIL-001',
    type: 'debit',
    amount: 450000,
    accountId: '24',
    account: chartOfAccounts.find(a => a.id === '24')!,
    categoryId: '6',
    category: transactionCategories.find(c => c.id === '6')!,
    createdBy: 'admin',
    createdAt: new Date('2024-01-14T14:20:00Z')
  },
  {
    id: '4',
    date: new Date('2024-01-13'),
    description: 'Restaurant revenue',
    reference: 'FB-001',
    type: 'credit',
    amount: 85000,
    accountId: '19',
    account: chartOfAccounts.find(a => a.id === '19')!,
    categoryId: '2',
    category: transactionCategories.find(c => c.id === '2')!,
    createdBy: 'system',
    createdAt: new Date('2024-01-13T20:15:00Z')
  },
  {
    id: '5',
    date: new Date('2024-01-12'),
    description: 'Housekeeping supplies purchase',
    reference: 'SUP-001',
    type: 'debit',
    amount: 125000,
    accountId: '25',
    account: chartOfAccounts.find(a => a.id === '25')!,
    categoryId: '7',
    category: transactionCategories.find(c => c.id === '7')!,
    createdBy: 'admin',
    createdAt: new Date('2024-01-12T11:30:00Z')
  }
];

export const dummyExpenses: Expense[] = [
  {
    id: '1',
    date: new Date('2024-01-15'),
    vendor: 'PHCN (Electricity Company)',
    description: 'Monthly electricity bill',
    categoryId: '6',
    category: transactionCategories.find(c => c.id === '6')!,
    amount: 450000,
    paymentMethod: 'bank_transfer',
    reference: 'ELEC-2024-001',
    status: 'paid',
    paidAt: new Date('2024-01-15T14:20:00Z'),
    createdBy: 'admin',
    createdAt: new Date('2024-01-15T09:00:00Z')
  },
  {
    id: '2',
    date: new Date('2024-01-14'),
    vendor: 'CleanPro Supplies Ltd',
    description: 'Housekeeping supplies - towels, detergents',
    categoryId: '7',
    category: transactionCategories.find(c => c.id === '7')!,
    amount: 125000,
    paymentMethod: 'cash',
    reference: 'SUP-2024-001',
    status: 'approved',
    approvedBy: 'manager',
    approvedAt: new Date('2024-01-14T10:30:00Z'),
    createdBy: 'staff',
    createdAt: new Date('2024-01-14T08:15:00Z')
  },
  {
    id: '3',
    date: new Date('2024-01-13'),
    vendor: 'TechFix Solutions',
    description: 'AC repair - Room 302',
    categoryId: '8',
    category: transactionCategories.find(c => c.id === '8')!,
    amount: 75000,
    paymentMethod: 'bank_transfer',
    reference: 'MAINT-2024-001',
    status: 'pending',
    createdBy: 'maintenance',
    createdAt: new Date('2024-01-13T16:45:00Z')
  },
  {
    id: '4',
    date: new Date('2024-01-12'),
    vendor: 'Lagos Water Corporation',
    description: 'Monthly water bill',
    categoryId: '6',
    category: transactionCategories.find(c => c.id === '6')!,
    amount: 85000,
    paymentMethod: 'cheque',
    reference: 'WATER-2024-001',
    status: 'paid',
    paidAt: new Date('2024-01-12T11:00:00Z'),
    createdBy: 'admin',
    createdAt: new Date('2024-01-12T09:30:00Z')
  }
];

export const dummyInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customerId: '1',
    customerName: 'Adebayo Ogundimu',
    date: new Date('2024-01-15'),
    dueDate: new Date('2024-01-15'),
    items: [
      { id: '1', description: 'Room 102 - 3 nights', quantity: 3, rate: 48000, amount: 144000 },
      { id: '2', description: 'VAT (10%)', quantity: 1, rate: 14400, amount: 14400 }
    ],
    subtotal: 144000,
    taxAmount: 14400,
    total: 158400,
    status: 'paid',
    paidAmount: 158400,
    balance: 0,
    paymentTerms: 'Payment on arrival',
    paidAt: new Date('2024-01-15T15:30:00Z'),
    createdAt: new Date('2024-01-15T15:00:00Z')
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customerId: '2',
    customerName: 'Fatima Abdullahi',
    date: new Date('2024-01-16'),
    dueDate: new Date('2024-01-19'),
    items: [
      { id: '3', description: 'Room 101 - 3 nights', quantity: 3, rate: 48000, amount: 144000 },
      { id: '4', description: 'VAT (10%)', quantity: 1, rate: 14400, amount: 14400 }
    ],
    subtotal: 144000,
    taxAmount: 14400,
    total: 158400,
    status: 'sent',
    paidAmount: 0,
    balance: 158400,
    paymentTerms: 'Payment on checkout',
    createdAt: new Date('2024-01-16T15:00:00Z')
  }
];

export const dummyBudget: Budget = {
  id: '1',
  name: '2024 Annual Budget',
  year: 2024,
  categories: [
    {
      id: '1',
      categoryId: '1',
      category: transactionCategories.find(c => c.id === '1')!,
      budgetedAmount: 120000000,
      actualAmount: 15840000,
      variance: -104160000,
      variancePercentage: -86.8
    },
    {
      id: '2',
      categoryId: '5',
      category: transactionCategories.find(c => c.id === '5')!,
      budgetedAmount: 18000000,
      actualAmount: 1200000,
      variance: 16800000,
      variancePercentage: 93.3
    },
    {
      id: '3',
      categoryId: '6',
      category: transactionCategories.find(c => c.id === '6')!,
      budgetedAmount: 8000000,
      actualAmount: 535000,
      variance: 7465000,
      variancePercentage: 93.3
    }
  ],
  totalBudget: 146000000,
  totalActual: 17575000,
  variance: -128425000,
  status: 'active',
  createdAt: new Date('2024-01-01')
};

export const dummyTaxRecords: TaxRecord[] = [
  {
    id: '1',
    type: 'vat',
    period: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31')
    },
    taxableAmount: 1584000,
    taxRate: 7.5,
    taxAmount: 118800,
    status: 'pending',
    dueDate: new Date('2024-02-21')
  },
  {
    id: '2',
    type: 'withholding_tax',
    period: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31')
    },
    taxableAmount: 850000,
    taxRate: 5,
    taxAmount: 42500,
    status: 'filed',
    dueDate: new Date('2024-02-15'),
    filedAt: new Date('2024-02-10')
  }
];

export const monthlyFinancialSummary = {
  revenue: {
    current: 2435000,
    previous: 2180000,
    growth: 11.7
  },
  expenses: {
    current: 1875000,
    previous: 1920000,
    growth: -2.3
  },
  profit: {
    current: 560000,
    previous: 260000,
    growth: 115.4
  },
  cashFlow: {
    current: 8450000,
    previous: 7890000,
    growth: 7.1
  }
};

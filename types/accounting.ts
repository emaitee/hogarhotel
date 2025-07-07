export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  category: string;
  balance: number;
  isActive: boolean;
  parentId?: string;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  reference: string;
  type: 'debit' | 'credit';
  amount: number;
  accountId: string;
  account: Account;
  categoryId: string;
  category: TransactionCategory;
  attachments?: string[];
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export interface TransactionCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  description?: string;
}

export interface JournalEntry {
  id: string;
  date: Date;
  reference: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'posted' | 'reversed';
  entries: JournalEntryLine[];
  createdBy: string;
  createdAt: Date;
  postedAt?: Date;
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  account: Account;
  debit: number;
  credit: number;
  description: string;
}

export interface FinancialReport {
  id: string;
  name: string;
  type: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'trial_balance';
  period: {
    startDate: Date;
    endDate: Date;
  };
  data: any;
  generatedAt: Date;
}

export interface Budget {
  id: string;
  name: string;
  year: number;
  month?: number;
  categories: BudgetCategory[];
  totalBudget: number;
  totalActual: number;
  variance: number;
  status: 'draft' | 'approved' | 'active';
  createdAt: Date;
}

export interface BudgetCategory {
  id: string;
  categoryId: string;
  category: TransactionCategory;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
}

export interface TaxRecord {
  id: string;
  type: 'vat' | 'income_tax' | 'withholding_tax';
  period: {
    startDate: Date;
    endDate: Date;
  };
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  status: 'pending' | 'filed' | 'paid';
  dueDate: Date;
  filedAt?: Date;
  paidAt?: Date;
}

export interface Expense {
  id: string;
  date: Date;
  vendor: string;
  description: string;
  categoryId: string;
  category: TransactionCategory;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque' | 'card';
  reference: string;
  receipt?: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  paidAt?: Date;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paidAmount: number;
  balance: number;
  paymentTerms: string;
  notes?: string;
  createdAt: Date;
  paidAt?: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  date: Date;
  type: 'receipt' | 'payment';
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque' | 'card' | 'mobile_money';
  reference: string;
  description: string;
  accountId: string;
  account: Account;
  customerId?: string;
  vendorId?: string;
  invoiceId?: string;
  status: 'pending' | 'cleared' | 'bounced';
  createdBy: string;
  createdAt: Date;
}

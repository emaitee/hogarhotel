const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = "hotel_management"

const defaultAccounts = [
  // Assets
  { code: "1001", name: "Cash in Hand", type: "asset", category: "Current Assets", balance: 50000, isActive: true },
  {
    code: "1002",
    name: "Bank Account - Main",
    type: "asset",
    category: "Current Assets",
    balance: 500000,
    isActive: true,
  },
  {
    code: "1003",
    name: "Accounts Receivable",
    type: "asset",
    category: "Current Assets",
    balance: 75000,
    isActive: true,
  },
  {
    code: "1004",
    name: "Inventory - Food & Beverage",
    type: "asset",
    category: "Current Assets",
    balance: 25000,
    isActive: true,
  },
  {
    code: "1101",
    name: "Furniture & Fixtures",
    type: "asset",
    category: "Fixed Assets",
    balance: 200000,
    isActive: true,
  },
  { code: "1102", name: "Building", type: "asset", category: "Fixed Assets", balance: 2000000, isActive: true },
  { code: "1103", name: "Equipment", type: "asset", category: "Fixed Assets", balance: 150000, isActive: true },

  // Liabilities
  {
    code: "2001",
    name: "Accounts Payable",
    type: "liability",
    category: "Current Liabilities",
    balance: 30000,
    isActive: true,
  },
  {
    code: "2002",
    name: "Accrued Expenses",
    type: "liability",
    category: "Current Liabilities",
    balance: 15000,
    isActive: true,
  },
  {
    code: "2003",
    name: "Customer Deposits",
    type: "liability",
    category: "Current Liabilities",
    balance: 25000,
    isActive: true,
  },
  {
    code: "2101",
    name: "Long-term Loan",
    type: "liability",
    category: "Long-term Liabilities",
    balance: 500000,
    isActive: true,
  },

  // Equity
  {
    code: "3001",
    name: "Owner's Capital",
    type: "equity",
    category: "Owner's Equity",
    balance: 2000000,
    isActive: true,
  },
  {
    code: "3002",
    name: "Retained Earnings",
    type: "equity",
    category: "Owner's Equity",
    balance: 465000,
    isActive: true,
  },

  // Revenue
  { code: "4001", name: "Room Revenue", type: "revenue", category: "Operating Revenue", balance: 0, isActive: true },
  {
    code: "4002",
    name: "Food & Beverage Revenue",
    type: "revenue",
    category: "Operating Revenue",
    balance: 0,
    isActive: true,
  },
  { code: "4003", name: "Laundry Revenue", type: "revenue", category: "Operating Revenue", balance: 0, isActive: true },
  { code: "4004", name: "Other Revenue", type: "revenue", category: "Operating Revenue", balance: 0, isActive: true },

  // Expenses
  { code: "5001", name: "Staff Salaries", type: "expense", category: "Operating Expenses", balance: 0, isActive: true },
  { code: "5002", name: "Utilities", type: "expense", category: "Operating Expenses", balance: 0, isActive: true },
  {
    code: "5003",
    name: "Maintenance & Repairs",
    type: "expense",
    category: "Operating Expenses",
    balance: 0,
    isActive: true,
  },
  {
    code: "5004",
    name: "Marketing & Advertising",
    type: "expense",
    category: "Operating Expenses",
    balance: 0,
    isActive: true,
  },
  {
    code: "5005",
    name: "Food & Beverage Costs",
    type: "expense",
    category: "Cost of Sales",
    balance: 0,
    isActive: true,
  },
  {
    code: "5006",
    name: "Housekeeping Supplies",
    type: "expense",
    category: "Operating Expenses",
    balance: 0,
    isActive: true,
  },
  {
    code: "5007",
    name: "Administrative Expenses",
    type: "expense",
    category: "Operating Expenses",
    balance: 0,
    isActive: true,
  },
]

const defaultCategories = [
  { name: "Room Operations", type: "income", color: "#10B981", description: "Revenue from room bookings" },
  { name: "Food & Beverage", type: "income", color: "#8B5CF6", description: "Revenue from restaurant and bar" },
  { name: "Other Services", type: "income", color: "#06B6D4", description: "Revenue from additional services" },
  { name: "Staff Costs", type: "expense", color: "#EF4444", description: "Employee salaries and benefits" },
  { name: "Utilities", type: "expense", color: "#F59E0B", description: "Electricity, water, gas, internet" },
  { name: "Maintenance", type: "expense", color: "#84CC16", description: "Repairs and maintenance costs" },
  { name: "Marketing", type: "expense", color: "#EC4899", description: "Advertising and promotional expenses" },
  { name: "Supplies", type: "expense", color: "#6366F1", description: "Housekeeping and operational supplies" },
  { name: "Administrative", type: "expense", color: "#64748B", description: "Office and administrative expenses" },
]

async function seedAccounts() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(dbName)

    // Clear existing data
    await db.collection("accounts").deleteMany({})
    await db.collection("transaction_categories").deleteMany({})

    // Add timestamps to accounts
    const accountsWithTimestamps = defaultAccounts.map((account) => ({
      ...account,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    // Insert accounts
    const accountResult = await db.collection("accounts").insertMany(accountsWithTimestamps)
    console.log(`Inserted ${accountResult.insertedCount} accounts`)

    // Insert transaction categories
    const categoryResult = await db.collection("transaction_categories").insertMany(defaultCategories)
    console.log(`Inserted ${categoryResult.insertedCount} transaction categories`)

    console.log("Accounts and categories seeded successfully!")
  } catch (error) {
    console.error("Error seeding accounts:", error)
  } finally {
    await client.close()
  }
}

// Run the seeding function
seedAccounts().catch(console.error)

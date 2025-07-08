const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"
const dbName = "hotel_management"

const defaultAccounts = [
  // Assets
  { code: "1000", name: "Cash", type: "Asset", category: "Current Assets", balance: 50000 },
  { code: "1010", name: "Petty Cash", type: "Asset", category: "Current Assets", balance: 1000 },
  { code: "1100", name: "Accounts Receivable", type: "Asset", category: "Current Assets", balance: 15000 },
  { code: "1200", name: "Inventory - Food & Beverage", type: "Asset", category: "Current Assets", balance: 8000 },
  { code: "1210", name: "Inventory - Supplies", type: "Asset", category: "Current Assets", balance: 5000 },
  { code: "1500", name: "Furniture & Equipment", type: "Asset", category: "Fixed Assets", balance: 200000 },
  { code: "1510", name: "Building", type: "Asset", category: "Fixed Assets", balance: 500000 },
  { code: "1520", name: "Land", type: "Asset", category: "Fixed Assets", balance: 300000 },
  { code: "1600", name: "Accumulated Depreciation", type: "Asset", category: "Fixed Assets", balance: -50000 },

  // Liabilities
  { code: "2000", name: "Accounts Payable", type: "Liability", category: "Current Liabilities", balance: 12000 },
  { code: "2100", name: "Accrued Expenses", type: "Liability", category: "Current Liabilities", balance: 8000 },
  { code: "2200", name: "Customer Deposits", type: "Liability", category: "Current Liabilities", balance: 25000 },
  { code: "2300", name: "Taxes Payable", type: "Liability", category: "Current Liabilities", balance: 5000 },
  { code: "2500", name: "Long-term Debt", type: "Liability", category: "Long-term Liabilities", balance: 150000 },

  // Equity
  { code: "3000", name: "Owner's Capital", type: "Equity", category: "Owner's Equity", balance: 800000 },
  { code: "3100", name: "Retained Earnings", type: "Equity", category: "Owner's Equity", balance: 50000 },

  // Revenue
  { code: "4000", name: "Room Revenue", type: "Revenue", category: "Operating Revenue", balance: 0 },
  { code: "4100", name: "Food & Beverage Revenue", type: "Revenue", category: "Operating Revenue", balance: 0 },
  { code: "4200", name: "Laundry Revenue", type: "Revenue", category: "Operating Revenue", balance: 0 },
  { code: "4300", name: "Spa Revenue", type: "Revenue", category: "Operating Revenue", balance: 0 },
  { code: "4400", name: "Conference Revenue", type: "Revenue", category: "Operating Revenue", balance: 0 },
  { code: "4500", name: "Other Revenue", type: "Revenue", category: "Other Revenue", balance: 0 },

  // Expenses
  { code: "5000", name: "Cost of Goods Sold", type: "Expense", category: "Cost of Sales", balance: 0 },
  { code: "5100", name: "Salaries & Wages", type: "Expense", category: "Operating Expenses", balance: 0 },
  { code: "5110", name: "Employee Benefits", type: "Expense", category: "Operating Expenses", balance: 0 },
  { code: "5200", name: "Utilities", type: "Expense", category: "Operating Expenses", balance: 0 },
  { code: "5210", name: "Telephone", type: "Expense", category: "Operating Expenses", balance: 0 },
  { code: "5220", name: "Internet", type: "Expense", category: "Operating Expenses", balance: 0 },
  { code: "5300", name: "Maintenance & Repairs", type: "Expense", category: "Operating Expenses", balance: 0 },
  { code: "5400", name: "Marketing & Advertising", type: "Expense", category: "Operating Expenses", balance: 0 },
  { code: "5500", name: "Insurance", type: "Expense", category: "Operating Expenses", balance: 0 },
  { code: "5600", name: "Office Supplies", type: "Expense", category: "Operating Expenses", balance: 0 },
  { code: "5700", name: "Professional Services", type: "Expense", category: "Operating Expenses", balance: 0 },
  { code: "5800", name: "Depreciation Expense", type: "Expense", category: "Operating Expenses", balance: 0 },
  { code: "5900", name: "Bank Charges", type: "Expense", category: "Other Expenses", balance: 0 },
  { code: "5910", name: "Interest Expense", type: "Expense", category: "Other Expenses", balance: 0 },
]

async function seedAccounts() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(dbName)
    const accountsCollection = db.collection("accounts")

    // Clear existing accounts
    await accountsCollection.deleteMany({})
    console.log("Cleared existing accounts")

    // Insert default accounts
    const accountsWithTimestamps = defaultAccounts.map((account) => ({
      ...account,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    const result = await accountsCollection.insertMany(accountsWithTimestamps)
    console.log(`Inserted ${result.insertedCount} accounts`)

    // Display summary
    console.log("\n=== ACCOUNTS SEEDED ===")
    console.log("Assets:", defaultAccounts.filter((a) => a.type === "Asset").length)
    console.log("Liabilities:", defaultAccounts.filter((a) => a.type === "Liability").length)
    console.log("Equity:", defaultAccounts.filter((a) => a.type === "Equity").length)
    console.log("Revenue:", defaultAccounts.filter((a) => a.type === "Revenue").length)
    console.log("Expenses:", defaultAccounts.filter((a) => a.type === "Expense").length)
    console.log("Total:", defaultAccounts.length)
  } catch (error) {
    console.error("Error seeding accounts:", error)
  } finally {
    await client.close()
    console.log("Disconnected from MongoDB")
  }
}

// Run the seeding function
seedAccounts()

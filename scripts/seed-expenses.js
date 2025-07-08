const { MongoClient, ObjectId } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"

const vendors = [
  "ABC Electric Company",
  "City Water Department",
  "Metro Gas Services",
  "Office Supply Plus",
  "Professional Cleaning Co",
  "Security Systems Inc",
  "Maintenance Masters",
  "Food Distributors LLC",
  "Linen Supply Co",
  "Tech Solutions Inc",
]

const paymentMethods = ["cash", "check", "credit_card", "bank_transfer"]
const statuses = ["pending", "approved", "paid", "rejected"]

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function getRandomAmount(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function seedAccountingData() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const expensesCollection = db.collection("expenses")
    const categoriesCollection = db.collection("transactioncategories")
    const budgetsCollection = db.collection("budgets")
    const taxRecordsCollection = db.collection("taxrecords")
    const financialReportsCollection = db.collection("financialreports")

    // Get transaction categories for expenses
    const expenseCategories = await categoriesCollection.find({ type: "expense" }).toArray()

    if (expenseCategories.length === 0) {
      console.log("No expense categories found. Please run seed-transaction-categories.js first.")
      return
    }

    // Assign random categories to expenses
    const sampleExpenses = [
      {
        date: new Date("2024-01-15"),
        vendor: "Office Supplies Co.",
        description: "Office stationery and supplies",
        amount: 25000,
        paymentMethod: "bank_transfer",
        reference: "INV-2024-001",
        status: "paid",
        notes: "Monthly office supplies",
        createdBy: "admin",
        paidAt: new Date("2024-01-16"),
      },
      {
        date: new Date("2024-01-20"),
        vendor: "Utility Company",
        description: "Electricity bill for January",
        amount: 150000,
        paymentMethod: "bank_transfer",
        reference: "ELEC-2024-001",
        status: "approved",
        notes: "Monthly electricity bill",
        createdBy: "admin",
        approvedBy: "manager",
        approvedAt: new Date("2024-01-21"),
      },
      {
        date: new Date("2024-01-25"),
        vendor: "Cleaning Services Ltd",
        description: "Professional cleaning services",
        amount: 75000,
        paymentMethod: "cash",
        reference: "CLEAN-2024-001",
        status: "pending",
        notes: "Weekly cleaning service",
        createdBy: "staff",
      },
      {
        date: new Date("2024-02-01"),
        vendor: "Food Supplier Inc",
        description: "Restaurant ingredients and supplies",
        amount: 200000,
        paymentMethod: "bank_transfer",
        reference: "FOOD-2024-001",
        status: "paid",
        notes: "Weekly food supplies",
        createdBy: "chef",
        paidAt: new Date("2024-02-02"),
      },
      {
        date: new Date("2024-02-05"),
        vendor: "Maintenance Co",
        description: "HVAC system maintenance",
        amount: 120000,
        paymentMethod: "cheque",
        reference: "MAINT-2024-001",
        status: "approved",
        notes: "Quarterly HVAC maintenance",
        createdBy: "maintenance",
        approvedBy: "manager",
        approvedAt: new Date("2024-02-06"),
      },
    ]

    const sampleBudgets = [
      {
        name: "Q1 2024 Operations Budget",
        year: 2024,
        period: "quarterly",
        status: "active",
        createdBy: "admin",
        approvedBy: "manager",
        approvedAt: new Date("2024-01-01"),
      },
      {
        name: "January 2024 Monthly Budget",
        year: 2024,
        month: 1,
        period: "monthly",
        status: "closed",
        createdBy: "admin",
        approvedBy: "manager",
        approvedAt: new Date("2024-01-01"),
      },
      {
        name: "Annual 2024 Budget",
        year: 2024,
        period: "annual",
        status: "approved",
        createdBy: "admin",
        approvedBy: "ceo",
        approvedAt: new Date("2023-12-15"),
      },
    ]

    const sampleTaxRecords = [
      {
        taxType: "VAT",
        period: "2024-01",
        taxableAmount: 2000000,
        taxRate: 7.5,
        dueDate: new Date("2024-02-21"),
        status: "paid",
        reference: "VAT-2024-001",
        notes: "January VAT return",
        createdBy: "accountant",
        filedBy: "accountant",
        filedDate: new Date("2024-02-15"),
        paidDate: new Date("2024-02-20"),
      },
      {
        taxType: "Corporate Income Tax",
        period: "2023",
        taxableAmount: 5000000,
        taxRate: 30,
        dueDate: new Date("2024-03-31"),
        status: "filed",
        reference: "CIT-2023-001",
        notes: "2023 Corporate Income Tax",
        createdBy: "accountant",
        filedBy: "accountant",
        filedDate: new Date("2024-03-15"),
      },
      {
        taxType: "Withholding Tax",
        period: "2024-01",
        taxableAmount: 800000,
        taxRate: 10,
        dueDate: new Date("2024-02-21"),
        status: "pending",
        reference: "WHT-2024-001",
        notes: "January Withholding Tax",
        createdBy: "accountant",
      },
      {
        taxType: "VAT",
        period: "2024-02",
        taxableAmount: 2200000,
        taxRate: 7.5,
        dueDate: new Date("2024-03-21"),
        status: "overdue",
        reference: "VAT-2024-002",
        notes: "February VAT return - overdue",
        createdBy: "accountant",
      },
    ]

    // Clear existing data
    await expensesCollection.deleteMany({})
    await budgetsCollection.deleteMany({})
    await taxRecordsCollection.deleteMany({})
    await financialReportsCollection.deleteMany()
    console.log("Cleared existing data")

    // Insert sample expenses
    const expensesWithCategories = sampleExpenses.map((expense) => ({
      ...expense,
      categoryId: expenseCategories[Math.floor(Math.random() * expenseCategories.length)]._id,
    }))

    const expenseResult = await expensesCollection.insertMany(expensesWithCategories)
    console.log(`Inserted ${expenseResult.insertedCount} sample expenses`)

    // Generate additional expenses for the last 6 months
    const expenses = []
    const startDate = new Date(2024, 0, 1) // January 1, 2024
    const endDate = new Date() // Today

    // Generate 100 additional sample expenses
    for (let i = 0; i < 100; i++) {
      const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)]
      const vendor = vendors[Math.floor(Math.random() * vendors.length)]
      const date = getRandomDate(startDate, endDate)
      const dueDate = new Date(date.getTime() + (Math.random() * 30 + 7) * 24 * 60 * 60 * 1000) // 7-37 days after expense date
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const amount = getRandomAmount(50, 5000)

      const expense = {
        description: `${category.name} - ${vendor}`,
        amount,
        categoryId: category._id,
        vendor,
        date,
        dueDate,
        status,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        reference: `EXP-${String(i + 1).padStart(4, "0")}`,
        notes: `Sample expense for ${category.name}`,
        tags: [category.name.toLowerCase().replace(/\s+/g, "-")],
        createdAt: date,
        updatedAt: date,
      }

      // Add approval/payment dates based on status
      if (status === "approved" || status === "paid") {
        expense.approvedBy = "admin"
        expense.approvedAt = new Date(date.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
      }

      if (status === "paid") {
        expense.paidAt = new Date(expense.approvedAt.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000)
      }

      expenses.push(expense)
    }

    // Insert additional expenses
    const additionalExpenseResult = await expensesCollection.insertMany(expenses)
    console.log(`Inserted ${additionalExpenseResult.insertedCount} additional expenses`)

    // Create budgets with categories
    const budgetsWithCategories = sampleBudgets.map((budget) => ({
      ...budget,
      categories: expenseCategories.slice(0, 3).map((cat) => ({
        categoryId: cat._id,
        budgetedAmount: Math.floor(Math.random() * 500000) + 100000,
        actualAmount: Math.floor(Math.random() * 400000) + 50000,
        variance: 0,
        variancePercentage: 0,
      })),
    }))

    // Calculate totals for budgets
    budgetsWithCategories.forEach((budget) => {
      budget.totalBudget = budget.categories.reduce((sum, cat) => sum + cat.budgetedAmount, 0)
      budget.totalActual = budget.categories.reduce((sum, cat) => sum + cat.actualAmount, 0)
      budget.variance = budget.totalActual - budget.totalBudget

      budget.categories.forEach((cat) => {
        cat.variance = cat.actualAmount - cat.budgetedAmount
        cat.variancePercentage = cat.budgetedAmount > 0 ? (cat.variance / cat.budgetedAmount) * 100 : 0
      })
    })

    const budgetResult = await budgetsCollection.insertMany(budgetsWithCategories)
    console.log(`Inserted ${budgetResult.insertedCount} budgets`)

    // Insert tax records
    const taxResult = await taxRecordsCollection.insertMany(sampleTaxRecords)
    console.log(`Inserted ${taxResult.insertedCount} tax records`)

    // Create a sample financial report
    const sampleReport = {
      name: "January 2024 Profit & Loss Statement",
      type: "profit-loss",
      period: {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
      },
      data: {
        revenue: {
          total: 2500000,
          byCategory: {
            "Room Revenue": 1800000,
            "Food & Beverage": 500000,
            "Other Services": 200000,
          },
        },
        expenses: {
          total: 1650000,
          byCategory: {
            "Staff Costs": 800000,
            Utilities: 300000,
            Maintenance: 250000,
            Supplies: 200000,
            Other: 100000,
          },
        },
        profit: {
          gross: 850000,
          net: 750000,
          margin: 30.0,
        },
      },
      summary: {
        totalRevenue: 2500000,
        totalExpenses: 1650000,
        netProfit: 750000,
        profitMargin: 30.0,
      },
      status: "completed",
      generatedBy: "system",
    }

    const reportResult = await financialReportsCollection.insertOne(sampleReport)
    console.log(`Inserted 1 financial report`)

    // Display summary
    const statusCounts = {}
    const categoryTotals = {}

    const allExpenses = await expensesCollection.find().toArray()

    allExpenses.forEach((expense) => {
      statusCounts[expense.status] = (statusCounts[expense.status] || 0) + 1

      const categoryName = expenseCategories.find((cat) => cat._id.equals(expense.categoryId))?.name || "Unknown"
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + expense.amount
    })

    console.log("\nExpense Summary:")
    console.log("Status breakdown:", statusCounts)
    console.log("\nCategory totals:")
    Object.entries(categoryTotals).forEach(([category, total]) => {
      console.log(`${category}: $${total.toLocaleString()}`)
    })

    const totalAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    console.log(`\nTotal expenses: $${totalAmount.toLocaleString()}`)

    console.log("Accounting data seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding accounting data:", error)
  } finally {
    await client.close()
    console.log("Disconnected from MongoDB")
  }
}

// Run the seeding function
seedAccountingData().catch(console.error)

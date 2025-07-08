const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"

const categories = [
  // Income Categories
  {
    name: "Room Revenue",
    type: "income",
    color: "#10B981",
    description: "Revenue from room bookings",
    isActive: true,
  },
  {
    name: "Food & Beverage",
    type: "income",
    color: "#3B82F6",
    description: "Revenue from restaurant and bar services",
    isActive: true,
  },
  {
    name: "Event Services",
    type: "income",
    color: "#8B5CF6",
    description: "Revenue from events and conferences",
    isActive: true,
  },
  {
    name: "Spa & Wellness",
    type: "income",
    color: "#06B6D4",
    description: "Revenue from spa and wellness services",
    isActive: true,
  },
  {
    name: "Other Services",
    type: "income",
    color: "#84CC16",
    description: "Revenue from miscellaneous services",
    isActive: true,
  },

  // Expense Categories
  {
    name: "Utilities",
    type: "expense",
    color: "#EF4444",
    description: "Electricity, water, gas, internet",
    isActive: true,
  },
  {
    name: "Staff Salaries",
    type: "expense",
    color: "#F59E0B",
    description: "Employee salaries and wages",
    isActive: true,
  },
  {
    name: "Maintenance",
    type: "expense",
    color: "#6B7280",
    description: "Property and equipment maintenance",
    isActive: true,
  },
  {
    name: "Marketing",
    type: "expense",
    color: "#EC4899",
    description: "Advertising and promotional expenses",
    isActive: true,
  },
  {
    name: "Supplies",
    type: "expense",
    color: "#14B8A6",
    description: "Office and operational supplies",
    isActive: true,
  },
  {
    name: "Insurance",
    type: "expense",
    color: "#F97316",
    description: "Insurance premiums and coverage",
    isActive: true,
  },
  {
    name: "Professional Services",
    type: "expense",
    color: "#8B5CF6",
    description: "Legal, accounting, consulting fees",
    isActive: true,
  },
  {
    name: "Travel & Entertainment",
    type: "expense",
    color: "#06B6D4",
    description: "Business travel and client entertainment",
    isActive: true,
  },
]

async function seedTransactionCategories() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const collection = db.collection("transactioncategories")

    // Clear existing categories
    await collection.deleteMany({})
    console.log("Cleared existing transaction categories")

    // Insert new categories
    const result = await collection.insertMany(categories)
    console.log(`Inserted ${result.insertedCount} transaction categories`)

    // Display inserted categories
    console.log("\nInserted Categories:")
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (${category.type}) - ${category.color}`)
    })
  } catch (error) {
    console.error("Error seeding transaction categories:", error)
  } finally {
    await client.close()
    console.log("Disconnected from MongoDB")
  }
}

seedTransactionCategories()

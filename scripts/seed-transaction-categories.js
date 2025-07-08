const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"

const categories = [
  // Income Categories
  {
    name: "Room Revenue",
    type: "income",
    description: "Revenue from room bookings",
    color: "#10B981",
    code: "ROOM_REV",
  },
  {
    name: "Food & Beverage",
    type: "income",
    description: "Restaurant and bar revenue",
    color: "#3B82F6",
    code: "F&B_REV",
  },
  {
    name: "Event Services",
    type: "income",
    description: "Conference and event revenue",
    color: "#8B5CF6",
    code: "EVENT_REV",
  },
  { name: "Spa Services", type: "income", description: "Spa and wellness revenue", color: "#EC4899", code: "SPA_REV" },
  { name: "Other Revenue", type: "income", description: "Miscellaneous revenue", color: "#F59E0B", code: "OTHER_REV" },

  // Expense Categories
  {
    name: "Utilities",
    type: "expense",
    description: "Electricity, water, gas, internet",
    color: "#EF4444",
    code: "UTILITIES",
  },
  {
    name: "Maintenance",
    type: "expense",
    description: "Property and equipment maintenance",
    color: "#F97316",
    code: "MAINTENANCE",
  },
  {
    name: "Staff Salaries",
    type: "expense",
    description: "Employee wages and benefits",
    color: "#84CC16",
    code: "SALARIES",
  },
  {
    name: "Marketing",
    type: "expense",
    description: "Advertising and promotional expenses",
    color: "#06B6D4",
    code: "MARKETING",
  },
  {
    name: "Supplies",
    type: "expense",
    description: "Office and operational supplies",
    color: "#8B5CF6",
    code: "SUPPLIES",
  },
  {
    name: "Insurance",
    type: "expense",
    description: "Property and liability insurance",
    color: "#EC4899",
    code: "INSURANCE",
  },
  {
    name: "Professional Services",
    type: "expense",
    description: "Legal, accounting, consulting",
    color: "#6B7280",
    code: "PROF_SERVICES",
  },
  {
    name: "Travel & Entertainment",
    type: "expense",
    description: "Business travel and client entertainment",
    color: "#F59E0B",
    code: "TRAVEL_ENT",
  },
]

async function seedTransactionCategories() {
  const client = new MongoClient(MONGODB_URI)

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

const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = "hotel_management"

const categories = [
  // Income Categories
  {
    name: "Room Revenue",
    code: "ROOM_REV",
    type: "income",
    color: "#10B981",
    description: "Revenue from room bookings",
  },
  {
    name: "Food & Beverage",
    code: "F&B_REV",
    type: "income",
    color: "#3B82F6",
    description: "Restaurant and bar revenue",
  },
  {
    name: "Event Services",
    code: "EVENT_REV",
    type: "income",
    color: "#8B5CF6",
    description: "Conference and event revenue",
  },
  { name: "Spa Services", code: "SPA_REV", type: "income", color: "#EC4899", description: "Spa and wellness revenue" },
  { name: "Other Revenue", code: "OTHER_REV", type: "income", color: "#06B6D4", description: "Miscellaneous revenue" },

  // Expense Categories
  {
    name: "Utilities",
    code: "UTILITIES",
    type: "expense",
    color: "#F59E0B",
    description: "Electricity, water, gas, internet",
  },
  {
    name: "Maintenance",
    code: "MAINTENANCE",
    type: "expense",
    color: "#EF4444",
    description: "Repairs and maintenance",
  },
  {
    name: "Supplies",
    code: "SUPPLIES",
    type: "expense",
    color: "#84CC16",
    description: "Office and operational supplies",
  },
  { name: "Marketing", code: "MARKETING", type: "expense", color: "#F97316", description: "Advertising and promotion" },
  { name: "Insurance", code: "INSURANCE", type: "expense", color: "#6366F1", description: "Insurance premiums" },
  {
    name: "Professional Services",
    code: "PROF_SERV",
    type: "expense",
    color: "#14B8A6",
    description: "Legal, accounting, consulting",
  },
  { name: "Travel", code: "TRAVEL", type: "expense", color: "#F43F5E", description: "Business travel expenses" },
  { name: "Miscellaneous", code: "MISC_EXP", type: "expense", color: "#64748B", description: "Other expenses" },
]

async function seedTransactionCategories() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(dbName)
    const collection = db.collection("transactioncategories")

    // Clear existing categories
    await collection.deleteMany({})
    console.log("Cleared existing transaction categories")

    // Insert new categories
    const result = await collection.insertMany(
      categories.map((category) => ({
        ...category,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )

    console.log(`Inserted ${result.insertedCount} transaction categories`)

    // Display inserted categories
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (${category.code}) - ${category.type}`)
    })
  } catch (error) {
    console.error("Error seeding transaction categories:", error)
  } finally {
    await client.close()
    console.log("Disconnected from MongoDB")
  }
}

seedTransactionCategories()

const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"

const categories = [
  // Income Categories
  { name: "Room Revenue", type: "income", description: "Revenue from room bookings", color: "#10B981" },
  { name: "Food & Beverage", type: "income", description: "Restaurant and bar revenue", color: "#059669" },
  { name: "Event Services", type: "income", description: "Conference and event hosting", color: "#047857" },
  { name: "Spa Services", type: "income", description: "Spa and wellness services", color: "#065F46" },
  { name: "Other Services", type: "income", description: "Miscellaneous service revenue", color: "#064E3B" },

  // Expense Categories
  { name: "Utilities", type: "expense", description: "Electricity, water, gas, internet", color: "#EF4444" },
  { name: "Maintenance", type: "expense", description: "Property and equipment maintenance", color: "#DC2626" },
  { name: "Staff Salaries", type: "expense", description: "Employee wages and benefits", color: "#B91C1C" },
  { name: "Marketing", type: "expense", description: "Advertising and promotional expenses", color: "#991B1B" },
  { name: "Supplies", type: "expense", description: "Office and operational supplies", color: "#7F1D1D" },
  { name: "Insurance", type: "expense", description: "Property and liability insurance", color: "#6B1D1D" },
  { name: "Professional Services", type: "expense", description: "Legal, accounting, consulting", color: "#5B1D1D" },
  {
    name: "Travel & Entertainment",
    type: "expense",
    description: "Business travel and client entertainment",
    color: "#4B1D1D",
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
      console.log(`${index + 1}. ${category.name} (${category.type}) - ${category.color}`)
    })
  } catch (error) {
    console.error("Error seeding transaction categories:", error)
  } finally {
    await client.close()
  }
}

seedTransactionCategories()

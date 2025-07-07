const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

const sampleGuests = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0101",
    address: "123 Main St, New York, NY 10001",
    idNumber: "ID001234567",
    totalStays: 3,
    totalSpent: 1250.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0102",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    idNumber: "ID002345678",
    totalStays: 1,
    totalSpent: 450.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1-555-0103",
    address: "789 Pine St, Chicago, IL 60601",
    idNumber: "ID003456789",
    totalStays: 5,
    totalSpent: 2100.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1-555-0104",
    address: "321 Elm St, Miami, FL 33101",
    idNumber: "ID004567890",
    totalStays: 2,
    totalSpent: 800.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1-555-0105",
    address: "654 Maple Dr, Seattle, WA 98101",
    idNumber: "ID005678901",
    totalStays: 4,
    totalSpent: 1600.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedGuests() {
  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const collection = db.collection("guests")

    // Clear existing guests
    await collection.deleteMany({})
    console.log("Cleared existing guests")

    // Insert sample guests
    const result = await collection.insertMany(sampleGuests)
    console.log(`Inserted ${result.insertedCount} guests`)

    console.log("Guest seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding guests:", error)
  } finally {
    await client.close()
  }
}

seedGuests()

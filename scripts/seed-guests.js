const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"

const sampleGuests = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0101",
    address: "123 Main Street, New York, NY 10001",
    idNumber: "ID001234567",
    nationality: "American",
    dateOfBirth: new Date("1985-06-15"),
    totalStays: 3,
    totalSpent: 1250.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0102",
    address: "456 Oak Avenue, Los Angeles, CA 90210",
    idNumber: "ID001234568",
    nationality: "American",
    dateOfBirth: new Date("1990-03-22"),
    totalStays: 1,
    totalSpent: 450.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1-555-0103",
    address: "789 Pine Street, Chicago, IL 60601",
    idNumber: "ID001234569",
    nationality: "American",
    dateOfBirth: new Date("1978-11-08"),
    totalStays: 5,
    totalSpent: 2100.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1-555-0104",
    address: "321 Elm Street, Miami, FL 33101",
    idNumber: "ID001234570",
    nationality: "American",
    dateOfBirth: new Date("1992-07-14"),
    totalStays: 2,
    totalSpent: 800.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1-555-0105",
    address: "654 Maple Drive, Seattle, WA 98101",
    idNumber: "ID001234571",
    nationality: "American",
    dateOfBirth: new Date("1983-12-03"),
    totalStays: 0,
    totalSpent: 0.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "+1-555-0106",
    address: "987 Cedar Lane, Boston, MA 02101",
    idNumber: "ID001234572",
    nationality: "American",
    dateOfBirth: new Date("1988-04-18"),
    totalStays: 4,
    totalSpent: 1600.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "James Taylor",
    email: "james.taylor@email.com",
    phone: "+1-555-0107",
    address: "147 Birch Street, Denver, CO 80201",
    idNumber: "ID001234573",
    nationality: "American",
    dateOfBirth: new Date("1975-09-25"),
    totalStays: 7,
    totalSpent: 3150.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Jennifer Martinez",
    email: "jennifer.martinez@email.com",
    phone: "+1-555-0108",
    address: "258 Spruce Avenue, Phoenix, AZ 85001",
    idNumber: "ID001234574",
    nationality: "American",
    dateOfBirth: new Date("1991-01-12"),
    totalStays: 1,
    totalSpent: 350.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedGuests() {
  const client = new MongoClient(uri)

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

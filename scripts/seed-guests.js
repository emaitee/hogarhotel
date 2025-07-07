const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI

const sampleGuests = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+234-801-234-5678",
    address: "123 Victoria Island, Lagos, Nigeria",
    nationality: "Nigeria",
    dateOfBirth: new Date("1985-06-15"),
    idNumber: "A12345678",
    emergencyContact: "Jane Smith - +234-802-345-6789",
    specialRequests: "Vegetarian meals preferred",
    totalStays: 3,
    totalSpent: 150000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+234-803-456-7890",
    address: "456 Ikoyi, Lagos, Nigeria",
    nationality: "United States",
    dateOfBirth: new Date("1990-03-22"),
    idNumber: "US987654321",
    emergencyContact: "Mike Johnson - +1-555-123-4567",
    specialRequests: "Late check-out preferred",
    totalStays: 1,
    totalSpent: 75000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+234-805-678-9012",
    address: "789 Lekki Phase 1, Lagos, Nigeria",
    nationality: "United Kingdom",
    dateOfBirth: new Date("1978-11-08"),
    idNumber: "UK456789123",
    emergencyContact: "Emma Wilson - +44-20-7946-0958",
    specialRequests: "Ground floor room preferred",
    totalStays: 5,
    totalSpent: 300000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+234-807-890-1234",
    address: "321 Surulere, Lagos, Nigeria",
    nationality: "Spain",
    dateOfBirth: new Date("1992-09-14"),
    idNumber: "ES789123456",
    emergencyContact: "Carlos Garcia - +34-91-123-4567",
    specialRequests: "Extra towels and pillows",
    totalStays: 2,
    totalSpent: 120000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    phone: "+234-809-012-3456",
    address: "654 Ikeja, Lagos, Nigeria",
    nationality: "Nigeria",
    dateOfBirth: new Date("1988-12-03"),
    idNumber: "A98765432",
    emergencyContact: "Fatima Hassan - +234-810-123-4567",
    specialRequests: "Halal meals only",
    totalStays: 4,
    totalSpent: 200000,
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

    // Display inserted guests
    const guests = await collection.find({}).toArray()
    console.log("\nInserted guests:")
    guests.forEach((guest) => {
      console.log(`- ${guest.name} (${guest.email})`)
    })
  } catch (error) {
    console.error("Error seeding guests:", error)
  } finally {
    await client.close()
    console.log("\nDisconnected from MongoDB")
  }
}

seedGuests()

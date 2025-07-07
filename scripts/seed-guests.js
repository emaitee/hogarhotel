const { MongoClient, ObjectId } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"

const sampleGuests = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0101",
    address: "123 Main St, New York, NY 10001",
    nationality: "American",
    dateOfBirth: new Date("1985-03-15"),
    idNumber: "ID123456789",
    emergencyContact: {
      name: "Jane Smith",
      phone: "+1-555-0102",
      relationship: "Spouse",
    },
    totalStays: 0,
    totalSpent: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Emily Johnson",
    email: "emily.johnson@email.com",
    phone: "+1-555-0201",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    nationality: "American",
    dateOfBirth: new Date("1990-07-22"),
    idNumber: "ID987654321",
    emergencyContact: {
      name: "Michael Johnson",
      phone: "+1-555-0202",
      relationship: "Brother",
    },
    totalStays: 0,
    totalSpent: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1-555-0301",
    address: "789 Pine St, Chicago, IL 60601",
    nationality: "American",
    dateOfBirth: new Date("1978-11-08"),
    idNumber: "ID456789123",
    emergencyContact: {
      name: "Sarah Wilson",
      phone: "+1-555-0302",
      relationship: "Wife",
    },
    totalStays: 0,
    totalSpent: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1-555-0401",
    address: "321 Elm St, Miami, FL 33101",
    nationality: "Spanish",
    dateOfBirth: new Date("1992-05-14"),
    idNumber: "ID789123456",
    emergencyContact: {
      name: "Carlos Garcia",
      phone: "+1-555-0402",
      relationship: "Father",
    },
    totalStays: 0,
    totalSpent: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Robert Brown",
    email: "robert.brown@email.com",
    phone: "+1-555-0501",
    address: "654 Maple Dr, Seattle, WA 98101",
    nationality: "American",
    dateOfBirth: new Date("1983-09-30"),
    idNumber: "ID321654987",
    emergencyContact: {
      name: "Lisa Brown",
      phone: "+1-555-0502",
      relationship: "Sister",
    },
    totalStays: 0,
    totalSpent: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedGuests() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const guestsCollection = db.collection("guests")

    // Clear existing guests
    await guestsCollection.deleteMany({})
    console.log("Cleared existing guests")

    // Insert sample guests
    const result = await guestsCollection.insertMany(sampleGuests)
    console.log(`Inserted ${result.insertedCount} guests`)

    // Display inserted guests
    const guests = await guestsCollection.find({}).toArray()
    console.log("\nInserted guests:")
    guests.forEach((guest) => {
      console.log(`- ${guest.name} (${guest.email})`)
    })
  } catch (error) {
    console.error("Error seeding guests:", error)
  } finally {
    await client.close()
    console.log("\nDatabase connection closed")
  }
}

seedGuests()

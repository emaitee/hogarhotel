const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = "hotel_management"

const sampleRooms = [
  {
    number: "101",
    floor: 1,
    type: "standard",
    status: "available",
    price: 99.99,
    amenities: ["WiFi", "TV", "AC"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "102",
    floor: 1,
    type: "standard",
    status: "occupied",
    price: 99.99,
    amenities: ["WiFi", "TV", "AC"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "201",
    floor: 2,
    type: "deluxe",
    status: "available",
    price: 149.99,
    amenities: ["WiFi", "TV", "AC", "Minibar", "Balcony"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "202",
    floor: 2,
    type: "deluxe",
    status: "cleaning",
    price: 149.99,
    amenities: ["WiFi", "TV", "AC", "Minibar", "Balcony"],
    lastCleaned: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "301",
    floor: 3,
    type: "suite",
    status: "available",
    price: 299.99,
    amenities: ["WiFi", "TV", "AC", "Minibar", "Balcony", "Jacuzzi", "Room Service"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "302",
    floor: 3,
    type: "suite",
    status: "maintenance",
    price: 299.99,
    amenities: ["WiFi", "TV", "AC", "Minibar", "Balcony", "Jacuzzi", "Room Service"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedRooms() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(dbName)
    const roomsCollection = db.collection("rooms")

    // Clear existing rooms
    await roomsCollection.deleteMany({})
    console.log("Cleared existing rooms")

    // Insert sample rooms
    const result = await roomsCollection.insertMany(sampleRooms)
    console.log(`Inserted ${result.insertedCount} rooms`)

    // Create indexes
    await roomsCollection.createIndex({ number: 1 }, { unique: true })
    await roomsCollection.createIndex({ status: 1 })
    await roomsCollection.createIndex({ type: 1 })
    console.log("Created indexes")
  } catch (error) {
    console.error("Error seeding rooms:", error)
  } finally {
    await client.close()
    console.log("Disconnected from MongoDB")
  }
}

seedRooms()

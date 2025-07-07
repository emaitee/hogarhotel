const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI

const sampleRooms = [
  {
    number: "101",
    type: "standard",
    price: 25000,
    capacity: 2,
    amenities: ["WiFi", "TV", "AC", "Mini Fridge"],
    status: "available",
    description: "Comfortable standard room with modern amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "102",
    type: "standard",
    price: 25000,
    capacity: 2,
    amenities: ["WiFi", "TV", "AC", "Mini Fridge"],
    status: "available",
    description: "Comfortable standard room with modern amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "201",
    type: "deluxe",
    price: 40000,
    capacity: 3,
    amenities: ["WiFi", "TV", "AC", "Mini Fridge", "Balcony", "Room Service"],
    status: "available",
    description: "Spacious deluxe room with balcony and premium amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "202",
    type: "deluxe",
    price: 40000,
    capacity: 3,
    amenities: ["WiFi", "TV", "AC", "Mini Fridge", "Balcony", "Room Service"],
    status: "occupied",
    description: "Spacious deluxe room with balcony and premium amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "301",
    type: "suite",
    price: 75000,
    capacity: 4,
    amenities: ["WiFi", "TV", "AC", "Mini Fridge", "Balcony", "Room Service", "Jacuzzi", "Living Area"],
    status: "available",
    description: "Luxury suite with separate living area and premium amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "302",
    type: "suite",
    price: 75000,
    capacity: 4,
    amenities: ["WiFi", "TV", "AC", "Mini Fridge", "Balcony", "Room Service", "Jacuzzi", "Living Area"],
    status: "maintenance",
    description: "Luxury suite with separate living area and premium amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "103",
    type: "standard",
    price: 25000,
    capacity: 2,
    amenities: ["WiFi", "TV", "AC", "Mini Fridge"],
    status: "cleaning",
    description: "Comfortable standard room with modern amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "203",
    type: "deluxe",
    price: 40000,
    capacity: 3,
    amenities: ["WiFi", "TV", "AC", "Mini Fridge", "Balcony", "Room Service"],
    status: "available",
    description: "Spacious deluxe room with balcony and premium amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedRooms() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const collection = db.collection("rooms")

    // Clear existing rooms
    await collection.deleteMany({})
    console.log("Cleared existing rooms")

    // Insert sample rooms
    const result = await collection.insertMany(sampleRooms)
    console.log(`Inserted ${result.insertedCount} rooms`)

    // Display inserted rooms
    const rooms = await collection.find({}).toArray()
    console.log("\nInserted rooms:")
    rooms.forEach((room) => {
      console.log(`- Room ${room.number} (${room.type}) - ${room.status} - ₦${room.price.toLocaleString()}/night`)
    })
  } catch (error) {
    console.error("Error seeding rooms:", error)
  } finally {
    await client.close()
    console.log("\nDisconnected from MongoDB")
  }
}

seedRooms()

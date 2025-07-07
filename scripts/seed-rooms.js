const { MongoClient, ObjectId } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"

const sampleRooms = [
  {
    number: "101",
    type: "Standard",
    status: "available",
    price: 120,
    capacity: 2,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom"],
    description: "Comfortable standard room with modern amenities",
    floor: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "102",
    type: "Standard",
    status: "available",
    price: 120,
    capacity: 2,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom"],
    description: "Comfortable standard room with modern amenities",
    floor: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "201",
    type: "Deluxe",
    status: "available",
    price: 180,
    capacity: 3,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Balcony"],
    description: "Spacious deluxe room with city view and premium amenities",
    floor: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "202",
    type: "Deluxe",
    status: "available",
    price: 180,
    capacity: 3,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Balcony"],
    description: "Spacious deluxe room with city view and premium amenities",
    floor: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "301",
    type: "Suite",
    status: "available",
    price: 300,
    capacity: 4,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Balcony", "Living Area", "Kitchen"],
    description: "Luxurious suite with separate living area and premium amenities",
    floor: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "302",
    type: "Suite",
    status: "available",
    price: 300,
    capacity: 4,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Balcony", "Living Area", "Kitchen"],
    description: "Luxurious suite with separate living area and premium amenities",
    floor: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "103",
    type: "Standard",
    status: "cleaning",
    price: 120,
    capacity: 2,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom"],
    description: "Comfortable standard room with modern amenities",
    floor: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "203",
    type: "Deluxe",
    status: "maintenance",
    price: 180,
    capacity: 3,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Balcony"],
    description: "Spacious deluxe room with city view and premium amenities",
    floor: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedRooms() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const roomsCollection = db.collection("rooms")

    // Clear existing rooms
    await roomsCollection.deleteMany({})
    console.log("Cleared existing rooms")

    // Insert sample rooms
    const result = await roomsCollection.insertMany(sampleRooms)
    console.log(`Inserted ${result.insertedCount} rooms`)

    // Display inserted rooms
    const rooms = await roomsCollection.find({}).toArray()
    console.log("\nInserted rooms:")
    rooms.forEach((room) => {
      console.log(`- Room ${room.number} (${room.type}) - ${room.status} - $${room.price}/night`)
    })
  } catch (error) {
    console.error("Error seeding rooms:", error)
  } finally {
    await client.close()
    console.log("\nDatabase connection closed")
  }
}

seedRooms()

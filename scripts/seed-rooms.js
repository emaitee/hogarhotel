const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

const sampleRooms = [
  {
    number: "101",
    type: "Standard",
    price: 120.0,
    capacity: 2,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom"],
    status: "available",
    description: "Comfortable standard room with modern amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "102",
    type: "Standard",
    price: 120.0,
    capacity: 2,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom"],
    status: "available",
    description: "Comfortable standard room with modern amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "201",
    type: "Deluxe",
    price: 180.0,
    capacity: 3,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Balcony"],
    status: "available",
    description: "Spacious deluxe room with premium amenities and city view",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "202",
    type: "Deluxe",
    price: 180.0,
    capacity: 3,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Balcony"],
    status: "occupied",
    description: "Spacious deluxe room with premium amenities and city view",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "301",
    type: "Suite",
    price: 350.0,
    capacity: 4,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Balcony", "Living Area", "Kitchen"],
    status: "available",
    description: "Luxurious suite with separate living area and premium amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "302",
    type: "Suite",
    price: 350.0,
    capacity: 4,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Balcony", "Living Area", "Kitchen"],
    status: "cleaning",
    description: "Luxurious suite with separate living area and premium amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "103",
    type: "Standard",
    price: 120.0,
    capacity: 2,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom"],
    status: "maintenance",
    description: "Comfortable standard room with modern amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "203",
    type: "Deluxe",
    price: 180.0,
    capacity: 3,
    amenities: ["WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Balcony"],
    status: "available",
    description: "Spacious deluxe room with premium amenities and city view",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedRooms() {
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

    console.log("Room seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding rooms:", error)
  } finally {
    await client.close()
  }
}

seedRooms()

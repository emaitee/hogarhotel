const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"

const sampleRooms = [
  {
    number: "101",
    type: "standard",
    price: 150,
    capacity: 2,
    amenities: ["wifi", "tv", "ac", "minibar"],
    status: "available",
    floor: 1,
    description: "Comfortable standard room with city view",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "102",
    type: "standard",
    price: 150,
    capacity: 2,
    amenities: ["wifi", "tv", "ac", "minibar"],
    status: "available",
    floor: 1,
    description: "Comfortable standard room with garden view",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "103",
    type: "deluxe",
    price: 250,
    capacity: 3,
    amenities: ["wifi", "tv", "ac", "minibar", "balcony", "room-service"],
    status: "available",
    floor: 1,
    description: "Spacious deluxe room with balcony and premium amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "201",
    type: "deluxe",
    price: 280,
    capacity: 3,
    amenities: ["wifi", "tv", "ac", "minibar", "balcony", "room-service"],
    status: "occupied",
    floor: 2,
    description: "Premium deluxe room with ocean view",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "202",
    type: "suite",
    price: 450,
    capacity: 4,
    amenities: ["wifi", "tv", "ac", "minibar", "balcony", "room-service", "jacuzzi", "kitchenette"],
    status: "available",
    floor: 2,
    description: "Luxury suite with separate living area and premium amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "203",
    type: "suite",
    price: 500,
    capacity: 4,
    amenities: ["wifi", "tv", "ac", "minibar", "balcony", "room-service", "jacuzzi", "kitchenette"],
    status: "cleaning",
    floor: 2,
    description: "Presidential suite with panoramic city view",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "301",
    type: "standard",
    price: 180,
    capacity: 2,
    amenities: ["wifi", "tv", "ac", "minibar"],
    status: "available",
    floor: 3,
    description: "Standard room with premium location",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "302",
    type: "deluxe",
    price: 320,
    capacity: 3,
    amenities: ["wifi", "tv", "ac", "minibar", "balcony", "room-service"],
    status: "maintenance",
    floor: 3,
    description: "Deluxe room currently under maintenance",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "303",
    type: "standard",
    price: 180,
    capacity: 2,
    amenities: ["wifi", "tv", "ac", "minibar"],
    status: "available",
    floor: 3,
    description: "Cozy standard room with modern amenities",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    number: "401",
    type: "suite",
    price: 600,
    capacity: 6,
    amenities: ["wifi", "tv", "ac", "minibar", "balcony", "room-service", "jacuzzi", "kitchenette", "dining-area"],
    status: "available",
    floor: 4,
    description: "Penthouse suite with luxury amenities and city skyline view",
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

    console.log("Room seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding rooms:", error)
  } finally {
    await client.close()
  }
}

seedRooms()

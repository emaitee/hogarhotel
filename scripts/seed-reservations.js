const { MongoClient, ObjectId } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"

async function seedReservations() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()

    // Get existing guests and rooms
    const guests = await db.collection("guests").find({}).toArray()
    const rooms = await db.collection("rooms").find({}).toArray()

    if (guests.length === 0 || rooms.length === 0) {
      console.log("Please seed guests and rooms first")
      return
    }

    // Clear existing reservations
    await db.collection("reservations").deleteMany({})
    console.log("Cleared existing reservations")

    const reservations = [
      {
        guestId: guests[0]._id,
        roomId: rooms[0]._id,
        checkInDate: new Date("2024-01-15T15:00:00Z"),
        checkOutDate: new Date("2024-01-18T11:00:00Z"),
        status: "checked-in",
        totalAmount: 144000,
        adults: 2,
        children: 0,
        specialRequests: "Late checkout requested",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        guestId: guests[1]._id,
        roomId: rooms[1]._id,
        checkInDate: new Date("2024-01-16T15:00:00Z"),
        checkOutDate: new Date("2024-01-19T11:00:00Z"),
        status: "confirmed",
        totalAmount: 144000,
        adults: 1,
        children: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        guestId: guests[2]._id,
        roomId: rooms[2]._id,
        checkInDate: new Date("2024-01-17T15:00:00Z"),
        checkOutDate: new Date("2024-01-20T11:00:00Z"),
        status: "confirmed",
        totalAmount: 216000,
        adults: 2,
        children: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        guestId: guests[3]._id,
        roomId: rooms[3]._id,
        checkInDate: new Date("2024-01-14T15:00:00Z"),
        checkOutDate: new Date("2024-01-17T11:00:00Z"),
        status: "checked-in",
        totalAmount: 216000,
        adults: 2,
        children: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        guestId: guests[4]._id,
        roomId: rooms[4]._id,
        checkInDate: new Date("2024-01-13T15:00:00Z"),
        checkOutDate: new Date("2024-01-16T11:00:00Z"),
        status: "checked-out",
        totalAmount: 360000,
        adults: 2,
        children: 0,
        specialRequests: "Anniversary celebration",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        guestId: guests[0]._id,
        roomId: rooms[5]._id,
        checkInDate: new Date("2024-01-18T15:00:00Z"),
        checkOutDate: new Date("2024-01-21T11:00:00Z"),
        status: "confirmed",
        totalAmount: 216000,
        adults: 1,
        children: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const result = await db.collection("reservations").insertMany(reservations)
    console.log(`Inserted ${result.insertedCount} reservations`)

    // Update room statuses based on reservations
    const today = new Date()
    for (const reservation of reservations) {
      const checkIn = new Date(reservation.checkInDate)
      const checkOut = new Date(reservation.checkOutDate)

      let roomStatus = "available"
      if (reservation.status === "checked-in" && today >= checkIn && today < checkOut) {
        roomStatus = "occupied"
      } else if (reservation.status === "checked-out" && today >= checkOut) {
        roomStatus = "cleaning"
      }

      await db.collection("rooms").updateOne({ _id: reservation.roomId }, { $set: { status: roomStatus } })
    }

    console.log("Updated room statuses based on reservations")
    console.log("Reservations seeded successfully!")
  } catch (error) {
    console.error("Error seeding reservations:", error)
  } finally {
    await client.close()
  }
}

seedReservations()

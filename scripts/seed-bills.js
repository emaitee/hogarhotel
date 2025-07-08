const { MongoClient, ObjectId } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"

async function seedBills() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()

    // Clear existing bills
    await db.collection("bills").deleteMany({})
    console.log("Cleared existing bills")

    // Get some reservations to create bills for
    const reservations = await db.collection("reservations").find({}).limit(5).toArray()

    if (reservations.length === 0) {
      console.log("No reservations found. Please seed reservations first.")
      return
    }

    const sampleBills = []

    for (let i = 0; i < reservations.length; i++) {
      const reservation = reservations[i]
      const billNumber = `BILL-${String(i + 1).padStart(6, "0")}`

      const items = [
        {
          _id: new ObjectId(),
          description: `Room ${reservation.room?.number || "N/A"} - ${Math.ceil(Math.random() * 5)} nights`,
          quantity: Math.ceil(Math.random() * 5),
          unitPrice: 150 + Math.random() * 200,
          category: "accommodation",
        },
        {
          _id: new ObjectId(),
          description: "Room Service",
          quantity: 1,
          unitPrice: 25 + Math.random() * 50,
          category: "service",
        },
      ]

      // Calculate totals
      items.forEach((item) => {
        item.total = item.quantity * item.unitPrice
      })

      const subtotal = items.reduce((sum, item) => sum + item.total, 0)
      const tax = subtotal * 0.1
      const total = subtotal + tax

      const statuses = ["pending", "paid", "overdue"]
      const status = statuses[Math.floor(Math.random() * statuses.length)]

      const bill = {
        billNumber,
        reservationId: reservation._id,
        guestId: reservation.guestId,
        roomId: reservation.roomId,
        items,
        subtotal,
        tax,
        total,
        status,
        paymentMethod: status === "paid" ? ["cash", "card", "bank_transfer"][Math.floor(Math.random() * 3)] : undefined,
        paidAt: status === "paid" ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        notes: `Bill for reservation ${reservation._id}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      }

      sampleBills.push(bill)
    }

    // Insert bills
    const result = await db.collection("bills").insertMany(sampleBills)
    console.log(`Inserted ${result.insertedCount} bills`)

    // Show statistics
    const stats = await db
      .collection("bills")
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$total" },
          },
        },
      ])
      .toArray()

    console.log("\nBill Statistics:")
    stats.forEach((stat) => {
      console.log(`${stat._id}: ${stat.count} bills, $${stat.totalAmount.toFixed(2)}`)
    })
  } catch (error) {
    console.error("Error seeding bills:", error)
  } finally {
    await client.close()
  }
}

seedBills()

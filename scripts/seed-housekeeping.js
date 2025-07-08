const { MongoClient, ObjectId } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-management"

const STAFF_MEMBERS = ["Maria Santos", "John Smith", "Ana Rodriguez", "David Johnson", "Lisa Chen", "Carlos Martinez"]

const SAMPLE_TASKS = [
  {
    taskType: "cleaning",
    status: "pending",
    assignedTo: null,
    priority: "medium",
    notes: "Standard room cleaning after checkout",
    estimatedDuration: 45,
    actualDuration: null,
    startedAt: null,
    completedAt: null,
  },
  {
    taskType: "maintenance",
    status: "pending",
    assignedTo: null,
    priority: "high",
    notes: "Air conditioning unit making noise - needs inspection",
    estimatedDuration: 60,
    actualDuration: null,
    startedAt: null,
    completedAt: null,
  },
  {
    taskType: "cleaning",
    status: "in-progress",
    assignedTo: "Maria Santos",
    priority: "medium",
    notes: "Deep cleaning required - guest reported stains",
    estimatedDuration: 60,
    actualDuration: null,
    startedAt: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
    completedAt: null,
  },
  {
    taskType: "inspection",
    status: "in-progress",
    assignedTo: "John Smith",
    priority: "low",
    notes: "Monthly room inspection",
    estimatedDuration: 30,
    actualDuration: null,
    startedAt: new Date(Date.now() - 15 * 60 * 1000), // Started 15 minutes ago
    completedAt: null,
  },
  {
    taskType: "maintenance",
    status: "in-progress",
    assignedTo: "David Johnson",
    priority: "high",
    notes: "Bathroom faucet leaking - urgent repair needed",
    estimatedDuration: 90,
    actualDuration: null,
    startedAt: new Date(Date.now() - 45 * 60 * 1000), // Started 45 minutes ago
    completedAt: null,
  },
  {
    taskType: "cleaning",
    status: "completed",
    assignedTo: "Ana Rodriguez",
    priority: "medium",
    notes: "Post-checkout cleaning completed",
    estimatedDuration: 45,
    actualDuration: 40,
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
    completedAt: new Date(Date.now() - 80 * 60 * 1000), // Completed 80 minutes ago
  },
  {
    taskType: "inspection",
    status: "completed",
    assignedTo: "Lisa Chen",
    priority: "low",
    notes: "Quality check after maintenance work",
    estimatedDuration: 20,
    actualDuration: 25,
    startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // Started 3 hours ago
    completedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // Completed 2.5 hours ago
  },
  {
    taskType: "cleaning",
    status: "pending",
    assignedTo: null,
    priority: "low",
    notes: "Routine weekly deep cleaning",
    estimatedDuration: 90,
    actualDuration: null,
    startedAt: null,
    completedAt: null,
  },
]

async function seedHousekeepingTasks() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()

    // Get existing rooms to assign tasks to
    const rooms = await db.collection("rooms").find({}).toArray()

    if (rooms.length === 0) {
      console.log("No rooms found. Please seed rooms first.")
      return
    }

    console.log(`Found ${rooms.length} rooms`)

    // Clear existing housekeeping tasks
    await db.collection("housekeeping_tasks").deleteMany({})
    console.log("Cleared existing housekeeping tasks")

    // Create tasks with random room assignments
    const tasksToInsert = SAMPLE_TASKS.map((task, index) => {
      const randomRoom = rooms[index % rooms.length]
      return {
        ...task,
        roomId: randomRoom._id,
        createdAt: new Date(Date.now() - (8 - index) * 60 * 60 * 1000), // Spread over last 8 hours
        updatedAt: new Date(),
      }
    })

    // Insert tasks
    const result = await db.collection("housekeeping_tasks").insertMany(tasksToInsert)
    console.log(`Inserted ${result.insertedCount} housekeeping tasks`)

    // Display statistics
    const stats = await db
      .collection("housekeeping_tasks")
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    console.log("\nHousekeeping Tasks by Status:")
    stats.forEach((stat) => {
      console.log(`  ${stat._id}: ${stat.count}`)
    })

    const priorityStats = await db
      .collection("housekeeping_tasks")
      .aggregate([
        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    console.log("\nHousekeeping Tasks by Priority:")
    priorityStats.forEach((stat) => {
      console.log(`  ${stat._id}: ${stat.count}`)
    })

    console.log("\nHousekeeping tasks seeded successfully!")
  } catch (error) {
    console.error("Error seeding housekeeping tasks:", error)
  } finally {
    await client.close()
    console.log("Disconnected from MongoDB")
  }
}

// Run the seeding function
seedHousekeepingTasks().catch(console.error)

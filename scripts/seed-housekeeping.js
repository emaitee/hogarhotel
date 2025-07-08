const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

async function seedHousekeepingTasks() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()

    // Get existing rooms to reference
    const rooms = await db.collection("rooms").find({}).toArray()

    if (rooms.length === 0) {
      console.log("No rooms found. Please seed rooms first.")
      return
    }

    // Clear existing housekeeping tasks
    await db.collection("housekeepingtasks").deleteMany({})
    console.log("Cleared existing housekeeping tasks")

    const housekeepingStaff = ["Maria Garcia", "Carlos Rodriguez", "Ana Martinez", "Luis Fernandez", "Sofia Morales"]

    const taskTypes = ["cleaning", "maintenance", "inspection"]
    const priorities = ["low", "medium", "high"]
    const statuses = ["pending", "in-progress", "completed"]

    const sampleTasks = []

    // Create sample tasks for different rooms
    for (let i = 0; i < 20; i++) {
      const room = rooms[Math.floor(Math.random() * rooms.length)]
      const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)]
      const priority = priorities[Math.floor(Math.random() * priorities.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const assignedTo =
        Math.random() > 0.3 ? housekeepingStaff[Math.floor(Math.random() * housekeepingStaff.length)] : null

      const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week

      const task = {
        roomId: room._id,
        taskType,
        status,
        assignedTo,
        priority,
        notes: getRandomNotes(taskType),
        estimatedDuration: getEstimatedDuration(taskType),
        actualDuration: status === "completed" ? Math.floor(Math.random() * 60) + 15 : null,
        createdAt,
        startedAt: status !== "pending" ? new Date(createdAt.getTime() + Math.random() * 60 * 60 * 1000) : null,
        completedAt: status === "completed" ? new Date(createdAt.getTime() + Math.random() * 4 * 60 * 60 * 1000) : null,
      }

      sampleTasks.push(task)
    }

    // Insert sample tasks
    const result = await db.collection("housekeepingtasks").insertMany(sampleTasks)
    console.log(`Inserted ${result.insertedCount} housekeeping tasks`)

    // Create some specific high-priority tasks
    const urgentTasks = [
      {
        roomId: rooms[0]._id,
        taskType: "maintenance",
        status: "pending",
        assignedTo: null,
        priority: "high",
        notes: "Air conditioning not working - guest complaint",
        estimatedDuration: 120,
        actualDuration: null,
        createdAt: new Date(),
        startedAt: null,
        completedAt: null,
      },
      {
        roomId: rooms[1]._id,
        taskType: "cleaning",
        status: "pending",
        assignedTo: null,
        priority: "high",
        notes: "Deep cleaning required after checkout",
        estimatedDuration: 90,
        actualDuration: null,
        createdAt: new Date(),
        startedAt: null,
        completedAt: null,
      },
    ]

    const urgentResult = await db.collection("housekeepingtasks").insertMany(urgentTasks)
    console.log(`Inserted ${urgentResult.insertedCount} urgent tasks`)

    console.log("Housekeeping tasks seeded successfully!")
  } catch (error) {
    console.error("Error seeding housekeeping tasks:", error)
  } finally {
    await client.close()
  }
}

function getRandomNotes(taskType) {
  const notes = {
    cleaning: [
      "Standard room cleaning",
      "Deep cleaning required",
      "Guest checkout - full cleaning needed",
      "Stains on carpet need attention",
      "Bathroom needs extra attention",
      "",
    ],
    maintenance: [
      "Leaky faucet reported",
      "Light bulb replacement needed",
      "Air conditioning check",
      "Door lock maintenance",
      "Window cleaning",
      "Furniture repair needed",
      "",
    ],
    inspection: [
      "Monthly room inspection",
      "Safety equipment check",
      "Amenities inventory",
      "Quality control check",
      "",
    ],
  }

  const typeNotes = notes[taskType] || [""]
  return typeNotes[Math.floor(Math.random() * typeNotes.length)]
}

function getEstimatedDuration(taskType) {
  const durations = {
    cleaning: [30, 45, 60, 90],
    maintenance: [60, 90, 120, 180],
    inspection: [15, 30, 45],
  }

  const typeDurations = durations[taskType] || [30]
  return typeDurations[Math.floor(Math.random() * typeDurations.length)]
}

// Run the seeding function
seedHousekeepingTasks().catch(console.error)

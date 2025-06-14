const mongoose = require("mongoose");
const {
  connectToMongoDB,
  disconnectFromMongoDB,
  cleanupDB,
} = require("./test-db");

// Global Test setup
process.env.NODE_ENV = "test";

beforeAll(async () => {
  await connectToMongoDB();
});

// afterEach(async () => {
//   try {
//     // Clear the database after each test
//     await cleanupDB();
//   } catch (error) {
//     console.error("Error during cleanup:", error);
//   }
// });

afterAll(async () => {
  try {
    await cleanupDB();

    if (mongoose.connection.readyState === 1) {
      await disconnectFromMongoDB();
    }

    jest.clearAllTimers();
  } catch (error) {
    console.error("Cleanup error:", error);
  }
});

require("dotenv").config();
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;

async function connectToMongoDB() {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);

    console.log("Connected to test database:", uri);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}

async function disconnectFromMongoDB() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.db.dropDatabase();

      await mongoose.disconnect();
      await mongoServer.stop();
      console.log("Disconnected from MongoDB");
    }
  } catch (err) {
    console.error("MongoDB disconnection error:", err);
    throw err;
  }
}

async function cleanupDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

module.exports = { connectToMongoDB, disconnectFromMongoDB, cleanupDB };

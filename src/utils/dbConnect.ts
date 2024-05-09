import mongoose from "mongoose";

async function dbConnect() {
  // Retrieve MongoDB URI from environment variables
  const DB_URI = <string>process.env.DB;

  try {
    await mongoose.connect(DB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    // Log error and exit the process with an error code if connection fails
    console.error("Could not connect to database:", error);
    process.exit(1);
  }
}

export default dbConnect;

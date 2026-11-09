import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/money-laundering-detection"
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.error(`⚠️ Server will continue without DB. Features limited.`);
    console.error(
      `⚠️ Please ensure MongoDB is running on ${
        process.env.MONGODB_URI || "mongodb://localhost:27017"
      }`
    );
    // Don't exit - allow server to run in offline mode
  }
};

export default connectDB;

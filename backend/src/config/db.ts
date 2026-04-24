import mongoose from "mongoose";
import { logger } from "../utils/logger";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/game-dashboard";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
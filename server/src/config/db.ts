import mongoose from "mongoose";
import { logger } from "../utils/logger";

const MONGO_URI = process.env.MONGO_URI

export const connectDB = async (): Promise<void> => {
  try {
    if (!MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in environment variables"
      );
    }

    await mongoose.connect(
      MONGO_URI
    );

    logger.info(
      "MongoDB connected"
    );
  } catch (err) {
    logger.error(
      "MongoDB connection error:",
      err
    );

    process.exit(1);
  }
};
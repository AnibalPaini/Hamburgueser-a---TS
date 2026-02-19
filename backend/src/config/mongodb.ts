import mongoose from "mongoose";
import config from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      config.mongodbUri,
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

import mongoose from "mongoose";
import { env } from "../config/env.js";

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (!env.hasDatabase) {
    console.warn(
      "[db] MONGODB_URI not set — API will run without database until client env is configured.",
    );
    return;
  }

  if (isConnected) return;

  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI);
  isConnected = true;
  console.log("[db] Connected to MongoDB");
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}

export function getDatabaseStatus(): "connected" | "disconnected" | "not_configured" {
  if (!env.hasDatabase) return "not_configured";
  return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
}

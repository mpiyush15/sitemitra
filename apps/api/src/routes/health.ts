import { Router } from "express";
import { env } from "../config/env.js";
import { getDatabaseStatus } from "../db/connection.js";
import { sendSuccess } from "../lib/response.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  return sendSuccess(res, {
    service: "site-mitra-api",
    status: "ok",
    environment: env.NODE_ENV,
    database: getDatabaseStatus(),
    razorpayConfigured: env.hasRazorpay,
    timestamp: new Date().toISOString(),
  });
});

import type { NextFunction, Request, Response } from "express";
import { getDatabaseStatus } from "../db/connection.js";
import { ServiceUnavailableError } from "../lib/errors.js";

export function requireDatabase(_req: Request, _res: Response, next: NextFunction) {
  const status = getDatabaseStatus();
  if (status !== "connected") {
    return next(
      new ServiceUnavailableError(
        status === "not_configured"
          ? "Database is not configured. Add MONGODB_URI to enable auth."
          : "Database is not connected",
      ),
    );
  }
  return next();
}

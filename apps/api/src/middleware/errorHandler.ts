import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import { sendError } from "../lib/response.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? `File too large (max ${env.maxUploadBytes / (1024 * 1024)} MB)`
        : err.message;
    return sendError(res, 400, "UPLOAD_ERROR", message);
  }

  if (err instanceof AppError) {
    return sendError(res, err.status, err.code, err.message, err.details);
  }

  console.error("[api] Unhandled error:", err);

  return sendError(
    res,
    500,
    "INTERNAL_ERROR",
    env.NODE_ENV === "production" ? "Something went wrong" : String(err),
  );
}

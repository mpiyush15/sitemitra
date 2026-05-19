import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import { sendError } from "../lib/response.js";

function duplicateKeyMessage(keyPattern: Record<string, unknown> | undefined): string {
  const field = keyPattern ? Object.keys(keyPattern)[0] : undefined;
  if (field === "email") return "Email is already registered";
  if (field === "phone") return "This mobile number is already registered";
  return "Account already exists";
}

function isMongoDuplicateKeyError(
  err: unknown,
): err is { code: number; keyPattern?: Record<string, unknown> } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: number }).code === 11000
  );
}

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

  if (isMongoDuplicateKeyError(err)) {
    const message = duplicateKeyMessage(err.keyPattern);
    return sendError(res, 409, "CONFLICT", message);
  }

  console.error("[api] Unhandled error:", err);

  return sendError(
    res,
    500,
    "INTERNAL_ERROR",
    env.NODE_ENV === "production" ? "Something went wrong" : String(err),
  );
}

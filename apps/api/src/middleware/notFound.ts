import type { Request, Response } from "express";
import { sendError } from "../lib/response.js";

export function notFoundHandler(_req: Request, res: Response) {
  return sendError(res, 404, "NOT_FOUND", "Route not found");
}

import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { sendError } from "./response.js";

type RequestPart = "body" | "query" | "params";

export function validate<T>(schema: ZodType<T>, part: RequestPart = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      return sendError(res, 400, "VALIDATION_ERROR", "Invalid request", {
        issues: result.error.flatten(),
      });
    }

    if (part === "body") {
      req.body = result.data;
      req.validatedBody = result.data;
    } else if (part === "query") {
      req.validatedQuery = result.data;
    } else {
      req.validatedParams = result.data;
    }

    return next();
  };
}

export function getValidatedBody<T>(req: Request): T {
  return req.validatedBody as T;
}

export function getValidatedQuery<T>(req: Request): T {
  return req.validatedQuery as T;
}

export function getValidatedParams<T>(req: Request): T {
  return req.validatedParams as T;
}

import type { Response } from "express";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function sendSuccess<T>(
  res: Response,
  data: T,
  options?: { status?: number; message?: string },
) {
  const body: ApiSuccess<T> = {
    success: true,
    data,
    ...(options?.message ? { message: options.message } : {}),
  };
  return res.status(options?.status ?? 200).json(body);
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  const body: ApiError = {
    success: false,
    error: { code, message, ...(details !== undefined ? { details } : {}) },
  };
  return res.status(status).json(body);
}

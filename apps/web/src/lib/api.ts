import type { ApiError, ApiSuccess } from "@/types/api";
import { getStoredToken } from "@/lib/session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const token = typeof window !== "undefined" ? getStoredToken() : null;

  const response = await fetch(`${baseUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    credentials: "include",
  });

  const payload = (await response.json()) as ApiSuccess<T> | ApiError;

  if (!response.ok || !payload.success) {
    const error = payload.success
      ? { code: "HTTP_ERROR", message: response.statusText }
      : payload.error;
    throw new ApiClientError(
      response.status,
      error.code,
      error.message,
      "details" in error ? error.details : undefined,
    );
  }

  return payload.data;
}

/** Multipart upload (do not set Content-Type — browser sets boundary). */
export async function apiFetchFormData<T>(path: string, formData: FormData): Promise<T> {
  const token = typeof window !== "undefined" ? getStoredToken() : null;

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
    credentials: "include",
  });

  const payload = (await response.json()) as ApiSuccess<T> | ApiError;

  if (!response.ok || !payload.success) {
    const error = payload.success
      ? { code: "HTTP_ERROR", message: response.statusText }
      : payload.error;
    throw new ApiClientError(
      response.status,
      error.code,
      error.message,
      "details" in error ? error.details : undefined,
    );
  }

  return payload.data;
}

export function getApiBaseUrl() {
  return baseUrl;
}

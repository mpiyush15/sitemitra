import jwt from "jsonwebtoken";
import type { Response } from "express";
import { env } from "../config/env.js";
import { AUTH_COOKIE_NAME } from "./constants.js";
import type { MembershipPlan, Role } from "./constants.js";
import { UnauthorizedError } from "./errors.js";

export type JwtPayload = {
  sub: string;
  role: Role;
  membershipPlan: MembershipPlan;
};

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, env.jwtSecret) as JwtPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });
}

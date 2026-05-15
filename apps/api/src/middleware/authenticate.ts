import type { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE_NAME } from "../lib/constants.js";
import { UnauthorizedError } from "../lib/errors.js";
import { verifyAccessToken } from "../lib/jwt.js";
import { userRepository } from "../repositories/user.repository.js";
import { businessProfileRepository } from "../repositories/business-profile.repository.js";

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }

  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
  if (typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken;
  }

  return null;
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new UnauthorizedError("Authentication required");
    }

    const payload = verifyAccessToken(token);
    const user = await userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedError("User no longer exists");
    }

    const businessProfile = await businessProfileRepository.findByUserId(
      user._id.toString(),
    );

    req.auth = {
      sub: user._id.toString(),
      role: user.role,
      membershipPlan: user.membershipPlan,
    };
    req.user = user;
    req.businessProfile = businessProfile;

    return next();
  } catch (error) {
    return next(error);
  }
}

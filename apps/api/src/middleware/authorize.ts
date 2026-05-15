import type { NextFunction, Request, Response } from "express";
import {
  MEMBERSHIP_PLANS,
  ROLES,
  type MembershipPlan,
  type Role,
} from "../lib/constants.js";
import { ForbiddenError, UnauthorizedError } from "../lib/errors.js";

export function requireRoles(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.auth.role)) {
      return next(new ForbiddenError("Insufficient permissions"));
    }

    return next();
  };
}

export function requireMembership(...plans: MembershipPlan[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(new UnauthorizedError());
    }

    if (!plans.includes(req.auth.membershipPlan)) {
      return next(
        new ForbiddenError("This feature requires an upgraded membership plan"),
      );
    }

    return next();
  };
}

export const requireAdmin = requireRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN);
export const requireSuperAdmin = requireRoles(ROLES.SUPER_ADMIN);
export const requireBusiness = requireRoles(ROLES.BUSINESS);
export const requireStandard = requireMembership(MEMBERSHIP_PLANS.STANDARD);

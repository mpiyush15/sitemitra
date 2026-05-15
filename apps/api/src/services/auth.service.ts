import bcrypt from "bcryptjs";
import { MEMBERSHIP_PLANS, ROLES } from "../lib/constants.js";
import { ConflictError, NotFoundError, UnauthorizedError } from "../lib/errors.js";
import {
  clearAuthCookie,
  setAuthCookie,
  signAccessToken,
  type JwtPayload,
} from "../lib/jwt.js";
import { slugify, uniqueSlug } from "../lib/slug.js";
import { toSafeBusinessProfile, toSafeUser } from "../lib/serializers.js";
import {
  businessProfileRepository,
  userRepository,
} from "../repositories/index.js";
import type { Response } from "express";
import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";

const SALT_ROUNDS = 12;

async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

async function buildUniqueBusinessSlug(businessName: string) {
  const base = slugify(businessName);
  let slug = base;
  let attempt = 0;

  while (await businessProfileRepository.slugExists(slug)) {
    attempt += 1;
    slug = uniqueSlug(base, String(attempt));
  }

  return slug;
}

function createTokenForUser(user: {
  _id: { toString(): string };
  role: JwtPayload["role"];
  membershipPlan: JwtPayload["membershipPlan"];
}) {
  return signAccessToken({
    sub: user._id.toString(),
    role: user.role,
    membershipPlan: user.membershipPlan,
  });
}

export const authService = {
  async register(input: RegisterInput, res: Response) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError("Email is already registered");
    }

    const passwordHash = await hashPassword(input.password);

    const user = await userRepository.create({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone?.trim() ?? "",
      city: input.role === ROLES.USER ? (input.city?.trim() ?? "") : "",
      passwordHash,
      role: input.role,
    });

    let businessProfile = null;

    if (
      input.role === ROLES.BUSINESS &&
      input.businessName &&
      input.category &&
      input.city
    ) {
      const slug = await buildUniqueBusinessSlug(input.businessName);
      businessProfile = await businessProfileRepository.create({
        userId: user._id.toString(),
        businessName: input.businessName,
        slug,
        category: input.category,
        city: input.city,
        phoneNumber: input.phone ?? "",
        whatsappNumber: input.phone ?? "",
        email: input.email,
        isPublished: false,
      });
    }

    const token = createTokenForUser(user);
    setAuthCookie(res, token);

    return {
      user: toSafeUser(user),
      businessProfile: businessProfile
        ? toSafeBusinessProfile(businessProfile)
        : null,
      token,
    };
  },

  async login(input: LoginInput, res: Response) {
    const user = await userRepository.findByEmailWithPassword(input.email);
    if (!user?.passwordHash) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const businessProfile = await businessProfileRepository.findByUserId(
      user._id.toString(),
    );

    const token = createTokenForUser(user);
    setAuthCookie(res, token);

    return {
      user: toSafeUser(user),
      businessProfile: businessProfile
        ? toSafeBusinessProfile(businessProfile)
        : null,
      token,
    };
  },

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const businessProfile = await businessProfileRepository.findByUserId(userId);

    return {
      user: toSafeUser(user),
      businessProfile: businessProfile
        ? toSafeBusinessProfile(businessProfile)
        : null,
    };
  },

  logout(res: Response) {
    clearAuthCookie(res);
    return { loggedOut: true };
  },

  isStandardMember(membershipPlan: string) {
    return membershipPlan === MEMBERSHIP_PLANS.STANDARD;
  },
};

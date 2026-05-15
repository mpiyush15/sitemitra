import type { UserDocument } from "../models/user.model.js";
import type { BusinessProfileDocument } from "../models/business-profile.model.js";
import type { JwtPayload } from "../lib/jwt.js";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
      user?: UserDocument;
      businessProfile?: BusinessProfileDocument | null;
      validatedQuery?: unknown;
      validatedParams?: unknown;
      validatedBody?: unknown;
    }
  }
}

export {};

import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../lib/asyncHandler.js";
import { sendSuccess } from "../lib/response.js";
import { validate } from "../lib/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { authService } from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

export const authRouter = Router();

const authCredentialRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Too many auth attempts. Please try again later.",
    },
  },
});

authRouter.use(requireDatabase);

authRouter.post(
  "/register",
  authCredentialRateLimit,
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.body, res);
    return sendSuccess(res, result, {
      status: 201,
      message: "Registration successful",
    });
  }),
);

authRouter.post(
  "/login",
  authCredentialRateLimit,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body, res);
    return sendSuccess(res, result, { message: "Login successful" });
  }),
);

authRouter.get(
  "/profile",
  authenticate,
  asyncHandler(async (req, res) => {
    const result = await authService.getProfile(req.auth!.sub);
    return sendSuccess(res, result);
  }),
);

authRouter.post(
  "/logout",
  asyncHandler(async (_req, res) => {
    const result = authService.logout(res);
    return sendSuccess(res, result, { message: "Logged out" });
  }),
);

import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { authRouter } from "./routes/auth.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { businessRouter, categoryRouter } from "./routes/public.js";
import { adminAnalyticsRouter } from "./routes/admin-analytics.js";
import {
  adminMembershipRouter,
  adminPlatformRouter,
  plansRouter,
} from "./routes/admin-platform.js";
import { adminCityRouter, cityRouter } from "./routes/cities.js";
import { adminSocialReelRouter, socialReelRouter } from "./routes/social-reels.js";
import { bannersPublicRouter } from "./routes/banners-public.js";
import { healthRouter } from "./routes/health.js";
import { searchRouter } from "./routes/search.js";
import { customerRouter } from "./routes/customer.js";

function isLocalDevServer() {
  return /localhost|127\.0\.0\.1/.test(env.API_URL);
}

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  const localDev = isLocalDevServer();

  function isOriginAllowed(origin: string): boolean {
    if (localDev) {
      return /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(
        origin,
      );
    }
    return env.corsOrigins.includes(origin);
  }

  // Always first — manual CORS (cors package was not emitting Allow-Origin with our setup).
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowed = Boolean(origin && isOriginAllowed(origin));
    if (allowed && origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    if (req.method === "OPTIONS") {
      if (allowed) {
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        );
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      }
      res.status(204).end();
      return;
    }
    next();
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/categories", categoryRouter);
  app.use("/api/cities", cityRouter);
  app.use("/api/plans", plansRouter);
  app.use("/api/banners", bannersPublicRouter);
  app.use("/api/admin", adminPlatformRouter);
  app.use("/api/admin/membership", adminMembershipRouter);
  app.use("/api/admin/analytics", adminAnalyticsRouter);
  app.use("/api/admin/cities", adminCityRouter);
  app.use("/api/social-reels", socialReelRouter);
  app.use("/api/admin/social-reels", adminSocialReelRouter);
  app.use("/api/businesses", businessRouter);
  app.use("/api/customer", customerRouter);
  app.use("/api/search", searchRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

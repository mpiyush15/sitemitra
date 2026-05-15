import { config } from "dotenv";
import { z } from "zod";

config();

const PLACEHOLDER_RAZORPAY_KEY_ID = "rzp_placeholder";
const PLACEHOLDER_RAZORPAY_KEY_SECRET = "placeholder_secret";
const DEFAULT_STANDARD_PLAN_AMOUNT_PAISE = 99900;

const optionalString = (fallback: string) =>
  z
    .string()
    .optional()
    .transform((v) => v?.trim() || fallback);

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_URL: z.string().url().default("http://localhost:4000"),
  MONGODB_URI: z.string().default(""),
  JWT_SECRET: z.string().default(""),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  RAZORPAY_KEY_ID: optionalString(PLACEHOLDER_RAZORPAY_KEY_ID),
  RAZORPAY_KEY_SECRET: optionalString(PLACEHOLDER_RAZORPAY_KEY_SECRET),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().default(""),
  STANDARD_PLAN_AMOUNT_PAISE: z.coerce
    .number()
    .int()
    .nonnegative()
    .optional()
    .transform((v) => (v != null && v > 0 ? v : DEFAULT_STANDARD_PLAN_AMOUNT_PAISE)),
  STANDARD_PLAN_DURATION_DAYS: z.coerce.number().int().positive().default(365),
  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(5),
  /** Optional: custom S3-compatible endpoint (R2, MinIO). Leave empty for AWS. */
  S3_ENDPOINT: z.string().optional().default(""),
  AWS_ACCESS_KEY_ID: z.string().optional().default(""),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(""),
  AWS_REGION: z.string().default("ap-south-1"),
  S3_BUCKET_NAME: z.string().optional().default(""),
  S3_PREFIX: z.string().optional().default("site-mitra/"),
  /** Public origin for object URLs (no trailing slash), e.g. CloudFront or https://bucket.s3.region.amazonaws.com */
  S3_PUBLIC_BASE_URL: z.string().optional().default(""),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const raw = parsed.data;
const isProd = raw.NODE_ENV === "production";

if (isProd) {
  const missing: string[] = [];
  if (!raw.MONGODB_URI) missing.push("MONGODB_URI");
  if (!raw.JWT_SECRET) missing.push("JWT_SECRET");

  if (missing.length > 0) {
    console.error(`Missing required production env: ${missing.join(", ")}`);
    process.exit(1);
  }

  const cors = raw.CORS_ORIGIN.toLowerCase();
  if (cors.includes("localhost") || cors.includes("127.0.0.1")) {
    console.warn(
      "[env] CORS_ORIGIN still points at localhost — set to your Vercel URL in production",
    );
  }
  if (raw.API_URL.includes("localhost") || raw.API_URL.includes("127.0.0.1")) {
    console.warn(
      "[env] API_URL still points at localhost — set to your Railway public URL in production",
    );
  }
}

function normalizeS3Prefix(prefix: string): string {
  const t = prefix.trim() || "site-mitra/";
  return t.endsWith("/") ? t : `${t}/`;
}

const s3Prefix = normalizeS3Prefix(raw.S3_PREFIX);
const s3Enabled = Boolean(
  raw.S3_BUCKET_NAME && raw.AWS_ACCESS_KEY_ID && raw.AWS_SECRET_ACCESS_KEY,
);

const s3PublicBaseUrl =
  raw.S3_PUBLIC_BASE_URL.trim() ||
  (raw.S3_BUCKET_NAME
    ? `https://${raw.S3_BUCKET_NAME}.s3.${raw.AWS_REGION}.amazonaws.com`
    : "");

export const env = {
  ...raw,
  jwtSecret:
    raw.JWT_SECRET || (isProd ? "" : "dev-jwt-secret-replace-before-production"),
  corsOrigins: raw.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean),
  hasDatabase: Boolean(raw.MONGODB_URI),
  hasRazorpay:
    raw.RAZORPAY_KEY_ID !== PLACEHOLDER_RAZORPAY_KEY_ID &&
    raw.RAZORPAY_KEY_SECRET !== PLACEHOLDER_RAZORPAY_KEY_SECRET,
  maxUploadBytes: raw.MAX_UPLOAD_SIZE_MB * 1024 * 1024,
  s3: {
    enabled: s3Enabled,
    bucket: raw.S3_BUCKET_NAME,
    prefix: s3Prefix,
    region: raw.AWS_REGION,
    accessKeyId: raw.AWS_ACCESS_KEY_ID,
    secretAccessKey: raw.AWS_SECRET_ACCESS_KEY,
    endpoint: raw.S3_ENDPOINT.trim() || undefined,
    publicBaseUrl: s3PublicBaseUrl.replace(/\/$/, ""),
  },
};

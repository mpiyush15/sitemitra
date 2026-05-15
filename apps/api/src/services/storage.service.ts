import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { AppError, ServiceUnavailableError } from "../lib/errors.js";

const ALLOWED_UPLOAD_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export function isAllowedBannerMime(mimeType: string): boolean {
  return ALLOWED_UPLOAD_MIME.has(mimeType);
}

const MAX_INPUT_BYTES = 12 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
const MAX_WIDTH_PX = 1600;
const WEBP_QUALITY = 82;

/** Business logo & listing thumbnail — 1:1 cover crop */
export const BUSINESS_SQUARE_IMAGE_PX = 400;
/** Business profile cover banner */
export const BUSINESS_BANNER_WIDTH_PX = 1080;
export const BUSINESS_BANNER_HEIGHT_PX = 480;

function getS3Client(): S3Client | null {
  if (!env.s3.enabled || !env.s3.bucket) return null;
  return new S3Client({
    region: env.s3.region,
    credentials: {
      accessKeyId: env.s3.accessKeyId,
      secretAccessKey: env.s3.secretAccessKey,
    },
    ...(env.s3.endpoint
      ? { endpoint: env.s3.endpoint, forcePathStyle: true }
      : {}),
  });
}

/**
 * Resize + WebP encode for web delivery. Throws AppError on bad input.
 */
async function assertImageInput(buffer: Buffer, mimeType: string): Promise<void> {
  if (buffer.length > MAX_INPUT_BYTES) {
    throw new AppError(400, "FILE_TOO_LARGE", "Image is too large before processing");
  }
  if (!ALLOWED_UPLOAD_MIME.has(mimeType)) {
    throw new AppError(
      400,
      "INVALID_IMAGE_TYPE",
      "Only JPEG, PNG, or WebP images are allowed",
    );
  }
}

/** Center-crop to exact square dimensions (logo, listing thumbnail). */
export async function compressImageToSquareWebp(
  buffer: Buffer,
  mimeType: string,
  sizePx: number = BUSINESS_SQUARE_IMAGE_PX,
): Promise<Buffer> {
  await assertImageInput(buffer, mimeType);
  try {
    return await sharp(buffer)
      .rotate()
      .resize(sizePx, sizePx, { fit: "cover", position: "centre" })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer();
  } catch (err) {
    console.error("[storage] square crop error:", err);
    throw new AppError(400, "IMAGE_PROCESS_FAILED", "Could not process this image file");
  }
}

/** Center-crop to exact banner dimensions (profile cover). */
export async function compressImageToBannerWebp(
  buffer: Buffer,
  mimeType: string,
  widthPx: number = BUSINESS_BANNER_WIDTH_PX,
  heightPx: number = BUSINESS_BANNER_HEIGHT_PX,
): Promise<Buffer> {
  await assertImageInput(buffer, mimeType);
  try {
    return await sharp(buffer)
      .rotate()
      .resize(widthPx, heightPx, { fit: "cover", position: "centre" })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer();
  } catch (err) {
    console.error("[storage] banner crop error:", err);
    throw new AppError(400, "IMAGE_PROCESS_FAILED", "Could not process this image file");
  }
}

export async function compressImageToWebp(buffer: Buffer, mimeType: string): Promise<Buffer> {
  await assertImageInput(buffer, mimeType);

  try {
    let pipeline = sharp(buffer).rotate();
    const meta = await pipeline.metadata();
    if (meta.width && meta.width > MAX_WIDTH_PX) {
      pipeline = pipeline.resize({
        width: MAX_WIDTH_PX,
        withoutEnlargement: true,
      });
    }

    const out = await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer();

    if (out.length > MAX_OUTPUT_BYTES) {
      const smaller = await sharp(buffer)
        .rotate()
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 72, effort: 4 })
        .toBuffer();
      if (smaller.length > MAX_OUTPUT_BYTES) {
        throw new AppError(400, "IMAGE_TOO_LARGE", "Could not compress image under the size limit");
      }
      return smaller;
    }

    return out;
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error("[storage] sharp error:", err);
    throw new AppError(400, "IMAGE_PROCESS_FAILED", "Could not process this image file");
  }
}

export function assertUploadsConfigured(): void {
  if (!env.s3.enabled) {
    throw new ServiceUnavailableError(
      "Image uploads are not configured. Set S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY.",
    );
  }
}

/**
 * Upload processed WebP bytes to S3 under banners/. Returns public HTTPS URL.
 */
export async function uploadHeroBannerWebp(webpBuffer: Buffer): Promise<string> {
  assertUploadsConfigured();
  const client = getS3Client();
  if (!client || !env.s3.bucket) {
    throw new ServiceUnavailableError("S3 client is not available");
  }

  const key = `${env.s3.prefix}banners/${randomUUID()}.webp`;

  await client.send(
    new PutObjectCommand({
      Bucket: env.s3.bucket,
      Key: key,
      Body: webpBuffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${env.s3.publicBaseUrl}/${key}`;
}

async function putWebpObject(key: string, webpBuffer: Buffer): Promise<string> {
  assertUploadsConfigured();
  const client = getS3Client();
  if (!client || !env.s3.bucket) {
    throw new ServiceUnavailableError("S3 client is not available");
  }

  await client.send(
    new PutObjectCommand({
      Bucket: env.s3.bucket,
      Key: key,
      Body: webpBuffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${env.s3.publicBaseUrl}/${key}`;
}

export async function uploadBusinessLogoWebp(
  profileId: string,
  webpBuffer: Buffer,
): Promise<string> {
  const key = `${env.s3.prefix}businesses/${profileId}/logo/${randomUUID()}.webp`;
  return putWebpObject(key, webpBuffer);
}

export async function uploadBusinessProfileBannerWebp(
  profileId: string,
  webpBuffer: Buffer,
): Promise<string> {
  const key = `${env.s3.prefix}businesses/${profileId}/banner/${randomUUID()}.webp`;
  return putWebpObject(key, webpBuffer);
}

export async function uploadBusinessThumbnailWebp(
  profileId: string,
  webpBuffer: Buffer,
): Promise<string> {
  const key = `${env.s3.prefix}businesses/${profileId}/thumbnail/${randomUUID()}.webp`;
  return putWebpObject(key, webpBuffer);
}

export async function uploadBusinessGalleryImageWebp(
  profileId: string,
  webpBuffer: Buffer,
): Promise<string> {
  const key = `${env.s3.prefix}businesses/${profileId}/gallery/${randomUUID()}.webp`;
  return putWebpObject(key, webpBuffer);
}

/** Best-effort delete; ignores failures (object may already be gone). */
export async function deleteObjectByPublicUrl(publicUrl: string): Promise<void> {
  if (!env.s3.enabled || !env.s3.bucket || !publicUrl.startsWith(env.s3.publicBaseUrl)) {
    return;
  }

  const key = publicUrl.slice(env.s3.publicBaseUrl.length + 1);
  if (!key || key.includes("..")) return;

  const client = getS3Client();
  if (!client) return;

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: env.s3.bucket,
        Key: key,
      }),
    );
  } catch (err) {
    console.warn("[storage] deleteObject failed:", key, err);
  }
}

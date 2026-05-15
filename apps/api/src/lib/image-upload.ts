import multer from "multer";
import { env } from "../config/env.js";
import { AppError } from "./errors.js";
import { isAllowedBannerMime } from "../services/storage.service.js";

export const profileImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadBytes },
  fileFilter: (_req, file, cb) => {
    if (isAllowedBannerMime(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          400,
          "INVALID_IMAGE_TYPE",
          "Only JPEG, PNG, or WebP images are allowed",
        ),
      );
    }
  },
});

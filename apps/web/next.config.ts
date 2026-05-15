import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const s3Host = process.env.NEXT_PUBLIC_S3_IMAGE_HOST?.trim();

const nextConfig: NextConfig = {
  turbopack: {
    root: appDir,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(s3Host
        ? [
            {
              protocol: "https" as const,
              hostname: s3Host,
              pathname: "/**",
            },
          ]
        : [
            {
              protocol: "https" as const,
              hostname: "*.s3.*.amazonaws.com",
              pathname: "/**",
            },
            {
              protocol: "https" as const,
              hostname: "*.s3.amazonaws.com",
              pathname: "/**",
            },
          ]),
    ],
  },
};

export default nextConfig;

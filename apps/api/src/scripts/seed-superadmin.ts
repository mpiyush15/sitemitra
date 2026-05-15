import bcrypt from "bcryptjs";
import { config } from "dotenv";
import mongoose from "mongoose";
import { ROLES } from "../lib/constants.js";
import { UserModel } from "../models/user.model.js";

config();

const SUPER_ADMIN_EMAIL = "super@sitemitra.com";
const SUPER_ADMIN_NAME = "Site Mitra Super Admin";
const SALT_ROUNDS = 12;

async function main() {
  const uri = process.env.MONGODB_URI;
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD;

  if (!uri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }

  if (!password) {
    console.error("Set SEED_SUPER_ADMIN_PASSWORD in apps/api/.env to run this script");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const email = SUPER_ADMIN_EMAIL.toLowerCase();

  const existing = await UserModel.findOne({ email }).select("+passwordHash");

  if (existing) {
    existing.fullName = SUPER_ADMIN_NAME;
    existing.passwordHash = passwordHash;
    existing.role = ROLES.SUPER_ADMIN;
    existing.isVerified = true;
    await existing.save();
    console.log(`Updated super admin: ${email}`);
  } else {
    await UserModel.create({
      fullName: SUPER_ADMIN_NAME,
      email,
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      isVerified: true,
    });
    console.log(`Created super admin: ${email}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

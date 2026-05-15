import { config } from "dotenv";
import mongoose from "mongoose";
import { DEFAULT_CATEGORIES } from "../lib/default-categories.js";
import { CategoryModel } from "../models/category.model.js";

config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }

  await mongoose.connect(uri);

  let created = 0;
  let updated = 0;

  for (const item of DEFAULT_CATEGORIES) {
    const result = await CategoryModel.updateOne(
      { slug: item.slug },
      {
        $set: {
          categoryName: item.categoryName,
          slug: item.slug,
          icon: item.icon,
          sortOrder: item.sortOrder,
          isActive: true,
        },
      },
      { upsert: true },
    );

    if (result.upsertedCount > 0) created += 1;
    else if (result.modifiedCount > 0) updated += 1;
  }

  const total = await CategoryModel.countDocuments({ isActive: true });
  console.log(
    `Categories seeded: ${DEFAULT_CATEGORIES.length} defined, ${created} created, ${updated} updated, ${total} active in DB`,
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

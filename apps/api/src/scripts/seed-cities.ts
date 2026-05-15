import { config } from "dotenv";
import mongoose from "mongoose";
import { DEFAULT_CITIES } from "../lib/default-cities.js";
import { CityModel } from "../models/city.model.js";

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

  for (const item of DEFAULT_CITIES) {
    const result = await CityModel.updateOne(
      { slug: item.slug },
      {
        $set: {
          cityName: item.cityName,
          slug: item.slug,
          sortOrder: item.sortOrder,
          isActive: true,
        },
      },
      { upsert: true },
    );

    if (result.upsertedCount > 0) created += 1;
    else if (result.modifiedCount > 0) updated += 1;
  }

  const total = await CityModel.countDocuments({ isActive: true });
  console.log(
    `Cities seeded: ${DEFAULT_CITIES.length} defined, ${created} created, ${updated} updated, ${total} active in DB`,
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./db/connection.js";

async function main() {
  await connectDatabase();

  const { membershipService } = await import("./services/membership.service.js");
  await membershipService.ensureDefaultPlans();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`[api] Site Mitra API listening on ${env.API_URL}`);
  });
}

main().catch((err) => {
  console.error("[api] Failed to start:", err);
  process.exit(1);
});

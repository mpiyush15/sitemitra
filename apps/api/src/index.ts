import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./db/connection.js";

async function bootstrapDatabase() {
  try {
    await connectDatabase();
    const { membershipService } = await import("./services/membership.service.js");
    await membershipService.ensureDefaultPlans();
    console.log("[api] Database ready");
  } catch (err) {
    console.error("[api] Database init failed (API still running):", err);
  }
}

async function main() {
  const app = createApp();

  app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`[api] Site Mitra API listening on 0.0.0.0:${env.PORT} (${env.API_URL})`);
    void bootstrapDatabase();
  });
}

main().catch((err) => {
  console.error("[api] Failed to start:", err);
  process.exit(1);
});

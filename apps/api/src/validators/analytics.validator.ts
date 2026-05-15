import { z } from "zod";

export const recordProfileViewSchema = z.object({
  sessionId: z.string().trim().min(8).max(64),
});

export type RecordProfileViewInput = z.infer<typeof recordProfileViewSchema>;

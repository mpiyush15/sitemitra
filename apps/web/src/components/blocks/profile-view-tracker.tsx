"use client";

import { useEffect } from "react";
import { getOrCreateVisitorSessionId, recordProfileView } from "@/lib/analytics";

type ProfileViewTrackerProps = {
  slug: string;
};

export function ProfileViewTracker({ slug }: ProfileViewTrackerProps) {
  useEffect(() => {
    const storageKey = `site-mitra:profile-view:${slug}`;
    if (sessionStorage.getItem(storageKey)) return;

    const sessionId = getOrCreateVisitorSessionId();
    if (!sessionId) return;

    recordProfileView(slug, sessionId)
      .then(() => {
        sessionStorage.setItem(storageKey, "1");
      })
      .catch(() => {
        // Non-blocking analytics
      });
  }, [slug]);

  return null;
}

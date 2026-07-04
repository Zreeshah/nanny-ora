"use client";

import { useEffect } from "react";
import { recordProfileView } from "@/server/actions/engagement";

/** Invisible: records one profile view on mount. Best-effort, fire-and-forget. */
export default function ViewTracker({ nannyId }: { nannyId: string }) {
  useEffect(() => {
    void recordProfileView(nannyId);
  }, [nannyId]);
  return null;
}

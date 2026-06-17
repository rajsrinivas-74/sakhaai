"use client";

import { useEffect, useState } from "react";
import type { Overlay } from "@/lib/workforce-store";

const EMPTY: Overlay = { commitments: [], events: [], retentionFlags: [] };

/**
 * Polls the workforce store so the Manager and HR lenses reflect a freshly
 * committed path within seconds — the live half of the golden thread.
 */
export function useOverlay(pollMs = 4000): Overlay {
  const [overlay, setOverlay] = useState<Overlay>(EMPTY);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/commitment", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Overlay;
        if (active) setOverlay(data);
      } catch {
        /* offline-safe: keep last known overlay */
      }
    }
    void load();
    const t = setInterval(load, pollMs);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [pollMs]);

  return overlay;
}

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { legacyHashToPath } from "@/lib/routes";

/** Keeps old prototype URLs (/#/methods, /#/r5, /#/access/apply …) working by redirecting to the real routes. */
export function LegacyHashRedirect() {
  const router = useRouter();
  useEffect(() => {
    const go = () => { const p = legacyHashToPath(window.location.hash); if (p) router.replace(p); };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, [router]);
  return null;
}

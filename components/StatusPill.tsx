"use client";
import { useEffect, useState } from "react";
export function StatusPill() {
  const [s, setS] = useState<{ text: string; color: string }>({ text: "Checking…", color: "var(--mute)" });
  useEffect(() => {
    fetch("/api/health").then((r) => r.json()).then((h) => {
      if (!h.keyConfigured) setS({ text: "Key missing", color: "var(--no)" });
      else if (h.upstream === 200 && h.keyEnv === "test") setS({ text: "Sandbox · test key", color: "var(--accent)" });
      else if (h.upstream === 200) setS({ text: "Panta live · mainnet", color: "var(--yes)" });
      else if (h.upstream === 401 || h.upstream === 403) setS({ text: "Key rejected", color: "var(--no)" });
      else setS({ text: "Panta unreachable", color: "var(--accent)" });
    }).catch(() => setS({ text: "Offline", color: "var(--no)" }));
  }, []);
  return (
    <span className="hidden items-center gap-2 text-xs md:inline-flex mute">
      <span style={{ width: 8, height: 8, borderRadius: 99, background: s.color }} />{s.text}
    </span>
  );
}

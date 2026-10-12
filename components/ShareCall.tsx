"use client";
import { useState } from "react";
import { callPath } from "@/lib/panta/share";

export function ShareCall({ id, title, side, entry, stake }: { id: string; title: string; side: "YES" | "NO"; entry: number; stake?: number }) {
  const [copied, setCopied] = useState(false);
  const url = () => (typeof window === "undefined" ? "" : window.location.origin) + callPath({ id, side, entry, stake });
  const tweet = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I called ${side} at ${Math.round(entry * 100)}¢: ${title}`)}&url=${encodeURIComponent(url())}`, "_blank");
  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn btn-ghost" onClick={async () => { await navigator.clipboard.writeText(url()); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>{copied ? "Link copied" : "Copy call link"}</button>
      <button className="btn btn-ghost" onClick={tweet}>Post on X</button>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { pantaGet } from "@/lib/panta/server";
import { toMarket, cents } from "@/lib/panta/normalize";
import { OddsRibbon } from "@/components/OddsRibbon";

type P = { params: Promise<{ id: string }>; searchParams: Promise<{ side?: string; entry?: string; stake?: string }> };

async function load({ params, searchParams }: P) {
  const { id } = await params; const sp = await searchParams;
  const side: "YES" | "NO" = sp.side === "NO" ? "NO" : "YES";
  const entry = Math.min(0.99, Math.max(0.01, Number(sp.entry) || 0.5));
  const stake = Number(sp.stake) || 0;
  const raw = await pantaGet(`markets/${id}/`);
  const m = raw ? toMarket(raw) : undefined;
  const now = m?.yes === undefined ? undefined : side === "YES" ? m.yes : 1 - m.yes;
  return { id, side, entry, stake, m, now };
}

export async function generateMetadata(p: P): Promise<Metadata> {
  const { side, entry, m, now } = await load(p);
  const title = m?.title ?? "Prediction market call";
  const img = `/api/og?${new URLSearchParams({ title, side, entry: String(entry), ...(now !== undefined ? { now: String(now) } : {}) })}`;
  return { title: `Called ${side} at ${Math.round(entry * 100)}¢: ${title}`, openGraph: { title: `Called ${side} at ${Math.round(entry * 100)}¢`, description: title, images: [img] }, twitter: { card: "summary_large_image", images: [img] } };
}

export default async function CallPage(p: P) {
  const { id, side, entry, stake, m, now } = await load(p);
  const move = now !== undefined ? Math.round((now - entry) * 100) : undefined;
  const payout = stake ? stake / entry : undefined;
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="card space-y-5 p-6">
        <p className="mute text-sm">A call on Panta</p>
        <h1 className="text-2xl">{m?.title ?? "Market unavailable"}</h1>
        <div className="flex flex-wrap items-center gap-4">
          <span className="rounded-xl px-4 py-2 text-lg font-bold" style={{ background: side === "YES" ? "var(--yes)" : "var(--no)", color: "#04231A" }}>Called {side} at {cents(entry)}</span>
          {move !== undefined && <span className="text-lg" style={{ color: move >= 0 ? "var(--yes)" : "var(--no)" }}>now {cents(now)} ({move >= 0 ? "+" : ""}{move}¢)</span>}
        </div>
        {payout && <p className="mute text-sm">A ${stake.toFixed(2)} position returns ${payout.toFixed(2)} if {side} resolves true.</p>}
        <OddsRibbon yes={m?.yes} large />
      </div>
      <div className="flex gap-2"><Link className="btn flex-1" href={`/markets/${id}`}>Trade this market</Link><Link className="btn btn-ghost" href="/">Browse markets</Link></div>
      <p className="mute text-center text-xs">Calls are read from the URL and priced live from Panta. Not financial advice.</p>
    </div>
  );
}

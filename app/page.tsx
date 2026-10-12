"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listMarkets, getCategories } from "@/lib/panta/client";
import { listOf, toMarket, pct, usd, type Market } from "@/lib/panta/normalize";
import { ErrorBox } from "@/components/ErrorBox";

export default function Home() {
  const [markets, setMarkets] = useState<Market[] | null>(null);
  const [cats, setCats] = useState<string[]>([]);
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    getCategories().then((b) => setCats(listOf(b).map((c: any) => String(c.slug ?? c.name ?? c)))).catch(() => {});
  }, []);
  useEffect(() => {
    setMarkets(null); setError(undefined);
    listMarkets(cat ? `?category=${encodeURIComponent(cat)}` : "")
      .then((b) => setMarkets(listOf(b).map(toMarket)))
      .catch(setError);
  }, [cat]);

  const shown = (markets ?? []).filter((m) => m.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Live Panta markets</h1>
      <div className="flex flex-wrap gap-3">
        <input className="input max-w-xs" placeholder="Search markets" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input max-w-xs" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <ErrorBox error={error} />
      {markets === null && !error && <p style={{ color: "var(--mute)" }}>Loading markets from Panta…</p>}
      {markets && shown.length === 0 && <p style={{ color: "var(--mute)" }}>No markets match. Clear the search or pick another category.</p>}
      <div className="grid gap-3 md:grid-cols-2">
        {shown.map((m) => (
          <Link key={m.id} href={`/markets/${m.id}`} className="panel block p-4 hover:border-[var(--accent)]">
            <div className="text-sm" style={{ color: "var(--mute)" }}>{m.category ?? "Market"}{m.status ? ` · ${m.status}` : ""}</div>
            <div className="mt-1 font-medium">{m.title}</div>
            <div className="mt-3 flex gap-4 text-sm">
              <span style={{ color: "var(--yes)" }}>YES {pct(m.yes)}</span>
              <span style={{ color: "var(--no)" }}>NO {pct(m.no)}</span>
              <span className="ml-auto" style={{ color: "var(--mute)" }}>Vol {usd(m.volume)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

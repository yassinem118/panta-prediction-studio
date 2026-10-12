"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { listMarkets, getCategories } from "@/lib/panta/client";
import { listOf, nextCursor, toMarket, usd, type Market } from "@/lib/panta/normalize";
import { ErrorBox } from "@/components/ErrorBox";
import { MarketCard } from "@/components/MarketCard";

export default function Home() {
  const [markets, setMarkets] = useState<Market[] | null>(null);
  const [cursor, setCursor] = useState<string>();
  const [cats, setCats] = useState<string[]>([]);
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"volume" | "contested">("volume");
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => { getCategories().then((b) => setCats(listOf(b).map((c: any) => String(c.slug ?? c.name ?? c)))).catch(() => {}); }, []);

  const load = useCallback(async (reset: boolean, cur?: string) => {
    const qs = new URLSearchParams(); if (cat) qs.set("category", cat); if (cur) qs.set("cursor", cur);
    try {
      const body = await listMarkets(qs.toString() ? `?${qs}` : "");
      const rows = listOf(body).map(toMarket);
      setMarkets((prev) => (reset || !prev ? rows : [...prev, ...rows]));
      setCursor(nextCursor(body));
    } catch (e) { setError(e); }
  }, [cat]);

  useEffect(() => { setMarkets(null); setError(undefined); load(true); }, [load]);

  const shown = useMemo(() => {
    const f = (markets ?? []).filter((m) => m.title.toLowerCase().includes(q.toLowerCase()));
    return [...f].sort((a, b) => sort === "volume" ? (b.volume ?? 0) - (a.volume ?? 0) : Math.abs((a.yes ?? 0.5) - 0.5) - Math.abs((b.yes ?? 0.5) - 0.5));
  }, [markets, q, sort]);

  const totalVol = (markets ?? []).reduce((s, m) => s + (m.volume ?? 0), 0);
  const hottest = [...(markets ?? [])].sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))[0];

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h1 className="text-3xl">Every Panta market, with an edge.</h1>
        <p className="mute max-w-2xl">Browse live markets, size your bet with the edge calculator, trade with your own wallet, and share your call with a link that tracks how it ages.</p>
        {markets && markets.length > 0 && (
          <div className="kv" style={{ maxWidth: 640 }}>
            <div><small>Markets loaded</small><b>{markets.length}</b></div>
            <div><small>Combined volume</small><b>{usd(totalVol)}</b></div>
            <div><small>Most traded</small><b style={{ fontSize: ".85rem", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{hottest?.title}</b></div>
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <input className="input" style={{ maxWidth: 260 }} placeholder="Search markets" aria-label="Search markets" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" style={{ maxWidth: 190 }} aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <option value="volume">Most traded</option>
          <option value="contested">Most contested (near 50¢)</option>
        </select>
        <div className="flex flex-wrap gap-2">
          <button className={`chip ${cat === "" ? "chip-on" : ""}`} onClick={() => setCat("")}>All</button>
          {cats.map((c) => <button key={c} className={`chip ${cat === c ? "chip-on" : ""}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      </div>

      <ErrorBox error={error} />
      {markets === null && !error && <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton" style={{ height: 150 }} />)}</div>}
      {markets && shown.length === 0 && !error && <p className="mute">No markets match. Clear the search or choose another category.</p>}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{shown.map((m) => <MarketCard key={m.id} m={m} />)}</div>
      {cursor && <div className="text-center"><button className="btn btn-ghost" disabled={loadingMore} onClick={async () => { setLoadingMore(true); await load(false, cursor); setLoadingMore(false); }}>Load more markets</button></div>}
    </div>
  );
}

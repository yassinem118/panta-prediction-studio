"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMarket, getTrades } from "@/lib/panta/client";
import { listOf, toMarket, dateShort, usd, type Market } from "@/lib/panta/normalize";
import { priceSeries, tSide, tSize, tTime, tWallet } from "@/lib/panta/analytics";
import { TradePanel } from "@/components/TradePanel";
import { OddsRibbon } from "@/components/OddsRibbon";
import { PriceChart } from "@/components/PriceChart";
import { TapeLens } from "@/components/TapeLens";
import { ErrorBox } from "@/components/ErrorBox";

const ago = (t?: number) => { if (!t) return ""; const s = (Date.now() - t) / 1000; return s < 90 ? "just now" : s < 5400 ? `${Math.round(s / 60)}m ago` : s < 129600 ? `${Math.round(s / 3600)}h ago` : `${Math.round(s / 86400)}d ago`; };

export default function MarketPage() {
  const { id } = useParams<{ id: string }>();
  const [m, setM] = useState<Market>();
  const [trades, setTrades] = useState<any[]>([]);
  const [error, setError] = useState<unknown>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    const pull = () => {
      getMarket(id).then((b) => alive && setM(toMarket(b))).catch((e) => alive && setError(e));
      getTrades(id).then((b) => alive && setTrades(listOf(b).slice(0, 60))).catch(() => {});
    };
    pull(); const t = setInterval(pull, 20000); // live refresh
    return () => { alive = false; clearInterval(t); };
  }, [id]);

  const embed = () => {
    const code = `<iframe src="${window.location.origin}/embed/${id}" width="420" height="190" style="border:0;border-radius:12px" loading="lazy"></iframe>`;
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  };

  return (
    <div className="space-y-4">
      <Link href="/" className="mute text-sm">← All markets</Link>
      <ErrorBox error={error} />
      {!m && !error && <div className="skeleton" style={{ height: 220 }} />}
      {m && (
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <section className="card space-y-4 p-5">
              <div className="flex flex-wrap gap-2">{m.category && <span className="tag">{m.category}</span>}{m.status && <span className="tag">{m.status}</span>}</div>
              <h1 className="text-2xl">{m.title}</h1>
              <OddsRibbon yes={m.yes} large />
              <div className="mute flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span>Volume {usd(m.volume)}</span><span>Closes {dateShort(m.ends)}</span>
                <button className="underline" onClick={embed}>{copied ? "Embed code copied" : "Copy embed code"}</button>
              </div>
            </section>
            <section className="card space-y-3 p-5"><h2>Price</h2><PriceChart series={priceSeries(trades)} /></section>
            <section className="card space-y-3 p-5"><h2>Who is trading</h2><TapeLens trades={trades} /></section>
            <section className="card p-5">
              <h2 className="mb-2">Recent trades</h2>
              {trades.length === 0 && <p className="mute text-sm">No trades yet. Be the first.</p>}
              <ul className="space-y-1 text-sm">
                {trades.slice(0, 12).map((t, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span style={{ color: tSide(t) === "NO" ? "var(--no)" : "var(--yes)", width: 40 }}>{tSide(t) ?? "—"}</span>
                    <span>{tSize(t) !== undefined ? usd(tSize(t)) : "—"}</span>
                    <span className="mute">{tWallet(t).slice(0, 4)}…{tWallet(t).slice(-4)}</span>
                    <span className="mute">{ago(tTime(t))}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <TradePanel marketId={id} title={m.title} yes={m.yes} />
        </div>
      )}
    </div>
  );
}

"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMarket, getTrades } from "@/lib/panta/client";
import { listOf, toMarket, pct, usd, type Market } from "@/lib/panta/normalize";
import { BuyPanel } from "@/components/BuyPanel";
import { ErrorBox } from "@/components/ErrorBox";

export default function MarketPage() {
  const { id } = useParams<{ id: string }>();
  const [m, setM] = useState<Market>();
  const [trades, setTrades] = useState<any[]>([]);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    getMarket(id).then((b) => setM(toMarket(b))).catch(setError);
    getTrades(id).then((b) => setTrades(listOf(b).slice(0, 15))).catch(() => {});
  }, [id]);

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <ErrorBox error={error} />
        {m && (
          <div className="panel p-4">
            <div className="text-sm" style={{ color: "var(--mute)" }}>{m.category ?? "Market"}{m.status ? ` · ${m.status}` : ""}</div>
            <h1 className="mt-1 text-xl font-semibold">{m.title}</h1>
            <div className="mt-3 flex gap-5">
              <span style={{ color: "var(--yes)" }}>YES {pct(m.yes)}</span>
              <span style={{ color: "var(--no)" }}>NO {pct(m.no)}</span>
              <span style={{ color: "var(--mute)" }}>Volume {usd(m.volume)}</span>
            </div>
          </div>
        )}
        <div className="panel p-4">
          <h2 className="mb-2 font-semibold">Recent trades</h2>
          {trades.length === 0 && <p className="text-sm" style={{ color: "var(--mute)" }}>No trades yet.</p>}
          <ul className="space-y-1 text-sm">
            {trades.map((t, i) => (
              <li key={i} className="flex justify-between">
                <span>{String(t.side ?? t.outcome ?? "")}</span>
                <span>{String(t.amount ?? t.size ?? t.usdc ?? "")}</span>
                <span style={{ color: "var(--mute)" }}>{String(t.wallet ?? t.taker ?? "").slice(0, 6)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <BuyPanel marketId={id} />
    </div>
  );
}

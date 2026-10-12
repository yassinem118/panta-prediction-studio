import { num, prob } from "./normalize";
export type Side = "YES" | "NO";

// Trade-tape readers. Field names vary, so each reader tries several; missing data stays undefined.
export const tSide = (t: any): Side | undefined => {
  const s = String(t.side ?? t.outcome ?? t.token ?? t.position ?? "").toUpperCase();
  return s.includes("YES") ? "YES" : s.includes("NO") ? "NO" : undefined;
};
export const tSize = (t: any) => num(t.amount ?? t.usdc ?? t.size ?? t.notional ?? t.volume ?? t.cost);
export const tWallet = (t: any) => String(t.wallet ?? t.taker ?? t.trader ?? t.user ?? t.owner ?? "");
export const tTime = (t: any): number | undefined => {
  const v = t.timestamp ?? t.createdAt ?? t.created_at ?? t.time ?? t.blockTime;
  if (v === undefined || v === null) return undefined;
  if (typeof v === "number") return v < 1e12 ? v * 1000 : v;
  const d = Date.parse(v); return isNaN(d) ? undefined : d;
};
/** YES-equivalent price of a trade (a NO trade at 30¢ means YES at 70¢). */
export const tYesPrice = (t: any): number | undefined => {
  const p = prob(num(t.price ?? t.avgPrice ?? t.fillPrice ?? t.yesPrice));
  if (p === undefined) return undefined;
  return tSide(t) === "NO" ? 1 - p : p;
};

export function priceSeries(trades: any[]) {
  return trades
    .map((t) => ({ t: tTime(t), p: tYesPrice(t) }))
    .filter((x): x is { t: number; p: number } => x.t !== undefined && x.p !== undefined)
    .sort((a, b) => a.t - b.t);
}

export function tapeStats(trades: any[]) {
  let yes = 0, no = 0, largest = 0;
  const byWallet = new Map<string, number>();
  for (const t of trades) {
    const s = tSize(t); if (s === undefined) continue;
    if (tSide(t) === "YES") yes += s; else if (tSide(t) === "NO") no += s;
    largest = Math.max(largest, s);
    const w = tWallet(t); if (w) byWallet.set(w, (byWallet.get(w) ?? 0) + s);
  }
  const total = yes + no;
  const top = Math.max(0, ...byWallet.values());
  return {
    count: trades.length, yes, no, total, largest,
    imbalance: total ? (yes - no) / total : undefined,
    wallets: byWallet.size,
    topShare: total ? top / total : undefined,
  };
}

export function flowSignal(s: ReturnType<typeof tapeStats>) {
  if (s.imbalance === undefined) return { label: "Not enough data", tone: "mute" as const };
  if (s.imbalance > 0.25) return { label: "Money is leaning YES", tone: "yes" as const };
  if (s.imbalance < -0.25) return { label: "Money is leaning NO", tone: "no" as const };
  return { label: "Balanced flow", tone: "mute" as const };
}

import { flowSignal, tapeStats } from "@/lib/panta/analytics";
import { usd } from "@/lib/panta/normalize";

export function TapeLens({ trades }: { trades: any[] }) {
  const s = tapeStats(trades);
  const sig = flowSignal(s);
  const color = sig.tone === "yes" ? "var(--yes)" : sig.tone === "no" ? "var(--no)" : "var(--mute)";
  const whale = s.topShare !== undefined && s.topShare > 0.4 && s.wallets > 1;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-semibold" style={{ color }}>{sig.label}</span>
        {whale && <span className="tag" style={{ color: "var(--accent)" }}>One wallet holds {Math.round((s.topShare ?? 0) * 100)}% of recent volume</span>}
      </div>
      <div className="kv">
        <div><small>Trades</small><b>{s.count}</b></div>
        <div><small>Traders</small><b>{s.wallets || "—"}</b></div>
        <div><small>Largest trade</small><b>{s.largest ? usd(s.largest) : "—"}</b></div>
        <div><small>YES flow</small><b style={{ color: "var(--yes)" }}>{s.total ? usd(s.yes) : "—"}</b></div>
        <div><small>NO flow</small><b style={{ color: "var(--no)" }}>{s.total ? usd(s.no) : "—"}</b></div>
        <div><small>Lean</small><b>{s.imbalance === undefined ? "—" : `${s.imbalance > 0 ? "+" : ""}${Math.round(s.imbalance * 100)}%`}</b></div>
      </div>
    </div>
  );
}

const usdc = (v: any) => `$${Number(v).toFixed(2)}`;
const base = (v: any) => `$${(Number(v) / 1e6).toFixed(2)}`;
const LABELS: Record<string, [string, (v: any) => string]> = {
  amountUsdc: ["You pay", usdc],
  shares: ["Shares you get", (v) => String(v)],
  feeUsdc: ["Fee", usdc],
  paymentUsdc: ["Creation fee", base],
  liquidityInjectionUsdc: ["Seeds the market", base],
  blockhashExpiryHintSec: ["Sign within", (v) => `${v}s`],
  expiresAt: ["Quote valid until", (v) => { const d = new Date(v); return isNaN(+d) || d.getFullYear() > 2090 ? "—" : d.toLocaleTimeString(); }],
};

export function QuoteView({ quote }: { quote: any }) {
  if (!quote || typeof quote !== "object") return null;
  const rows = Object.keys(LABELS).filter((k) => quote[k] !== undefined && quote[k] !== null).map((k) => [LABELS[k][0], LABELS[k][1](quote[k])]);
  const fallback = rows.length ? [] : Object.entries(quote).filter(([k, v]) => typeof v !== "object" && k !== "disclaimer").slice(0, 6).map(([k, v]) => [k, String(v)]);
  const all = [...rows, ...fallback];
  return (
    <div className="space-y-1 rounded-xl p-3 text-sm" style={{ background: "var(--field)", border: "1px solid var(--line)" }}>
      {all.map(([k, v]) => (<div key={k} className="flex justify-between gap-3"><span className="mute">{k}</span><b>{v}</b></div>))}
      {typeof quote.disclaimer === "string" && /test mode/i.test(quote.disclaimer) && <p className="mute pt-1 text-xs">Sandbox quote: nothing here touches mainnet.</p>}
    </div>
  );
}

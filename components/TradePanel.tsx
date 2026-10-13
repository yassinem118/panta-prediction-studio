"use client";
import { useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { quoteBuy } from "@/lib/panta/client";
import { AMOUNT_FIELD } from "@/lib/panta/fields";
import { QuoteView } from "./QuoteView";
import { buyFlow } from "@/lib/panta/flows";
import { edgeMath, money } from "@/lib/panta/edge";
import { cents } from "@/lib/panta/normalize";
import { ErrorBox } from "./ErrorBox";
import { ShareCall } from "./ShareCall";
import { Toast } from "./Toast";

export function TradePanel({ marketId, title, yes }: { marketId: string; title: string; yes?: number }) {
  const wallet = useWallet();
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState("1.00");
  const [bankroll, setBankroll] = useState("100");
  const [belief, setBelief] = useState<number | null>(null);
  const [quote, setQuote] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ sig: string; entry: number; side: "YES" | "NO"; stake: number }>();
  const [error, setError] = useState<unknown>();
  const [toast, setToast] = useState(false);

  const price = yes === undefined ? undefined : side === "YES" ? yes : 1 - yes;
  const q = belief ?? price ?? 0.5;
  const stake = Number(amount) || 0;
  const m = useMemo(() => (price ? edgeMath(price, q, stake) : undefined), [price, q, stake]);
  const halfKelly = m ? Math.round(Number(bankroll) * m.kelly * 50) / 100 : 0;

  async function getQuote() {
    setBusy(true); setError(undefined);
    try { setQuote(await quoteBuy({ marketId, side, [AMOUNT_FIELD]: amount, wallet: wallet.publicKey?.toBase58() })); }
    catch (e) { setError(e); } finally { setBusy(false); }
  }
  async function buy() {
    setBusy(true); setError(undefined);
    try { const r = await buyFlow(wallet, { marketId, side, amount }); setDone({ sig: r.signature, entry: price ?? 0.5, side, stake }); setToast(true); }
    catch (e) { setError(e); } finally { setBusy(false); }
  }


  return (
    <aside className="card space-y-4 p-4 md:sticky md:top-20">
      <h2 className="text-lg">Trade</h2>
      <div className="grid grid-cols-2 gap-2">
        {(["YES", "NO"] as const).map((s) => (
          <button key={s} onClick={() => { setSide(s); setBelief(null); setQuote(null); }} className="rounded-xl border py-2 font-semibold"
            style={{ borderColor: side === s ? (s === "YES" ? "var(--yes)" : "var(--no)") : "var(--line)", background: side === s ? "var(--raised)" : "transparent", color: s === "YES" ? "var(--yes)" : "var(--no)" }}>
            {s} {cents(s === "YES" ? yes : yes === undefined ? undefined : 1 - yes)}
          </button>
        ))}
      </div>
      <label className="block text-sm">Amount (USDC)
        <input className="input mt-1" value={amount} onChange={(e) => { setAmount(e.target.value); setQuote(null); }} inputMode="decimal" />
      </label>

      <div className="rounded-xl p-3" style={{ background: "var(--field)", border: "1px solid var(--line)" }}>
        <div className="flex items-center justify-between text-sm"><b>Edge calculator</b><span className="mute">your odds: {Math.round(q * 100)}%</span></div>
        <input aria-label="Your probability" type="range" min={1} max={99} value={Math.round(q * 100)} onChange={(e) => setBelief(Number(e.target.value) / 100)} className="mt-2" />
        {m ? (
          <div className="kv mt-2">
            <div><small>You win</small><b style={{ color: "var(--yes)" }}>{money(m.profit)}</b></div>
            <div><small>Break-even</small><b>{Math.round(m.breakeven * 100)}%</b></div>
            <div><small>Expected value</small><b style={{ color: m.ev >= 0 ? "var(--yes)" : "var(--no)" }}>{money(m.ev)}</b></div>
          </div>
        ) : <p className="mute mt-2 text-xs">Enter an amount to see the payoff.</p>}
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="mute">Bankroll $</span>
          <input className="input" style={{ width: 90, padding: ".3rem .5rem" }} value={bankroll} onChange={(e) => setBankroll(e.target.value)} inputMode="decimal" aria-label="Bankroll" />
          <button className="btn btn-ghost" style={{ padding: ".3rem .7rem" }} disabled={!halfKelly} onClick={() => { setAmount(halfKelly.toFixed(2)); setQuote(null); }}>
            {halfKelly ? `Use half-Kelly $${halfKelly.toFixed(2)}` : "No edge at these odds"}
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn btn-ghost flex-1" disabled={busy || stake <= 0} onClick={getQuote}>Get quote</button>
        <button className="btn flex-1" disabled={busy || !wallet.connected || !quote} onClick={buy}>Sign &amp; buy</button>
      </div>
      {!wallet.connected && <p className="mute text-xs">Connect a wallet to buy. Panta runs on Solana mainnet, so purchases use real USDC.</p>}
      {quote && <QuoteView quote={quote} />}
      <ErrorBox error={error} />
      {done && (
        <>
          {toast && <Toast onDone={() => setToast(false)}>Order confirmed. <a className="underline" href={`https://solscan.io/tx/${done.sig}`} target="_blank" rel="noreferrer">View on Solscan</a></Toast>}
          <div className="space-y-2 border-t pt-3" style={{ borderColor: "var(--line)" }}>
            <p className="text-sm"><b>Share your call</b> <span className="mute">Friends see your entry and how it is doing.</span></p>
            <ShareCall id={marketId} title={title} side={done.side} entry={done.entry} stake={done.stake} />
          </div>
        </>
      )}
    </aside>
  );
}

"use client";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { quoteBuy } from "@/lib/panta/client";
import { buyFlow } from "@/lib/panta/flows";
import { ErrorBox } from "./ErrorBox";

export function BuyPanel({ marketId }: { marketId: string }) {
  const wallet = useWallet();
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState("1.00");
  const [quote, setQuote] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [sig, setSig] = useState<string>();
  const [error, setError] = useState<unknown>();

  async function getQuote() {
    setBusy(true); setError(undefined); setSig(undefined);
    try { setQuote(await quoteBuy({ marketId, side, amount, wallet: wallet.publicKey?.toBase58() })); } // VERIFY payload
    catch (e) { setError(e); } finally { setBusy(false); }
  }
  async function buy() {
    setBusy(true); setError(undefined);
    try { const r = await buyFlow(wallet, { marketId, side, amount }); setSig(r.signature); }
    catch (e) { setError(e); } finally { setBusy(false); }
  }

  return (
    <div className="panel space-y-3 p-4">
      <h2 className="font-semibold">Buy a position</h2>
      <div className="flex gap-2">
        {(["YES", "NO"] as const).map((s) => (
          <button key={s} onClick={() => setSide(s)} className="flex-1 rounded-lg border py-2"
            style={{ borderColor: side === s ? (s === "YES" ? "var(--yes)" : "var(--no)") : "var(--line)" }}>{s}</button>
        ))}
      </div>
      <label className="block text-sm">Amount (USDC)
        <input className="input mt-1" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
      </label>
      <div className="flex gap-2">
        <button className="btn" disabled={busy} onClick={getQuote}>Get quote</button>
        <button className="btn" disabled={busy || !wallet.connected || !quote} onClick={buy}>Sign &amp; buy</button>
      </div>
      {!wallet.connected && <p className="text-sm" style={{ color: "var(--mute)" }}>Connect a wallet to buy. Panta runs on Solana mainnet, so purchases use real USDC.</p>}
      {quote && <pre className="overflow-x-auto rounded-lg p-3 text-xs" style={{ background: "#0b1226" }}>{JSON.stringify(quote, null, 2)}</pre>}
      {sig && <p className="text-sm">Confirmed. <a className="underline" href={`https://solscan.io/tx/${sig}`} target="_blank" rel="noreferrer">View on Solscan</a></p>}
      <ErrorBox error={error} />
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getCategories, quoteCreate } from "@/lib/panta/client";
import { createMarketFlow } from "@/lib/panta/flows";
import { listOf } from "@/lib/panta/normalize";
import { ErrorBox } from "@/components/ErrorBox";

export default function Create() {
  const wallet = useWallet();
  const [cats, setCats] = useState<string[]>([]);
  const [f, setF] = useState({ title: "", description: "", category: "", endDate: "" });
  const [quote, setQuote] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });

  useEffect(() => { getCategories().then((b) => setCats(listOf(b).map((c: any) => String(c.slug ?? c.name ?? c)))).catch(() => {}); }, []);

  async function getQuote() {
    setBusy(true); setError(undefined);
    try { setQuote(await quoteCreate({ ...f, wallet: wallet.publicKey?.toBase58() })); } // VERIFY payload
    catch (e) { setError(e); } finally { setBusy(false); }
  }
  async function create() {
    setBusy(true); setError(undefined);
    try { setResult(await createMarketFlow(wallet, f)); } catch (e) { setError(e); } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-xl space-y-3">
      <h1 className="text-2xl font-semibold">Create a market</h1>
      <p className="text-sm" style={{ color: "var(--mute)" }}>Creating a market charges a USDC fee on Solana mainnet. Get the quote first to see the exact amount.</p>
      <input className="input" placeholder="Question, e.g. Will SOL close above $300 on Dec 31?" value={f.title} onChange={set("title")} />
      <textarea className="input" rows={3} placeholder="Resolution rules" value={f.description} onChange={set("description")} />
      <select className="input" value={f.category} onChange={set("category")}>
        <option value="">Category</option>
        {cats.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <input className="input" type="date" value={f.endDate} onChange={set("endDate")} />
      <div className="flex gap-2">
        <button className="btn" disabled={busy || !f.title} onClick={getQuote}>Get fee quote</button>
        <button className="btn" disabled={busy || !wallet.connected || !quote} onClick={create}>Sign &amp; create</button>
      </div>
      {quote && <pre className="overflow-x-auto rounded-lg p-3 text-xs" style={{ background: "#0b1226" }}>{JSON.stringify(quote, null, 2)}</pre>}
      {result && <p className="text-sm">Market created. <a className="underline" href={`https://solscan.io/tx/${result.signature}`} target="_blank" rel="noreferrer">View transaction</a></p>}
      <ErrorBox error={error} />
    </div>
  );
}

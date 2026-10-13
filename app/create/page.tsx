"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getCategories, quoteCreate } from "@/lib/panta/client";
import { createPayload, DEFAULT_IMAGE } from "@/lib/panta/fields";
import { createMarketFlow } from "@/lib/panta/flows";
import { listOf } from "@/lib/panta/normalize";
import { ErrorBox } from "@/components/ErrorBox";
import { OddsRibbon } from "@/components/OddsRibbon";
import { QuoteView } from "@/components/QuoteView";

const TEMPLATES = {
  price: { name: "Price target", a: "Asset (e.g. SOL)", b: "Target price (e.g. 300)", title: (a: string, b: string, d: string) => `Will ${a || "SOL"} be above $${b || "300"} on ${d || "the end date"}?`, rules: (a: string, _b: string, d: string, s: string) => `Resolves YES if the ${a || "asset"} price is above the target at the close of ${d || "the end date"} according to ${s || "CoinGecko"}. Resolves NO otherwise.` },
  event: { name: "Event by a date", a: "Event (e.g. Firedancer reaches 50% stake)", b: "", title: (a: string, _b: string, d: string) => `Will ${a || "the event"} happen before ${d || "the end date"}?`, rules: (a: string, _b: string, d: string, s: string) => `Resolves YES if ${a || "the event"} is confirmed by ${s || "an official announcement"} on or before ${d || "the end date"}. Resolves NO otherwise.` },
  versus: { name: "Head to head", a: "Side A", b: "Side B", title: (a: string, b: string, d: string) => `Will ${a || "A"} beat ${b || "B"} by ${d || "the end date"}?`, rules: (a: string, b: string, d: string, s: string) => `Resolves YES if ${a || "A"} finishes ahead of ${b || "B"} by ${d || "the end date"} according to ${s || "official results"}. Resolves NO otherwise.` },
} as const;
type K = keyof typeof TEMPLATES;

export default function Create() {
  const wallet = useWallet();
  const [cats, setCats] = useState<string[]>([]);
  const [tpl, setTpl] = useState<K>("price");
  const [a, setA] = useState(""); const [b, setB] = useState("");
  const [f, setF] = useState({ title: "", description: "", category: "", endDate: "", source: "", imageUrl: DEFAULT_IMAGE });
  const [quote, setQuote] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const set = (k: string) => (e: any) => { setF({ ...f, [k]: e.target.value }); setQuote(null); };
  const T = TEMPLATES[tpl];
  const ready = f.title && f.description && f.category && f.endDate && /^https?:\/\//.test(f.source) && /^https:\/\//.test(f.imageUrl);

  useEffect(() => { getCategories().then((x) => setCats(listOf(x).map((c: any) => String(c.slug ?? c.name ?? c)))).catch(() => {}); }, []);

  const host = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };
  const fill = () => setF({ ...f, title: T.title(a, b, f.endDate), description: T.rules(a, b, f.endDate, host(f.source)) });

  async function getQuote() { setBusy(true); setError(undefined); try { setQuote(await quoteCreate(createPayload(f, wallet.publicKey?.toBase58()))); } catch (e) { setError(e); } finally { setBusy(false); } }
  async function create() { setBusy(true); setError(undefined); try { setResult(await createMarketFlow(wallet, f)); } catch (e) { setError(e); } finally { setBusy(false); } }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <h1 className="text-2xl">Create a market</h1>
        <p className="mute text-sm">Pick a template to write a clear question and resolution rule, then get the exact USDC fee before you sign. Creation uses real USDC on mainnet.</p>
        <div className="flex flex-wrap gap-2">{(Object.keys(TEMPLATES) as K[]).map((k) => <button key={k} className={`chip ${tpl === k ? "chip-on" : ""}`} onClick={() => setTpl(k)}>{TEMPLATES[k].name}</button>)}</div>
        <div className="card space-y-3 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <input className="input" placeholder={T.a} value={a} onChange={(e) => setA(e.target.value)} />
            {T.b && <input className="input" placeholder={T.b} value={b} onChange={(e) => setB(e.target.value)} />}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="input" type="date" aria-label="End date" value={f.endDate} onChange={set("endDate")} />
            <input className="input" placeholder="Source of truth URL (https://www.coingecko.com/en/coins/solana)" value={f.source} onChange={set("source")} />
          </div>
          <button className="btn btn-ghost" onClick={fill}>Write question and rules</button>
        </div>
        <div className="card space-y-3 p-4">
          <input className="input" placeholder="Question" value={f.title} onChange={set("title")} />
          <textarea className="input" rows={3} placeholder="Resolution rules" value={f.description} onChange={set("description")} />
          <select className="input" aria-label="Category" value={f.category} onChange={set("category")}><option value="">Category</option>{cats.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          <input className="input" placeholder="Image URL (https://… public image for the market)" value={f.imageUrl} onChange={set("imageUrl")} />
          {!ready && <p className="mute text-xs">Fill every field to enable the quote. The source and image must be full https:// links. Panta refuses many image hosts, so use a URL that `npm run probe:create` reports as PASS.</p>}
          <div className="flex gap-2">
            <button className="btn btn-ghost" disabled={busy || !ready} onClick={getQuote}>Get fee quote</button>
            <button className="btn" disabled={busy || !wallet.connected || !quote} onClick={create}>Sign &amp; create</button>
          </div>
          {quote && <QuoteView quote={quote} />}
          <ErrorBox error={error} />
          {result && <p className="text-sm">Market created. <a className="underline" href={`https://solscan.io/tx/${result.signature}`} target="_blank" rel="noreferrer">View transaction</a></p>}
        </div>
      </div>
      <aside className="card h-fit space-y-3 p-4 lg:sticky lg:top-20">
        <h2 className="text-lg">Preview</h2>
        {f.imageUrl && /* eslint-disable-next-line @next/next/no-img-element */ <img src={f.imageUrl} alt="" className="w-full rounded-lg" style={{ maxHeight: 140, objectFit: "cover" }} />}
        <div className="font-medium">{f.title || "Your question appears here"}</div>
        <OddsRibbon yes={0.5} />
        <p className="mute text-xs">{f.title.length} characters · markets open at 50¢ / 50¢</p>
        <p className="mute text-sm">{f.description || "Your resolution rules appear here."}</p>
      </aside>
    </div>
  );
}

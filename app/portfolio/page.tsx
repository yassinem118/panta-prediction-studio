"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getPositions } from "@/lib/panta/client";
import { claimFlow } from "@/lib/panta/flows";
import { listOf } from "@/lib/panta/normalize";
import { ErrorBox } from "@/components/ErrorBox";
import { Toast } from "@/components/Toast";
import Link from "next/link";

export default function Portfolio() {
  const wallet = useWallet();
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState<unknown>();
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!wallet.publicKey) return;
    setRows(null);
    getPositions(wallet.publicKey.toBase58()).then((b) => setRows(listOf(b))).catch(setError);
  }, [wallet.publicKey]);

  async function claim(marketId: string) {
    setError(undefined);
    try { const r = await claimFlow(wallet, { marketId }); setNote(`Claimed. Signature ${r.signature.slice(0, 10)}…`); }
    catch (e) { setError(e); }
  }

  if (!wallet.connected) return <div className="card p-6"><h1 className="text-xl">Your positions</h1><p className="mute mt-1">Connect your wallet to see what you hold and what you can claim.</p></div>;
  const claimable = (rows ?? []).filter((r) => Boolean(r.claimable ?? r.claimEligible ?? r.canClaim)).length; // VERIFY field name
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Your positions</h1>
      {rows && <div className="kv" style={{ maxWidth: 420 }}><div><small>Positions</small><b>{rows.length}</b></div><div><small>Claimable</small><b style={{ color: claimable ? "var(--accent)" : undefined }}>{claimable}</b></div></div>}
      <ErrorBox error={error} />
      {rows === null && !error && <div className="skeleton" style={{ height: 90 }} />}
      {rows && rows.length === 0 && <div className="card p-5"><p className="mute">No positions on this wallet yet. <Link className="underline" href="/">Pick a market</Link> and buy YES or NO.</p></div>}
      {(rows ?? []).map((r, i) => {
        const id = String(r.marketId ?? r.market?.id ?? r.market ?? "");
        const can = Boolean(r.claimable ?? r.claimEligible ?? r.canClaim);
        return (
          <div key={i} className="card flex items-center gap-3 p-4">
            <div className="flex-1">
              <Link href={`/markets/${id}`} className="font-medium underline-offset-2 hover:underline">{String(r.title ?? r.market?.title ?? id)}</Link>
              <div className="mute text-sm">{String(r.side ?? r.outcome ?? "")} · {String(r.shares ?? r.amount ?? "")} shares · {String(r.phase ?? "")}</div>
            </div>
            {can && <button className="btn" onClick={() => claim(id)}>Claim winnings</button>}
          </div>
        );
      })}
      {note && <Toast onDone={() => setNote("")}>{note}</Toast>}
    </div>
  );
}

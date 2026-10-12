"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getPositions } from "@/lib/panta/client";
import { claimFlow } from "@/lib/panta/flows";
import { listOf } from "@/lib/panta/normalize";
import { ErrorBox } from "@/components/ErrorBox";

export default function Portfolio() {
  const wallet = useWallet();
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<unknown>();
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!wallet.publicKey) return;
    getPositions(wallet.publicKey.toBase58()).then((b) => setRows(listOf(b))).catch(setError);
  }, [wallet.publicKey]);

  async function claim(marketId: string) {
    setError(undefined);
    try { const r = await claimFlow(wallet, { marketId }); setNote(`Claimed. Signature ${r.signature.slice(0, 12)}…`); }
    catch (e) { setError(e); }
  }

  if (!wallet.connected) return <p style={{ color: "var(--mute)" }}>Connect your wallet to see your positions.</p>;
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Your positions</h1>
      <ErrorBox error={error} />
      {note && <p className="text-sm">{note}</p>}
      {rows.length === 0 && !error && <p style={{ color: "var(--mute)" }}>No positions on this wallet yet. Buy YES or NO on any market to start.</p>}
      {rows.map((r, i) => {
        const id = String(r.marketId ?? r.market?.id ?? r.market ?? "");
        const claimable = Boolean(r.claimable ?? r.claimEligible ?? r.canClaim); // VERIFY field name
        return (
          <div key={i} className="panel flex items-center gap-3 p-4">
            <div className="flex-1">
              <div className="font-medium">{String(r.title ?? r.market?.title ?? id)}</div>
              <div className="text-sm" style={{ color: "var(--mute)" }}>{String(r.side ?? r.outcome ?? "")} · {String(r.shares ?? r.amount ?? "")} shares · {String(r.phase ?? "")}</div>
            </div>
            {claimable && <button className="btn" onClick={() => claim(id)}>Claim winnings</button>}
          </div>
        );
      })}
    </div>
  );
}

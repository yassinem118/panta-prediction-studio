"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMarket } from "@/lib/panta/client";
import { toMarket, usd, type Market } from "@/lib/panta/normalize";
import { OddsRibbon } from "@/components/OddsRibbon";

export default function Embed() {
  const { id } = useParams<{ id: string }>();
  const [m, setM] = useState<Market>();
  useEffect(() => { getMarket(id).then((b) => setM(toMarket(b))).catch(() => {}); }, [id]);
  return (
    <a href={`/markets/${id}`} target="_top" className="card block space-y-3 p-4" style={{ margin: 8 }}>
      <div className="font-medium">{m?.title ?? "Loading market…"}</div>
      <OddsRibbon yes={m?.yes} />
      <div className="mute flex justify-between text-xs"><span>Volume {usd(m?.volume)}</span><span>Powered by Panta · Trade on Studio</span></div>
    </a>
  );
}

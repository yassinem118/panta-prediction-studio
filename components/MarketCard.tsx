import Link from "next/link";
import { OddsRibbon } from "./OddsRibbon";
import { dateShort, usd, type Market } from "@/lib/panta/normalize";

export function MarketCard({ m }: { m: Market }) {
  return (
    <Link href={`/markets/${m.id}`} className="card card-link flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        {m.category && <span className="tag">{m.category}</span>}
        {m.status && <span className="tag">{m.status}</span>}
      </div>
      <div className="font-medium" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "3rem" }}>{m.title}</div>
      <OddsRibbon yes={m.yes} />
      <div className="mute flex justify-between text-sm"><span>Volume {usd(m.volume)}</span><span>Closes {dateShort(m.ends)}</span></div>
    </Link>
  );
}

// Tolerant readers: the UI shows "—" instead of inventing data when a field is missing.
export type Market = { id: string; title: string; category?: string; yes?: number; no?: number; volume?: number; status?: string; raw: any };

const num = (v: any) => (v === null || v === undefined || v === "" || isNaN(Number(v)) ? undefined : Number(v));

export function listOf(body: any): any[] {
  if (Array.isArray(body)) return body;
  for (const k of ["results", "items", "markets", "positions", "trades", "data"]) if (Array.isArray(body?.[k])) return body[k];
  return [];
}

export function toMarket(m: any): Market {
  const yes = num(m.yesPrice ?? m.yes_price ?? m.spotPrices?.yes ?? m.prices?.yes ?? m.spot?.yes);
  const no = num(m.noPrice ?? m.no_price ?? m.spotPrices?.no ?? m.prices?.no ?? m.spot?.no) ?? (yes !== undefined ? 1 - yes : undefined);
  return {
    id: String(m.id ?? m.marketId ?? m.address ?? ""),
    title: String(m.title ?? m.question ?? m.name ?? "Untitled market"),
    category: m.category ?? undefined,
    yes, no,
    volume: num(m.volume ?? m.volumeUsdc ?? m.stats?.volume),
    status: m.status ?? m.phase ?? undefined,
    raw: m,
  };
}

export const pct = (p?: number) => (p === undefined ? "—" : `${Math.round((p <= 1 ? p * 100 : p) * 10) / 10}%`);
export const usd = (v?: number) => (v === undefined ? "—" : `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);

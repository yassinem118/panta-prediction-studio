// Tolerant readers: the UI shows "—" instead of inventing data when a field is missing.
export type Market = { id: string; title: string; category?: string; yes?: number; no?: number; volume?: number; status?: string; ends?: string; raw: any };

export const num = (v: any) => (v === null || v === undefined || v === "" || isNaN(Number(v)) ? undefined : Number(v));
export const prob = (p?: number) => (p === undefined ? undefined : p > 1 ? Math.min(1, p / 100) : Math.max(0, p));

export function listOf(body: any): any[] {
  if (Array.isArray(body)) return body;
  for (const k of ["items", "results", "markets", "categories", "positions", "trades", "data"]) if (Array.isArray(body?.[k])) return body[k];
  return [];
}
export function nextCursor(body: any): string | undefined {
  const c = body?.nextCursor ?? body?.next_cursor ?? body?.cursor ?? body?.next;
  if (!c || typeof c !== "string") return undefined;
  if (c.startsWith("http")) { try { return new URL(c).searchParams.get("cursor") ?? undefined; } catch { return undefined; } }
  return c;
}

export function toMarket(m: any): Market {
  const yes = prob(num(m.yesPrice ?? m.yes_price ?? m.spotPrices?.yes ?? m.prices?.yes ?? m.spot?.yes));
  const no = prob(num(m.noPrice ?? m.no_price ?? m.spotPrices?.no ?? m.prices?.no ?? m.spot?.no)) ?? (yes !== undefined ? 1 - yes : undefined);
  return {
    id: String(m.id ?? m.marketId ?? m.address ?? ""),
    title: String(m.title ?? m.question ?? m.name ?? "Untitled market"),
    category: m.category ?? undefined,
    yes, no,
    volume: num(m.volume ?? m.volumeUsdc ?? m.stats?.volume),
    status: m.status ?? m.phase ?? undefined,
    ends: m.endTime ?? m.endDate ?? m.closesAt ?? m.closeTime ?? m.resolutionDate ?? m.endsAt ?? undefined,
    raw: m,
  };
}

export const cents = (p?: number) => (p === undefined ? "—" : `${Math.round(p * 100)}¢`);
export const pct = (p?: number) => (p === undefined ? "—" : `${Math.round(p * 1000) / 10}%`);
export const usd = (v?: number) => (v === undefined ? "—" : v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `$${(v / 1e3).toFixed(1)}K` : `$${v.toFixed(0)}`);
export const dateShort = (s?: string) => { if (!s) return "—"; const d = new Date(s); return isNaN(+d) ? String(s) : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); };

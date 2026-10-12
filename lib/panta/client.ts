import { E } from "./endpoints";

export class PantaError extends Error {
  constructor(public status: number, message: string, public body?: any) { super(message); }
}

// Browser → our proxy (/api/panta/*) → Panta. The API key stays on the server.
async function call<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch("/api/panta/" + path.replace(/\/(\?|$)/, "$1"), {
    ...init,
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { message: text }; }
  if (!res.ok) throw new PantaError(res.status, body?.message ?? `Panta API error ${res.status}`, body);
  return body as T;
}
const post = <T = any>(p: string, data: unknown) => call<T>(p, { method: "POST", body: JSON.stringify(data) });

export const listMarkets = (qs = "") => call(E.markets + qs);
export const getMarket = (id: string) => call(E.market(id));
export const getTrades = (id: string) => call(E.trades(id));
export const getCategories = () => call(E.categories);
export const getPositions = (wallet: string) => call(E.positions(wallet));

export const quoteBuy = (p: unknown) => post(E.buyQuote, p);
export const buildBuy = (p: unknown) => post(E.buyBuild, p);
export const submitBuy = (p: unknown) => post(E.buySubmit, p);
export const quoteCreate = (p: unknown) => post(E.createQuote, p);
export const buildCreate = (p: unknown) => post(E.createBuild, p);
export const registerCreate = (p: unknown) => post(E.createRegister, p);
export const buildClaim = (p: unknown) => post(E.claimBuild, p);
export const buildCreatorFees = (p: unknown) => post(E.creatorFees, p);
export const reportTrade = (p: unknown) => post(E.tradeReport, p);

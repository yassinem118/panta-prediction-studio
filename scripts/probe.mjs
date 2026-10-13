// npm run probe [wallet]  — prints REAL response shapes + which request variants the API accepts.
// Quotes and builds are free and unsigned: this script never spends money.
import { BASE, readEnv } from "./_env.mjs";
const KEY = process.env.PANTA_API_KEY ?? readEnv().PANTA_API_KEY;
if (!KEY) { console.error("No PANTA_API_KEY found. Run: npm run setup   (or npm run get-key)"); process.exit(1); }
console.log("Key type:", KEY.startsWith("pk_live_") ? "LIVE (mainnet data)" : "TEST (sandbox fixtures)");

async function hit(method, path, body) {
  const res = await fetch(`${BASE}/${path}`, { method, headers: { "X-Api-Key": KEY, "Content-Type": "application/json" }, body: body && JSON.stringify(body) });
  const text = await res.text();
  console.log(`\n=== ${method} ${path} ${body ? JSON.stringify(body).slice(0, 160) : ""} -> ${res.status}\n${text.slice(0, 1100)}`);
  try { return JSON.parse(text); } catch { return null; }
}
const keys = (label, o) => console.log(`>>> ${label} keys:`, o && typeof o === "object" ? Object.keys(o).join(", ") : "(none)");
const rows = (b) => Array.isArray(b) ? b : (b?.items ?? b?.results ?? b?.markets ?? b?.trades ?? b?.data ?? []);
const W = process.argv[2] ?? "11111111111111111111111111111111";

const list = await hit("GET", "markets/?limit=3");
keys("first market", rows(list)[0]);
await hit("GET", "categories/");
const m = rows(list).find((x) => (x.status ?? x.phase) === "primary") ?? rows(list)[0];
const id = m?.marketId ?? m?.id;
if (id) {
  await hit("GET", `markets/${id}/`);
  const t = await hit("GET", `markets/${id}/trades/`); keys("first trade", rows(t)[0]);
  const q1 = await hit("POST", "primaryorderquote/", { marketId: id, side: "YES", amount: "1.00", wallet: W });
  const q2 = await hit("POST", "primaryorderquote/", { marketId: id, side: "YES", amountUsdc: "1.00", wallet: W });
  const quoteId = (q2?.quoteId ?? q1?.quoteId);
  if (quoteId) { await hit("POST", "primaryorderbuild/", { quoteId, wallet: W }); }
}
const cq = await hit("POST", "markets/create/quote/", { title: "Will SOL close above $300 on 2027-06-30?", description: "Resolves YES if SOL closes above $300 on CoinGecko.", category: "crypto", endTime: "2027-06-30T23:59:59Z", marketType: "standard", wallet: W });
if (cq?.createId) await hit("POST", "markets/create/build/", { createId: cq.createId, wallet: W });
if (process.argv[2]) { const p = await hit("GET", `positions/?wallet=${process.argv[2]}`); keys("first position", rows(p)[0]); }
console.log("\nSend this whole output back (it contains no secrets), so the remaining field names can be matched.");

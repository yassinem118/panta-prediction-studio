// npm run probe — prints the REAL response shapes of the Panta API.
import { BASE, readEnv } from "./_env.mjs";
const KEY = process.env.PANTA_API_KEY ?? readEnv().PANTA_API_KEY;
if (!KEY) { console.error("No PANTA_API_KEY found. Run: npm run setup   (or npm run get-key)"); process.exit(1); }

async function hit(method, path, body) {
  const res = await fetch(`${BASE}/${path}`, { method, headers: { "X-Api-Key": KEY, "Content-Type": "application/json" }, body: body && JSON.stringify(body) });
  const text = await res.text();
  console.log(`\n=== ${method} ${path} -> ${res.status}\n${text.slice(0, 1100)}`);
  try { return JSON.parse(text); } catch { return null; }
}
const keys = (label, o) => console.log(`>>> ${label} keys:`, o && typeof o === "object" ? Object.keys(o).join(", ") : "(none)");
const rows = (b) => Array.isArray(b) ? b : (b?.results ?? b?.items ?? b?.markets ?? b?.trades ?? b?.data ?? []);

const list = await hit("GET", "markets/?limit=2");
keys("markets response", list); keys("first market", rows(list)[0]);
await hit("GET", "categories/");
const id = rows(list)[0]?.id ?? rows(list)[0]?.marketId;
if (id) {
  const d = await hit("GET", `markets/${id}/`); keys("market detail", d);
  const t = await hit("GET", `markets/${id}/trades/`); keys("first trade", rows(t)[0]);
  await hit("POST", "primaryorderquote/", { marketId: id, side: "YES", amount: "1.00" });
}
await hit("POST", "markets/create/quote/", { title: "Will it rain tomorrow?" });
const wallet = process.argv[2];
if (wallet) { const p = await hit("GET", `positions/?wallet=${wallet}`); keys("first position", rows(p)[0]); }
console.log("\nCopy the output (it contains no secrets) and send it back so the field names can be matched exactly.");

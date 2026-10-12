// Run: npm run probe   (needs PANTA_API_KEY in .env.local)
// Prints the REAL response shapes so you can confirm field names used in lib/panta/*.
const BASE = process.env.PANTA_BASE_URL ?? "https://live-api.panta.market/api/v1";
const KEY = process.env.PANTA_API_KEY;
if (!KEY) { console.error("Set PANTA_API_KEY in .env.local first."); process.exit(1); }

async function hit(method, path, body) {
  const res = await fetch(`${BASE}/${path}`, { method, headers: { "X-Api-Key": KEY, "Content-Type": "application/json" }, body: body && JSON.stringify(body) });
  const text = await res.text();
  console.log(`\n=== ${method} ${path} -> ${res.status}\n${text.slice(0, 900)}`);
  try { return JSON.parse(text); } catch { return null; }
}

const list = await hit("GET", "markets/?limit=2");
await hit("GET", "categories/");
const arr = Array.isArray(list) ? list : (list?.results ?? list?.items ?? list?.markets ?? []);
const id = arr[0]?.id ?? arr[0]?.marketId;
if (id) {
  await hit("GET", `markets/${id}/`);
  await hit("GET", `markets/${id}/trades/`);
  // Error responses usually name the missing/invalid fields: use them to fix the payloads.
  await hit("POST", "primaryorderquote/", { marketId: id, side: "YES", amount: "1.00" });
}
await hit("POST", "markets/create/quote/", { title: "Will it rain tomorrow?" });
console.log("\nCompare the keys above with lib/panta/normalize.ts and the VERIFY lines in lib/panta/flows.ts.");

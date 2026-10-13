// npm run probe:create [wallet]
// Finds which sourcesOfTruth format and which imageUrl Panta accepts when creating a market.
// Quotes (and builds) are FREE and unsigned: this script never spends money and never signs anything.
import { BASE, readEnv } from "./_env.mjs";
const KEY = process.env.PANTA_API_KEY ?? readEnv().PANTA_API_KEY;
if (!KEY) { console.error("No key. Run: npm run get-key -- live"); process.exit(1); }
if (!KEY.startsWith("pk_live_")) console.warn("Warning: this is a TEST key (sandbox). Use: npm run get-key -- live\n");
const WALLET = process.argv[2] ?? "11111111111111111111111111111111";
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? readEnv().NEXT_PUBLIC_SITE_URL ?? "https://panta-prediction-studio.vercel.app").replace(/\/$/, "");

const now = Math.floor(Date.now() / 1000);
const end = now + 60 * 86400;
const SRC = "https://www.coingecko.com/en/coins/solana";
const sources = { "array of URLs": [SRC], "single URL string": SRC, "array of names": ["CoinGecko"] };
const images = {
  "your domain /market-default.png": `${SITE}/market-default.png`,
  "panta.market og image": "https://panta.market/og-home.png",
  "github raw (SOL logo)": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  "cryptologos.cc": "https://cryptologos.cc/logos/solana-sol-logo.png",
  "wikimedia": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Solana_logo.png/512px-Solana_logo.png",
  "placehold.co": "https://placehold.co/1024x1024.png",
};

async function post(path, body) {
  const res = await fetch(`${BASE}/${path}`, { method: "POST", headers: { "X-Api-Key": KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const text = await res.text(); let j; try { j = JSON.parse(text); } catch { j = { message: text }; }
  return { status: res.status, j };
}

const ok = [];
for (const [sn, s] of Object.entries(sources)) {
  for (const [inn, img] of Object.entries(images)) {
    const body = {
      question: "Will SOL close above $300 on 30 June 2027?",
      resolutionRule: "Resolves YES if the SOL/USD daily close on CoinGecko is above $300 on 30 June 2027. Resolves NO otherwise.",
      category: "crypto", sourcesOfTruth: s, startTime: now, endTime: end, resolutionTime: end + 86400, imageUrl: img, wallet: WALLET,
    };
    const q = await post("markets/create/quote/", body);
    const msg = q.status === 200 ? "OK" : String(q.j?.message ?? JSON.stringify(q.j)).slice(0, 110);
    console.log(`${q.status === 200 ? "PASS" : "fail"} | sources: ${sn} | image: ${inn} | ${msg}`);
    if (q.status === 200 && q.j?.createId) ok.push({ sn, inn, s, img, createId: q.j.createId, fee: q.j.paymentUsdc });
  }
}

console.log("\n=== Build check (stricter than quote) ===");
for (const c of ok.slice(0, 4)) {
  const b = await post("markets/create/build/", { createId: c.createId, wallet: WALLET });
  console.log(`${b.status === 200 ? "PASS" : "fail"} | sources: ${c.sn} | image: ${c.inn} | build: ${b.status} ${b.status === 200 ? "" : String(b.j?.message ?? "").slice(0, 100)}`);
}
console.log(ok.length ? `\n${ok.length} combination(s) passed the quote. Send this output back (no secrets inside).` : "\nNo combination passed. Send this output back.");

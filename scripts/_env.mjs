import fs from "node:fs";
export const BASE = process.env.PANTA_BASE_URL ?? "https://live-api.panta.market/api/v1";

export function readEnv() {
  try {
    return Object.fromEntries(
      fs.readFileSync(".env.local", "utf8").split(/\r?\n/)
        .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
        .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]; })
    );
  } catch { return {}; }
}

export function writeKey(key) {
  let t = "";
  try { t = fs.readFileSync(".env.local", "utf8"); } catch { try { t = fs.readFileSync(".env.example", "utf8"); } catch {} }
  if (/^PANTA_API_KEY=.*$/m.test(t)) t = t.replace(/^PANTA_API_KEY=.*$/m, () => `PANTA_API_KEY=${key}`);
  else t += `\nPANTA_API_KEY=${key}\n`;
  fs.writeFileSync(".env.local", t);
}

export async function checkKey(key) {
  const r = await fetch(`${BASE}/categories/`, { headers: { "X-Api-Key": key } });
  return r.status;
}

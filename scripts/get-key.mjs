// npm run get-key — logs in to your Panta account and creates a new pk_test_ key straight into .env.local.
// Your password is only sent to Panta. The new secret is never printed.
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { BASE, writeKey, checkKey } from "./_env.mjs";

const ENV = process.argv.includes("live") ? "live" : "test"; // npm run get-key -- live
const rl = readline.createInterface({ input, output });
const email = process.env.PANTA_EMAIL ?? (await rl.question("Panta account email: ")).trim();
const password = process.env.PANTA_PASSWORD ?? (await rl.question("Panta password (visible while typing): ")).trim();
rl.close();

const j = async (path, body, token) => {
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = { message: text }; }
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}: ${data.message ?? text}`);
  return data;
};

try {
  const { access } = await j("auth/token/", { email, password });
  const created = await j("account/keys/", { env: ENV, name: `panta-studio-${ENV}-${new Date().toISOString().slice(0, 10)}` }, access);
  writeKey(created.secret);
  const status = await checkKey(created.secret);
  console.log(`New ${ENV} key ${created.prefix}… saved to .env.local (Panta check: HTTP ${status}).`);
  console.log("Restart the dev server: npm run dev");
} catch (e) {
  console.error("Failed:", e.message);
  process.exit(1);
}

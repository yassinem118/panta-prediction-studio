// npm run setup — paste an existing Panta key; it is saved to .env.local and validated.
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeKey, checkKey } from "./_env.mjs";

const rl = readline.createInterface({ input, output });
const key = (await rl.question("Paste your Panta API key (pk_test_...): ")).trim();
rl.close();
if (!/^pk_(test|live)_/.test(key)) { console.error("That does not look like a Panta key (it should start with pk_test_ or pk_live_)."); process.exit(1); }
writeKey(key);
const status = await checkKey(key);
console.log(status === 200 ? "Saved to .env.local and the key works. Now run: npm run dev" : `Saved, but Panta answered HTTP ${status}. Check the key.`);

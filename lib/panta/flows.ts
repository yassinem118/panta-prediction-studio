import type { WalletContextState } from "@solana/wallet-adapter-react";
import * as api from "./client";
import { signAndSend } from "./solana";

// quote → build → wallet signs → broadcast on our RPC → tell Panta (submit/register) → attribution report.
// Panta never holds keys. Payload field names marked VERIFY: confirm with `npm run probe` / docs.panta.market.

export async function buyFlow(w: WalletContextState, p: { marketId: string; side: "YES" | "NO"; amount: string }) {
  const wallet = w.publicKey!.toBase58();
  const body = { marketId: p.marketId, side: p.side, amount: p.amount, wallet }; // VERIFY
  const quote = await api.quoteBuy(body);
  const build = await api.buildBuy(body);
  const signature = await signAndSend(w, build);
  await api.submitBuy({ ...body, signature });
  await api.reportTrade({ signature }).catch(() => undefined); // attribution is best-effort
  return { quote, signature };
}

export async function createMarketFlow(w: WalletContextState, p: Record<string, unknown>) {
  const body = { ...p, wallet: w.publicKey!.toBase58() }; // VERIFY
  const quote = await api.quoteCreate(body);
  const build = await api.buildCreate({ ...body, quote });
  const signature = await signAndSend(w, build);
  const market = await api.registerCreate({ ...body, signature });
  return { quote, signature, market };
}

export async function claimFlow(w: WalletContextState, p: { marketId: string }) {
  const build = await api.buildClaim({ marketId: p.marketId, wallet: w.publicKey!.toBase58() }); // VERIFY
  const signature = await signAndSend(w, build);
  await api.reportTrade({ signature }).catch(() => undefined);
  return { signature };
}

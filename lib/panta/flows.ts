import type { WalletContextState } from "@solana/wallet-adapter-react";
import * as api from "./client";
import { signAndSend } from "./solana";
import { AMOUNT_FIELD, createPayload, type CreateForm } from "./fields";

// quote → build → wallet signs → broadcast on our RPC → tell Panta → attribution.
// Panta never holds keys. Quote responses (confirmed by the probe) carry `quoteId` / `createId`,
// which the build step uses. Lines marked VERIFY are confirmed by `npm run probe` with a live key.

export async function buyFlow(w: WalletContextState, p: { marketId: string; side: "YES" | "NO"; amount: string }) {
  const wallet = w.publicKey!.toBase58();
  const quote = await api.quoteBuy({ marketId: p.marketId, side: p.side, [AMOUNT_FIELD]: p.amount, wallet });
  const build = await api.buildBuy({ quoteId: quote.quoteId, wallet }); // VERIFY
  const signature = await signAndSend(w, build);
  await api.submitBuy({ quoteId: quote.quoteId, signature, wallet }); // VERIFY
  await api.reportTrade({ signature }).catch(() => undefined); // attribution is best-effort
  return { quote, signature };
}

export async function createMarketFlow(w: WalletContextState, form: CreateForm) {
  const wallet = w.publicKey!.toBase58();
  const quote = await api.quoteCreate(createPayload(form, wallet));
  const build = await api.buildCreate({ createId: quote.createId, wallet }); // VERIFY
  const signature = await signAndSend(w, build);
  const market = await api.registerCreate({ createId: quote.createId, signature }); // VERIFY
  return { quote, signature, market };
}

export async function claimFlow(w: WalletContextState, p: { marketId: string }) {
  const build = await api.buildClaim({ marketId: p.marketId, wallet: w.publicKey!.toBase58() }); // VERIFY
  const signature = await signAndSend(w, build);
  await api.reportTrade({ signature }).catch(() => undefined);
  return { signature };
}

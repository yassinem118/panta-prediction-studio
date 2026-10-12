import { Connection, PublicKey, Transaction, TransactionInstruction, VersionedTransaction } from "@solana/web3.js";
import type { WalletContextState } from "@solana/wallet-adapter-react";

export const RPC = process.env.NEXT_PUBLIC_SOLANA_RPC ?? "https://api.mainnet-beta.solana.com";
export const connection = new Connection(RPC, "confirmed");

const b64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/**
 * Turns a Panta "build" response into something the wallet can sign.
 * Handles (1) a serialized base64 transaction and (2) an instruction list + blockhash.
 * VERIFY the exact keys with `npm run probe` and adjust the two lines marked below if needed.
 */
export function toTransaction(build: any, feePayer: PublicKey): Transaction | VersionedTransaction {
  const ser = build.transaction ?? build.tx ?? build.serializedTransaction; // VERIFY
  if (typeof ser === "string") {
    const bytes = b64(ser);
    try { return VersionedTransaction.deserialize(bytes); } catch { return Transaction.from(bytes); }
  }
  const ixs: any[] = build.instructions ?? [];
  const blockhash = build.blockhash ?? build.recentBlockhash; // VERIFY
  if (!ixs.length || !blockhash) throw new Error("Unexpected build response from Panta (no transaction or instructions).");
  const tx = new Transaction({ feePayer, recentBlockhash: blockhash });
  for (const ix of ixs) {
    tx.add(new TransactionInstruction({
      programId: new PublicKey(ix.programId),
      keys: (ix.accounts ?? ix.keys ?? []).map((k: any) => ({ pubkey: new PublicKey(k.pubkey), isSigner: !!k.isSigner, isWritable: !!k.isWritable })),
      data: typeof ix.data === "string" ? Buffer.from(ix.data, "base64") : Buffer.from(ix.data ?? []), // VERIFY encoding
    }));
  }
  return tx;
}

export async function signAndSend(wallet: WalletContextState, build: any): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) throw new Error("Connect a wallet first.");
  const tx = toTransaction(build, wallet.publicKey);
  const signed = await wallet.signTransaction(tx as any);
  const sig = await connection.sendRawTransaction(signed.serialize());
  const latest = await connection.getLatestBlockhash();
  await connection.confirmTransaction({ signature: sig, ...latest }, "confirmed");
  return sig;
}

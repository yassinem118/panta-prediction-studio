"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
const WalletButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function Nav() {
  return (
    <header className="border-b" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold">Panta Prediction Studio</Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/">Markets</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/create">Create market</Link>
          <WalletButton />
        </nav>
      </div>
    </header>
  );
}

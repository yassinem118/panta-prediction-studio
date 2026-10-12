"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { StatusPill } from "./StatusPill";
const WalletButton = dynamic(async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton, { ssr: false });

const links = [["/", "Markets"], ["/portfolio", "Portfolio"], ["/create", "Create"]] as const;

export function Nav() {
  const path = usePathname();
  return (
    <header style={{ borderBottom: "1px solid var(--line)", background: "var(--bg)", position: "sticky", top: 0, zIndex: 20 }}>
      <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden><rect x="1" y="6" width="15" height="14" rx="4" fill="var(--yes)" /><rect x="12" y="6" width="13" height="14" rx="4" fill="var(--no)" /></svg>
          Panta Studio
        </Link>
        <nav className="flex gap-1 text-sm">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-1.5" style={{ background: path === href ? "var(--raised)" : "transparent", color: path === href ? "var(--ink)" : "var(--mute)" }}>{label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4"><StatusPill /><WalletButton /></div>
      </div>
    </header>
  );
}

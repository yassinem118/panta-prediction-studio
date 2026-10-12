import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Panta Prediction Studio",
  description: "Browse, trade, create and claim Panta prediction markets on Solana.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
          <footer className="mx-auto max-w-5xl px-4 py-8 text-sm" style={{ color: "var(--mute)" }}>
            Powered by Panta · Built by Yassine Elwannase — Maroc, Fès
          </footer>
        </Providers>
      </body>
    </html>
  );
}

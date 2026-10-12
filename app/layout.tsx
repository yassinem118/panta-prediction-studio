import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Nav } from "@/components/Nav";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "Panta Studio: trade, create and share prediction markets",
  description: "A prediction-market terminal on Solana built on the Panta API: edge calculator, flow analysis, shareable calls and embeds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()" }} />
      </head>
      <body>
        <Providers>
          <Nav />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          <footer className="mx-auto max-w-6xl px-4 py-8 text-sm mute">
            Powered by Panta · Built by Yassine Elwannase — Maroc, Fès
          </footer>
        </Providers>
      </body>
    </html>
  );
}

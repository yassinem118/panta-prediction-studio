import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const title = (q.get("title") ?? "Prediction market").slice(0, 120);
  const side = q.get("side") === "NO" ? "NO" : "YES";
  const entry = Number(q.get("entry") ?? 0.5);
  const now = q.get("now") ? Number(q.get("now")) : undefined;
  const color = side === "YES" ? "#2BD67B" : "#FF5470";
  const move = now !== undefined ? Math.round((now - entry) * 100) : undefined;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0C0F1A", color: "#EEF0FA", padding: 64, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 30, color: "#8A93B5" }}>Panta Prediction Studio</div>
        <div style={{ display: "flex", fontSize: 58, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ display: "flex", background: color, color: "#052E17", fontSize: 44, fontWeight: 800, padding: "10px 28px", borderRadius: 14 }}>
            Called {side} at {Math.round(entry * 100)}¢
          </div>
          {move !== undefined && (
            <div style={{ display: "flex", fontSize: 40, color: move >= 0 ? "#2BD67B" : "#FF5470" }}>
              now {Math.round((now as number) * 100)}¢ ({move >= 0 ? "+" : ""}{move})
            </div>
          )}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#8A93B5" }}>Powered by Panta · Solana</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

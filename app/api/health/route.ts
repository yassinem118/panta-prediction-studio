import { NextResponse } from "next/server";
const BASE = process.env.PANTA_BASE_URL ?? "https://live-api.panta.market/api/v1";
export async function GET() {
  const key = process.env.PANTA_API_KEY;
  if (!key) return NextResponse.json({ keyConfigured: false, upstream: null });
  try {
    const r = await fetch(`${BASE}/categories/`, { headers: { "X-Api-Key": key }, cache: "no-store" });
    return NextResponse.json({ keyConfigured: true, keyEnv: key.startsWith("pk_live_") ? "live" : "test", upstream: r.status });
  } catch { return NextResponse.json({ keyConfigured: true, upstream: 0 }); }
}

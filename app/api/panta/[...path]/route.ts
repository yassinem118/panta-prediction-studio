import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.PANTA_BASE_URL ?? "https://live-api.panta.market/api/v1";
const KEY = process.env.PANTA_API_KEY;
const ALLOWED = ["markets", "categories", "positions", "primaryorderquote", "primaryorderbuild", "primaryordersubmit", "claim", "trades"];

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  if (!KEY) return NextResponse.json({ code: "no_key", message: "PANTA_API_KEY is not set on the server." }, { status: 500 });
  const { path } = await ctx.params;
  if (!ALLOWED.includes(path[0])) return NextResponse.json({ code: "forbidden", message: "Route not allowed." }, { status: 403 });
  const url = `${BASE}/${path.join("/")}/${req.nextUrl.search}`; // Panta requires trailing slashes
  const hasBody = !["GET", "HEAD"].includes(req.method);
  const up = await fetch(url, {
    method: req.method,
    headers: { "X-Api-Key": KEY, "Content-Type": "application/json" },
    body: hasBody ? await req.text() : undefined,
    cache: "no-store",
  });
  return new NextResponse(await up.text(), { status: up.status, headers: { "Content-Type": up.headers.get("content-type") ?? "application/json" } });
}
export const GET = proxy;
export const POST = proxy;

// Server-side Panta fetch (used by the share page + metadata). Never imported by client components.
const BASE = process.env.PANTA_BASE_URL ?? "https://live-api.panta.market/api/v1";
export async function pantaGet(path: string): Promise<any | null> {
  const key = process.env.PANTA_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`${BASE}/${path}`, { headers: { "X-Api-Key": key }, next: { revalidate: 30 } });
    return res.ok ? await res.json() : null;
  } catch { return null; }
}

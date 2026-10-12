export function callPath(p: { id: string; side: "YES" | "NO"; entry: number; stake?: number }) {
  const q = new URLSearchParams({ side: p.side, entry: p.entry.toFixed(3) });
  if (p.stake) q.set("stake", String(p.stake));
  return `/call/${p.id}?${q.toString()}`;
}

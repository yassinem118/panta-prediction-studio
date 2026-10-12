export function PriceChart({ series }: { series: { t: number; p: number }[] }) {
  if (series.length < 2) return <p className="mute text-sm">Not enough priced trades yet to draw a chart.</p>;
  const W = 640, H = 180, P = 8;
  const t0 = series[0].t, t1 = series[series.length - 1].t || t0 + 1;
  const ps = series.map((s) => s.p);
  const lo = Math.max(0, Math.min(...ps) - 0.05), hi = Math.min(1, Math.max(...ps) + 0.05);
  const x = (t: number) => P + ((t - t0) / Math.max(1, t1 - t0)) * (W - 2 * P);
  const y = (p: number) => H - P - ((p - lo) / Math.max(0.01, hi - lo)) * (H - 2 * P);
  const line = series.map((s, i) => `${i ? "L" : "M"}${x(s.t).toFixed(1)},${y(s.p).toFixed(1)}`).join(" ");
  const last = series[series.length - 1];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="YES price over time from recent trades">
        <path d={`${line} L${x(last.t)},${H - P} L${x(series[0].t)},${H - P} Z`} fill="var(--yes)" opacity=".12" />
        <path d={line} fill="none" stroke="var(--yes)" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx={x(last.t)} cy={y(last.p)} r="4.5" fill="var(--yes)" />
      </svg>
      <div className="mute flex justify-between text-xs"><span>{Math.round(lo * 100)}¢</span><span>YES price from the last {series.length} trades</span><span>{Math.round(hi * 100)}¢</span></div>
    </div>
  );
}

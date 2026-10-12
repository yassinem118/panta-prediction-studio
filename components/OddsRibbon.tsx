export function OddsRibbon({ yes, large }: { yes?: number; large?: boolean }) {
  if (yes === undefined) return <div className={`ribbon ${large ? "ribbon-lg" : ""} ribbon-empty`} aria-label="Price unavailable" />;
  const y = Math.min(0.97, Math.max(0.03, yes));
  return (
    <div className={`ribbon ${large ? "ribbon-lg" : ""}`} role="img" aria-label={`YES ${Math.round(yes * 100)} cents, NO ${Math.round((1 - yes) * 100)} cents`}>
      <div className="ribbon-yes" style={{ width: `${y * 100}%` }}>YES {Math.round(yes * 100)}¢</div>
      <div className="ribbon-no">NO {Math.round((1 - yes) * 100)}¢</div>
    </div>
  );
}

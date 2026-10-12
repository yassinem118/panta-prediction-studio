/** Binary-market maths. p = price of the side you buy (0-1), q = your own probability, stake in USDC. */
export function edgeMath(p: number, q: number, stake: number) {
  if (!(p > 0 && p < 1) || !(stake > 0)) return undefined;
  const shares = stake / p;
  return {
    shares,
    profit: shares - stake,          // if your side wins
    breakeven: p,                    // probability you need for 0 expected profit
    edge: q - p,                     // your belief minus the market's
    ev: q * shares - stake,          // expected profit
    kelly: Math.max(0, (q - p) / (1 - p)), // full-Kelly fraction of bankroll
  };
}
export const money = (v: number) => `${v < 0 ? "-" : ""}$${Math.abs(v).toFixed(2)}`;

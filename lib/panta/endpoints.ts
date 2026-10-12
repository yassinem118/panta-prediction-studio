// Routes confirmed from the public Panta docs / API reference. Trailing slashes are required by Panta
// (the server proxy adds them). Payload field names marked VERIFY: run `npm run probe` to confirm.
export const E = {
  markets: "markets/",
  market: (id: string) => `markets/${id}/`,
  trades: (id: string) => `markets/${id}/trades/`,
  categories: "categories/",
  positions: (wallet: string) => `positions/?wallet=${encodeURIComponent(wallet)}`,
  buyQuote: "primaryorderquote/",
  buyBuild: "primaryorderbuild/",
  buySubmit: "primaryordersubmit/",
  createQuote: "markets/create/quote/",
  createBuild: "markets/create/build/",
  createRegister: "markets/create/register/",
  claimBuild: "claim/build/",
  creatorFees: "claim/creator-fees/",
  tradeReport: "trades/report/",
} as const;

# Panta Studio

**A prediction-market terminal for Solana, built end to end on the Panta API.**
Browse live markets, size your bet with an edge calculator, trade from your own wallet, create markets, and share calls that track how they age.

Built for the **Panta API Sidetrack** of Colosseum Crypto World's Fair 2026.

| | |
| --- | --- |
| Live demo | `[https://panta-prediction-studio.vercel.app/]` |
| Demo video | `[https://www.loom.com/share/5b5c400ecaa347d2ada31676ef04f045]` |
| Author | Yassine Elwannase |

---

## Why this exists

Prediction markets are usually a destination you visit. Panta exposes them as infrastructure, so any product can embed them. Panta Studio is a thin, fast client that shows the whole lifecycle through the API alone: discover, quote, buy, hold, claim, and create. It also adds the tools a trader actually wants before clicking buy: an honest view of who is trading, and the maths of whether the price is worth paying.

Panta never holds user keys. Every transaction is built by Panta, signed in the user's wallet, and broadcast by this app.

## What it does

**Trade**
- Live market feed with category filters, search, sorting (most traded, most contested) and cursor pagination.
- Market page with YES/NO odds, price chart, trade tape and a 20-second live refresh.
- Quote, sign and buy YES or NO with Phantom, Solflare or any Wallet Standard wallet.
- Portfolio with positions and one-click claims.

**What sets it apart**
- **Edge calculator.** Enter your own probability and see payoff, break-even, expected value, and a half-Kelly stake sized to your bankroll.
- **Flow lens.** Price history and trader analysis built from Panta's public trade tape: YES/NO money flow, number of traders, largest trade, and wallet concentration.
- **Shareable calls.** After a buy, share a link and a social card showing your entry price and how the market has moved since. There is no database: the call lives in the URL and is priced live from Panta.
- **Embeddable widget.** Any market as an iframe (`/embed/{marketId}`) for blogs, communities and creators.
- **Market builder.** Templates that write a clear question and resolution rule, with the exact USDC creation fee shown before you sign.

**Product details**
- Light and dark themes, responsive layout, keyboard focus states, reduced-motion support.
- Real error states: when the API fails, the interface shows the API's own message. There is no mock data anywhere.

## How the Panta API is used

Base URL: `https://live-api.panta.market/api/v1` (trailing slashes required, `X-Api-Key` header).

| Feature | Endpoints |
| --- | --- |
| Feed and filters | `GET /markets/`, `GET /categories/` |
| Market page | `GET /markets/{id}/`, `GET /markets/{id}/trades/` |
| Buy YES/NO | `POST /primaryorderquote/`, `POST /primaryorderbuild/`, wallet signs, `POST /primaryordersubmit/` |
| Portfolio | `GET /positions/?wallet=` |
| Claim winnings | `POST /claim/build/` |
| Create a market | `POST /markets/create/quote/`, `POST /markets/create/build/`, wallet signs, `POST /markets/create/register/` |
| Attribution | `POST /trades/report/` |

## Architecture

```
Browser (Next.js client)
   │  fetch /api/panta/*
   ▼
Next.js route handler  ── injects X-Api-Key, adds trailing slash, allow-lists routes
   │
   ▼
Panta API  ── returns quotes and UNSIGNED transactions
   ▲
   │  signature
Wallet signs ──► our Solana RPC broadcasts ──► signature reported back to Panta
```

- The API key lives only on the server and is never sent to the browser.
- The proxy only forwards an allow-list of Panta routes.
- Shared calls are encoded in the URL; the social card is rendered on demand at `/api/og`.

```
app/            pages (feed, market, portfolio, create, call, embed) and API routes
components/     OddsRibbon, PriceChart, TapeLens, TradePanel, QuoteView, ...
lib/panta/      endpoints, client, flows (quote → build → sign → submit), analytics, edge maths
scripts/        setup, get-key, probe
```

## Getting started

Requirements: Node 20.9 or newer.

```bash
git clone https://github.com/yassinem118/panta-prediction-studio.git
cd panta-prediction-studio
npm install

npm run get-key -- live   # logs in to your Panta account and writes a key to .env.local
# or: npm run setup       # paste an existing key

npm run probe             # prints the real API response shapes
npm run dev               # http://localhost:3000
```

### Test key vs live key

| Key | What the API returns |
| --- | --- |
| `pk_test_...` | Sandbox fixtures: one fake market, no mainnet data |
| `pk_live_...` | Real Panta markets on Solana mainnet |

Reads, quotes and builds are free for both. Panta runs on **Solana mainnet** and has no testnet, so a signed buy or market creation spends real USDC.

### Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `PANTA_API_KEY` | server | Panta API key |
| `PANTA_BASE_URL` | server | Defaults to `https://live-api.panta.market/api/v1` |
| `NEXT_PUBLIC_SOLANA_RPC` | public | Solana mainnet RPC (use a private RPC for reliability) |
| `NEXT_PUBLIC_SITE_URL` | public | Deployed URL, used for share-card metadata |

### Deploy to Vercel

1. Import the repository.
2. Add the variables above under **Settings → Environment Variables** for Production, Preview and Development.
3. **Redeploy.** Vercel applies variables only to new deployments.
4. Open `/api/health`: it should report `keyConfigured: true`.

## Security

- Non-custodial: the app never sees or stores private keys.
- The Panta API key is server-side only and excluded from git (`.env*`).
- Quotes expire (about 90 seconds for buys, about 5 minutes for market creation) and the interface shows what you will pay before you sign.
- Calls shared by link are informational and are not financial advice.

## Roadmap

- Secondary-market selling and price alerts.
- Creator dashboard with fee claims.
- Wallet leaderboard and call track record.
- Localized interface (Arabic, French).

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS 4 · @solana/web3.js · Solana wallet-adapter

---

Powered by [Panta](https://panta.market).

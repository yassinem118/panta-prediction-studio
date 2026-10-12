# Panta Prediction Studio

A wallet-connected prediction-market terminal on Solana, built entirely on the **Panta API**: browse live markets, buy YES/NO, track positions, claim winnings and create new markets. Panta never holds user keys.

Built for the **Panta API Sidetrack** — Colosseum Crypto World's Fair 2026 (Superteam Earn).

- Live demo: `[PASTE DEPLOYED URL]`
- Demo video: `[PASTE VIDEO URL]`
- Colosseum submission: `[PASTE URL]`

## What makes it different

- **Edge calculator**: set your own probability and see payoff, break-even and expected value, then size the bet with half-Kelly from your bankroll.
- **Flow lens**: price chart and trader analysis built from Panta's public trade tape (YES/NO money flow, traders, whale concentration).
- **Shareable calls**: after a buy, share a link and a social card showing your entry price and how the market has moved since. No database: the call lives in the URL and is priced live from Panta.
- **Embeddable widget**: any market as an iframe (`/embed/{id}`) for blogs, communities and creators.
- **Market builder**: templates that write clear questions and resolution rules, with the exact USDC fee shown before signing.

## Why

Prediction markets are usually a destination. Panta exposes the infrastructure as an API, so any product can embed them. This project is a thin client that proves the API alone is enough for the full lifecycle: discover → quote → buy → hold → claim, plus market creation.

## Panta API integration

| Feature | Panta endpoints |
| --- | --- |
| Market feed, categories | `GET /markets/`, `GET /categories/` |
| Market detail + trade tape | `GET /markets/{id}/`, `GET /markets/{id}/trades/` |
| Buy YES/NO | `POST /primaryorderquote/` → `POST /primaryorderbuild/` → wallet signs → `POST /primaryordersubmit/` |
| Portfolio | `GET /positions/?wallet=` |
| Claim winnings | `POST /claim/build/` |
| Create market | `POST /markets/create/quote/` → `/create/build/` → wallet signs → `/create/register/` |
| Attribution | `POST /trades/report/` |

```
Browser ─► /api/panta/* (Next.js route, holds X-Api-Key) ─► live-api.panta.market/api/v1
   └─► Wallet signs the unsigned tx ─► our Solana RPC broadcasts ─► signature reported to Panta
```

- The API key never reaches the browser; the proxy only allows the routes above.
- There is no mock data. If the API fails, the UI shows the API's own error.

## Run it

```bash
cp .env.example .env.local     # add your pk_test_... key (docs.panta.market → Quickstart)
npm install
npm run probe                  # prints real API response shapes
npm run dev
```

> Panta runs on **Solana mainnet** (no testnet). Buys and market creation use real USDC; quotes and builds are free.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS 4 · @solana/web3.js · Solana wallet-adapter

Yassine Elwannase — Fès, Morocco

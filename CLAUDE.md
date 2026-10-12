# CLAUDE.md — Panta Prediction Studio

## What this project is
A Next.js prediction-market terminal on Solana, built on the **Panta API**, for the **Panta API Sidetrack** of Colosseum Crypto World's Fair 2026 (submitted on Superteam Earn). Judges score: meaningful Panta API integration, technical execution, UX, originality, impact, traction. A working deployed demo and an English README explaining the Panta integration are mandatory.

Owner: Yassine (Fès, Morocco). He speaks Moroccan Arabic (Darija) and French. Reply to him in Darija unless he writes in another language; keep code, comments, README and UI text in English.

## Commands
- `npm install`
- `npm run dev` — http://localhost:3000 (restart after any `.env.local` change)
- `npm run setup` — paste an existing Panta key into `.env.local` and validate it
- `npm run get-key` — log in with your Panta account and create a fresh `pk_test_` key into `.env.local` (secret never printed)
- `npm run probe` — prints REAL Panta responses (needs `.env.local`); use it to verify field names
- `npm run build` — must pass before deploying to Vercel

## Environment (`.env.local`, never commit)
- `PANTA_API_KEY` — server-only, `pk_test_...` (create it at docs.panta.market → Authentication guide). No quotes, no spaces.
- `PANTA_BASE_URL` — default `https://live-api.panta.market/api/v1`
- `NEXT_PUBLIC_SOLANA_RPC` — use a private mainnet RPC (Helius/QuickNode) for demos
- `NEXT_PUBLIC_SITE_URL` — deployed URL (used for share-card metadata)

## Architecture
- `app/api/panta/[...path]/route.ts` — server proxy. Injects `X-Api-Key`, appends the trailing slash, only allows whitelisted route prefixes. The key must never reach the browser.
- `lib/panta/endpoints.ts` — all Panta routes in one place.
- `lib/panta/client.ts` — browser client (calls `/api/panta/...`).
- `lib/panta/flows.ts` — buy / create-market / claim: quote → build → wallet signs → broadcast on our RPC → submit/register → attribution report.
- `lib/panta/solana.ts` — turns a Panta build response (serialized tx OR instruction list + blockhash) into a transaction; `signAndSend`.
- `lib/panta/normalize.ts` — tolerant readers for market data (shows "—" when a field is missing, never invents data).
- `lib/panta/analytics.ts` — price series and trade-tape stats from `/markets/{id}/trades/`.
- `lib/panta/edge.ts` — edge calculator maths (payoff, break-even, EV, Kelly).
- `lib/panta/server.ts` — server-side Panta fetch (share page / metadata).
- Pages: `/` feed, `/markets/[id]` detail + trade panel, `/portfolio`, `/create`, `/call/[id]` shareable call, `/embed/[id]` iframe widget. `/api/og` renders the social card; `/api/health` powers the status pill.

## Panta API facts (base `https://live-api.panta.market/api/v1`)
- Trailing slashes are REQUIRED. Auth: `X-Api-Key` header. Errors: `{ "code", "message" }` — switch on `code`.
- **Solana MAINNET only. There is no testnet.** Buys and market creation spend real USDC (market creation ≈ 50 USDC). Quotes and builds are free. Never sign or broadcast during automated tests.
- Endpoints: `GET /markets/` (cursor-paginated), `GET /markets/{id}/`, `GET /markets/{id}/trades/`, `GET /categories/`, `GET /positions/?wallet=`, `POST /primaryorderquote/` (~90s quote), `POST /primaryorderbuild/`, `POST /primaryordersubmit/`, `POST /markets/create/quote/` (~5 min session), `POST /markets/create/build/`, `POST /markets/create/register/`, `POST /claim/build/`, `POST /claim/creator-fees/`, `POST /trades/report/`.
- Amounts: market creation uses USDC base units as integer strings (6 decimals); primary buy uses decimal strings (`"20.00"`).

## Known open items (verify against real responses, do not guess)
Lines tagged `// VERIFY` hold guessed field names. Run `npm run probe`, compare with the real JSON, then fix:
1. Quote/build request bodies in `lib/panta/flows.ts` and `components/TradePanel.tsx` (`marketId`, `side`, `amount`, `wallet`).
2. Build response shape in `lib/panta/solana.ts` (`transaction` vs `instructions` + `blockhash`, instruction `data` encoding).
3. Market, trade and position field names in `normalize.ts`, `analytics.ts`, `app/portfolio/page.tsx` (e.g. claimable flag).
4. Create-market payload in `app/create/page.tsx` (title, description, category, end date, any required fields the API returns in its error).
When the API returns an error, read its `code`/`message` — it usually names the missing field.

## Rules
- No mock or fallback data. If the API fails, show the real error (`components/ErrorBox.tsx`). Do not add fake stats, fake badges ("100% Verified") or marketing claims that are not true.
- Keep the API key server-side. Never use `NEXT_PUBLIC_` for secrets.
- Do not custody or request private keys; the user's wallet always signs.
- Keep the UI consistent with the design tokens in `app/globals.css` (light and dark themes through CSS variables; indigo accent, green YES, red NO). Change colours only in the token block at the top of that file. Sentence-case copy, active-voice button labels, clear error messages that say how to fix the problem.
- Prefer small, typed, readable changes. Run `npm run build` after changes. Do not commit `.env*`.
- Panta attribution: keep "Powered by Panta" visible (footer, embed, share card).

## Submission checklist (hackathon)
Registered and submitted on Colosseum Crypto World's Fair AND on Superteam Earn (Panta Sidetrack) · deployed demo URL (Vercel, with env vars set) · README + SUBMISSION.md updated with real links · 2–3 min English demo video on the deployed site (see `DEMO_VIDEO_SCRIPT.md`) · only real traction numbers · GitHub repo has a description and topics.

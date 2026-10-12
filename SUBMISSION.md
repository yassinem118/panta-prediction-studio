# Superteam Earn — Panta Sidetrack (copy/paste, English)

**Project:** Panta Prediction Studio
**One-liner:** A wallet-connected prediction-market terminal on Solana, powered end-to-end by the Panta API.

**What we built / problem:** Embedding prediction markets in a product normally means building the whole stack. Panta Prediction Studio shows the full lifecycle through the Panta API alone: users discover markets, buy YES/NO, follow positions, claim winnings and create their own markets from one interface.

**What makes it different:** an edge calculator (your probability vs the market's, expected value, half-Kelly sizing), a flow lens built from the public trade tape, shareable calls with live-tracked social cards, embeddable market widgets and a market builder with templates.

**How the Panta API is integrated:**
- Discovery: `GET /markets/`, `/categories/`, `/markets/{id}/`, `/markets/{id}/trades/` drive the feed, filters, detail page and trade tape.
- Trading: `POST /primaryorderquote/`, `/primaryorderbuild/`, then the user's wallet signs, we broadcast on our RPC and call `/primaryordersubmit/`.
- Portfolio and claims: `GET /positions/?wallet=` and `POST /claim/build/`.
- Market creation: `POST /markets/create/quote/`, `/create/build/`, wallet signature, `/create/register/`.
- Attribution: `POST /trades/report/` after every confirmed transaction.
A server-side proxy keeps the API key private; Panta never custodies funds.

**Links:** Live demo `[URL]` · Video `[URL]` · GitHub https://github.com/yassinem118/panta-prediction-studio · Colosseum `[URL]`

**Traction:** `[Only real numbers: test trades, markets created, testers. Delete the line if none.]`

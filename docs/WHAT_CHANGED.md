# What was wrong in the Gemini version (lib/pantaapi.ts) and what replaced it
- Wrong base URL (`api.panta.market/v1`); the real one is `https://live-api.panta.market/api/v1`.
- No `X-Api-Key` header, so every call failed and the app silently showed hard-coded FALLBACK_MARKETS.
- Invented endpoints (`/markets`, `/markets/quote`); real routes need trailing slashes (`/markets/`, `/markets/create/quote/`).
- Fee in SOL: Panta charges USDC.
- Key exposed via NEXT_PUBLIC_*: now server-side proxy.
- Fake headers/telemetry ("Zero-Bug-Production") and fake stats removed.
- Missing: wallet signing, buy flow, positions, claims, attribution: all added.

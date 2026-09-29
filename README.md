# 🔮 Panta Prediction Studio

An interactive studio built on top of **Panta Network** for managing, querying, and visualizing decentralized prediction markets with real-time data streams and enterprise-grade resilience.

---

## ✨ Features

- **Panta API Integration:** Direct communication with Panta Network endpoints for prediction markets and fee quotes.
- **Enterprise Resilience:** Built-in in-memory caching with TTL, exponential backoff, and robust mock fallbacks for 100% uptime.
- **Real-Time Data Feed:** Visualizes current market odds, liquidity, and active prediction pools.
- **Modern UI & UX:** Fast, accessible interface built with Next.js 16 (Turbopack) and Tailwind CSS.
- **Type-Safe:** End-to-end TypeScript architecture ensuring reliability across API calls and payload sanitization.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Client:** Axios with Secure Instance & Error Handling (`lib/pantaapi.ts`)

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
git clone [https://github.com/yassinem118/panta-prediction-studio.git](https://github.com/yassinem118/panta-prediction-studio.git)
cd panta-prediction-studio
npm install
npm run dev
npm run build

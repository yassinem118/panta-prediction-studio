# Checklist نهائي
## 1) تشغيل محلي (المشكل ديالك: `.env.local: not found`)
```
cp .env.example .env.local
```
- حل `.env.local` ف VS Code وبدل السطر: `PANTA_API_KEY=pk_test_...` (بلا علامات تنصيص، بلا فراغات)
- جيب المفتاح من docs.panta.market ← Authentication guide ← register ← create API key
- `npm install` ثم `npm run probe` ثم `npm run dev` (عاود شغل dev إلا بدلتي .env.local)
## 2) تأكد
- [ ] النقطة الخضراء ف الهيدر كتقول "Panta live · mainnet"
- [ ] لائحة الأسواق حقيقية (بلا mock)
- [ ] صفحة السوق: chart + Flow lens + Edge calculator
- [ ] `npm run probe`: قارن الحقول بملفات `lib/panta/*` (الأسطر `VERIFY`)
- [ ] جرب شراء صغير (≈1 USDC). **mainnet = فلوس حقيقية**
- [ ] بعد الشراء جرب "Copy call link" وحل الرابط
## 3) Deploy
- [ ] Vercel: ضيف `PANTA_API_KEY` و `NEXT_PUBLIC_SOLANA_RPC` (RPC خاص) و `NEXT_PUBLIC_SITE_URL`
## 4) التسليم
- [ ] Colosseum الرسمي + Panta Sidetrack ف Superteam Earn
- [ ] README و SUBMISSION بالروابط الحقيقية
- [ ] فيديو 2–3 دقايق على الموقع المنشور (DEMO_VIDEO_SCRIPT.md)
- [ ] ضيف وصف للريبو ف GitHub (About) ونقط topics: solana, prediction-markets, panta
- [ ] Traction حقيقي فقط

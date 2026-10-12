# Checklist نهائي
## 1) تشغيل محلي
```
npm install
npm run get-key      # كيدخل لحسابك ف Panta (email + password) وكيصاوب مفتاح جديد ويحطو ف .env.local بلا ما يبينو
# أو إلا عندك مفتاح:
npm run setup        # كتلصق المفتاح ف terminal (ماشي ف الشات)
npm run probe        # كيطبع الردود الحقيقية
npm run dev
```
- `.env.local` كيتصاوب أوتوماتيكيا، ما بقى حتى مشكل "not found"
- ما تلصق أبدا المفتاح ولا الباسورد ولا الـtokens ف الشات أو ف GitHub
## 2) تأكد
- [ ] النقطة ف الهيدر: "Panta live · mainnet"
- [ ] لائحة الأسواق حقيقية (بلا mock)
- [ ] `npm run probe`: سيفط الناتج (بلا أسرار) باش نطابقو الحقول (الأسطر `VERIFY`)
- [ ] صفحة السوق: chart + Flow lens + Edge calculator
- [ ] شراء صغير (≈1 USDC). **mainnet = فلوس حقيقية**
- [ ] "Copy call link" كيخدم والرابط كيتحل
- [ ] زر Light/Dark mode
## 3) Deploy (Vercel)
- [ ] Environment Variables: `PANTA_API_KEY` و `NEXT_PUBLIC_SOLANA_RPC` (RPC خاص) و `NEXT_PUBLIC_SITE_URL`
## 4) التسليم
- [ ] Colosseum الرسمي + Panta Sidetrack ف Superteam Earn
- [ ] README و SUBMISSION بالروابط الحقيقية
- [ ] فيديو 2–3 دقايق على الموقع المنشور (DEMO_VIDEO_SCRIPT.md)
- [ ] وصف للريبو (About) + topics: solana, prediction-markets, panta
- [ ] Traction حقيقي فقط
- [ ] بدل المفتاح القديم (اللي تلصق ف الشات) بمفتاح جديد

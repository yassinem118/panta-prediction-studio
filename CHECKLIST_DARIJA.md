# Checklist قبل التسليم
## شروط المسابقة
- [ ] مسجل ف Colosseum Crypto World's Fair وسيفطتي المشروع ف الموقع الرسمي
- [ ] سيفطتي المشروع ف Panta Sidetrack على Superteam Earn
- [ ] كلشي بالإنجليزية
- [ ] Demo منشور (Vercel)، ماشي localhost
- [ ] شرح: شنو بنيتي + كيفاش Panta API مستعملة (SUBMISSION.md)
## تقني
- [ ] API key: سجل ف docs.panta.market (Quickstart) وجيب `pk_test_...` وحطو ف `.env.local`
- [ ] `npm install` ثم `npm run probe` وشوف الأشكال الحقيقية ديال الردود
- [ ] صحح الأسطر اللي فيها `VERIFY` (أسماء الحقول ف `lib/panta/flows.ts` و`solana.ts`)
- [ ] جرب `npm run dev`: لائحة الأسواق خاصها تجي من الـAPI (بلا mock)
- [ ] مهم: Panta كتخدم على **Solana mainnet** ما كاين testnet. الشراء كيخسر USDC حقيقي، جرب بمبلغ صغير
- [ ] ضيف `PANTA_API_KEY` ف Vercel (Environment Variables) ودير deploy
- [ ] أحسن RPC خاص (Helius/QuickNode) ف `NEXT_PUBLIC_SOLANA_RPC`
## قبل ما تسيفط
- [ ] حدث README و SUBMISSION بالروابط الحقيقية
- [ ] فيديو 2–3 دقايق على الموقع المنشور
- [ ] Traction حقيقي فقط
- [ ] مشكل؟ Discord ديال Panta، قناة #dev-chat

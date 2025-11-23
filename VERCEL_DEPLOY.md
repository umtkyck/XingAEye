# 🚀 XingAEye'ı Vercel'e Deploy Etme Rehberi

Projenizi Vercel'e deploy etmek için 2 yöntem var. İkisi de kolay!

---

## 🎯 Yöntem 1: Vercel Dashboard (En Kolay - Önerilen)

### Adım 1: GitHub'a Push Et

Projeniz zaten GitHub'da, bu adım tamam! ✅

### Adım 2: Vercel'e Git

1. 🌐 [vercel.com](https://vercel.com) adresine git
2. **"Sign Up"** veya **"Login"** tıkla
3. **"Continue with GitHub"** seç

### Adım 3: Repository'yi İmport Et

1. Vercel dashboard'da **"Add New..."** butonuna tıkla
2. **"Project"** seç
3. **"Import Git Repository"** bölümünde **"umtkyck/XingAEye"** repository'sini bul

   **Göremiyorsan:**
   - **"Adjust GitHub App Permissions"** tıkla
   - XingAEye repository'sine erişim ver
   - Sayfayı yenile

4. **"Import"** tıkla

### Adım 4: Proje Ayarları

Vercel otomatik algılayacak ama kontrol et:

```
Framework Preset: Next.js ✅ (otomatik algılanır)
Root Directory: web 👈 ÖNEMLI! "web" yaz
Build Command: npm run build (otomatik)
Output Directory: .next (otomatik)
Install Command: npm install (otomatik)
```

**📁 Root Directory Ayarı:**
- **"Root Directory"** bölümüne `web` yaz
- **"Edit"** tıkla ve `web` klasörünü seç

### Adım 5: Environment Variables (Opsiyonel)

**Gerekirse ekle:**

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token
```

**Nasıl eklenir:**
1. **"Environment Variables"** bölümünü bul
2. Her değişken için:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** URL'ini gir
   - **"Add"** tıkla

### Adım 6: Deploy Et! 🚀

1. **"Deploy"** butonuna tıkla
2. ☕ 1-2 dakika bekle
3. 🎉 Deploy tamamlandı!

**URL'in:**
```
https://xingaeye.vercel.app
```

veya Vercel'in verdiği random URL.

---

## 🎯 Yöntem 2: Vercel CLI (Terminal ile)

### Adım 1: Vercel CLI'yi Kur

```bash
npm install -g vercel
```

### Adım 2: Login Yap

```bash
vercel login
```

Email adresinle giriş yap (doğrulama emaili gelecek).

### Adım 3: Proje Klasörüne Git

```bash
cd /home/user/XingAEye
```

### Adım 4: İlk Deploy

```bash
vercel
```

**Sorulan sorular:**

```
? Set up and deploy "~/XingAEye"?
✅ Y (Enter)

? Which scope do you want to deploy to?
✅ Hesabını seç (ok tuşları ile)

? Link to existing project?
✅ N (Enter)

? What's your project's name?
✅ xingaeye (istediğin isim)

? In which directory is your code located?
✅ ./web (ÖNEMLI!)
```

### Adım 5: Production Deploy

Preview deploy olduktan sonra, production'a al:

```bash
vercel --prod
```

**URL'in:**
```
https://xingaeye.vercel.app
```

---

## 🔧 Deploy Sonrası Ayarlar

### Custom Domain Ekle (Opsiyonel)

1. Vercel Dashboard'a git
2. Projeyi seç
3. **Settings → Domains**
4. Domain ekle: `xingaeye.com`
5. DNS ayarlarını yap (Vercel gösterecek):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Environment Variables Güncelle

**Dashboard'da:**
1. **Settings → Environment Variables**
2. Değişken ekle/düzenle
3. **Redeploy** et

**CLI ile:**
```bash
vercel env add NEXT_PUBLIC_API_URL
# Value gir
# Production seç
```

---

## ✅ Deploy Kontrolü

### Test Et

1. **Ana sayfa:** https://xingaeye.vercel.app
   - ✅ `/landing`'e redirect olmalı

2. **Landing page:** https://xingaeye.vercel.app/landing
   - ✅ 3D scene görünmeli
   - ✅ Animasyonlar çalışmalı
   - ✅ Navigation bar olmalı

3. **Dashboard:** https://xingaeye.vercel.app/dashboard
   - ✅ Dashboard UI görünmeli

### Performance Kontrolü

**Vercel Analytics:**
- Dashboard → Analytics
- Speed Insights göreceksin
- Core Web Vitals takip et

**Lighthouse Test:**
```bash
# Chrome DevTools
# F12 → Lighthouse → Generate Report
```

Hedef:
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

---

## 🐛 Sorun Giderme

### Problem: Build hatası

**Hata:** `Module not found`

**Çözüm:**
```bash
cd web
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### Problem: 3D scene görünmüyor

**Kontrol et:**
1. `vercel.json` var mı? ✅
2. Root directory `web` mi? ✅
3. Dependencies yüklendi mi? ✅

**Çözüm:**
```bash
# Local test
cd web
npm install
npm run build
npm start
```

### Problem: Environment variables çalışmıyor

**Hatırla:**
- `NEXT_PUBLIC_` ile başlamalı (client-side için)
- Vercel dashboard'da eklenmiş olmalı
- Redeploy edilmiş olmalı

**Çözüm:**
1. Settings → Environment Variables → Ekle
2. Deployments → Latest → **...** → **Redeploy**

### Problem: Custom domain çalışmıyor

**Kontrol:**
1. DNS propagation bekle (5-10 dakika)
2. DNS ayarları doğru mu?
3. HTTPS sertifikası hazır mı? (otomatik, 1-2 dakika)

**Test:**
```bash
# DNS propagation kontrolü
nslookup xingaeye.com
# veya
dig xingaeye.com
```

---

## 🔄 Otomatik Deploy

### Git Push = Auto Deploy

Vercel GitHub'a bağlandıktan sonra:

```bash
git add .
git commit -m "Update landing page"
git push origin main
```

✨ **Otomatik deploy başlar!**

### Branch Preview

Her branch için ayrı preview URL:

```bash
git checkout -b feature/new-design
git push origin feature/new-design
```

Preview URL:
```
https://xingaeye-git-feature-new-design.vercel.app
```

### Pull Request Preview

PR açtığında otomatik preview gelir:
- PR'da comment olarak URL
- Her commit'te yeniden build

---

## 📊 Monitoring

### Vercel Dashboard

**Analytics:**
- Visitor sayısı
- Page views
- Top pages
- Top referrers

**Speed Insights:**
- Core Web Vitals
- Real User Monitoring (RUM)
- Performance over time

**Logs:**
- Runtime logs
- Build logs
- Function logs

**Functions:**
- Serverless function metrics
- Cold starts
- Execution time

### Alerts Kur

1. **Settings → Notifications**
2. **Email** veya **Slack** integration
3. Deploy başarısız olursa bildirim

---

## 💰 Vercel Plans

### Hobby (Free) - Senin için yeterli!

```
✅ Unlimited deployments
✅ Automatic HTTPS
✅ 100GB bandwidth/month
✅ Serverless Functions
✅ Edge Network (Global CDN)
✅ GitHub integration
✅ Custom domains
✅ Analytics (basic)
❌ Team collaboration
❌ Advanced analytics
```

### Pro ($20/month) - Daha sonra upgrade

```
✅ Everything in Hobby +
✅ Team collaboration
✅ Advanced analytics
✅ 1TB bandwidth
✅ Password protection
✅ Preview deployments protection
```

---

## 🎯 Post-Deploy Checklist

- [ ] Deploy başarılı oldu
- [ ] `/landing` görünüyor
- [ ] `/dashboard` çalışıyor
- [ ] 3D animasyonlar akıcı
- [ ] Mobile responsive
- [ ] Navigation çalışıyor
- [ ] Environment variables set edildi (gerekirse)
- [ ] Custom domain bağlandı (gerekirse)
- [ ] Analytics aktif
- [ ] Performance >90 (Lighthouse)
- [ ] GitHub auto-deploy çalışıyor

---

## 🚀 Hızlı Komutlar

```bash
# CLI ile deploy
vercel

# Production deploy
vercel --prod

# Environment variable ekle
vercel env add VARIABLE_NAME

# Logs görüntüle
vercel logs

# Domain ekle
vercel domains add xingaeye.com

# Projeyi sil
vercel remove xingaeye

# Help
vercel --help
```

---

## 📚 Faydalı Linkler

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)

---

## 🆘 Yardım

**Problem mi var?**
1. Bu dosyayı tekrar oku
2. [Vercel Support](https://vercel.com/support)
3. [Vercel Community](https://github.com/vercel/vercel/discussions)

**Email:**
support@xingaeye.com

---

## ✨ Bonus: Vercel Features

### Edge Functions
```javascript
// app/api/hello/route.ts
export const runtime = 'edge'

export async function GET() {
  return new Response('Hello from Edge!')
}
```

### Image Optimization
Next.js Image component otomatik optimize ediyor! ✅

### Analytics
```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Speed Insights
```bash
npm install @vercel/speed-insights

# app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
<SpeedInsights />
```

---

**Başarılar! 🎉**

Projen artık dünyaya açık:
```
https://xingaeye.vercel.app 🌍
```

Deploy ettiğinde bana söyle, birlikte kontrol edelim! 🚀

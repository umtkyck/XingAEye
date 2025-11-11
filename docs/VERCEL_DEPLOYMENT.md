# Vercel Deployment Guide

XingAEye web dashboard'unu Vercel'e deploy etmek için adım adım rehber.

## Yöntem 1: Vercel Dashboard ile Deploy (En Kolay)

### 1. GitHub Repository'yi Hazırla

Repository zaten GitHub'da, bu yüzden hazır!

### 2. Vercel'e Git

1. [vercel.com](https://vercel.com) adresine git
2. "Sign Up" veya "Login" yap (GitHub hesabınla giriş yapabilirsin)

### 3. New Project Oluştur

1. Dashboard'da **"Add New..."** → **"Project"** butonuna tıkla
2. **"Import Git Repository"** seç
3. GitHub'dan **XingAEye** repository'sini seç
4. Eğer göremiyorsan **"Adjust GitHub App Permissions"** tıklayıp repository erişimi ver

### 4. Proje Ayarlarını Yap

```
Project Name: xingaeye (veya istediğin isim)
Framework Preset: Next.js (otomatik algılanır)
Root Directory: web
Build Command: npm run build (otomatik)
Output Directory: .next (otomatik)
Install Command: npm install (otomatik)
```

### 5. Environment Variables Ekle

**Environment Variables** bölümünde:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
NEXT_PUBLIC_APP_NAME=XingAEye
```

### 6. Deploy Et!

**"Deploy"** butonuna tıkla ve bekle (1-2 dakika).

Deploy tamamlandığında:
- ✅ URL: `https://xingaeye.vercel.app` (veya seçtiğin isim)
- ✅ Otomatik HTTPS
- ✅ Global CDN

---

## Yöntem 2: Vercel CLI ile Deploy (Gelişmiş)

### 1. Vercel CLI Kur

```bash
npm install -g vercel
```

### 2. Login Yap

```bash
vercel login
```

Email adresin ile giriş yap.

### 3. Web Klasörüne Git

```bash
cd web
```

### 4. Environment Variables Ayarla

`.env.local` dosyası oluştur:

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
EOF
```

### 5. Deploy Et

İlk deployment için:

```bash
vercel
```

Sorulara cevaplar:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- What's your project's name? **xingaeye**
- In which directory is your code located? **./web**

Production'a deploy için:

```bash
vercel --prod
```

---

## Environment Variables Nerede Bulunur?

### 1. Backend API URL

Eğer backend'i henüz deploy etmediysen:
- Geçici olarak: `http://localhost:3000`
- Production'da: AWS ECS/Lambda URL'i (backend deploy'dan sonra)

### 2. Mapbox Token

Mapbox hesabı oluştur (ücretsiz):

1. [mapbox.com](https://mapbox.com) → Sign Up
2. **Account** → **Access Tokens**
3. **Create a token** tıkla
4. Token'ı kopyala

---

## Custom Domain Ekle (İsteğe Bağlı)

### Vercel Dashboard'da:

1. Projeye git
2. **Settings** → **Domains**
3. **Add** tıkla
4. Domain gir: `xingaeye.com`
5. DNS ayarlarını yap (Vercel gösterecek):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## Otomatik Deploy Ayarla

### GitHub Integration (Otomatik Aktif)

Her push'da otomatik deploy olur:

- `main` branch → Production
- Diğer branch'ler → Preview deployment

```bash
git push origin main
# Otomatik deploy başlar!
```

---

## Deploy Sonrası Test

### 1. Siteyi Aç

```
https://xingaeye.vercel.app
```

### 2. Logo Kontrolü

- ✅ Browser tab'da favicon görünmeli
- ✅ Sosyal medyada paylaşınca OG image görünmeli

### 3. API Bağlantısı

- DevTools → Console → Hata var mı?
- Backend'e bağlantı çalışıyor mu?

### 4. Mobile Responsive

- Chrome DevTools → Mobile view
- Mobilde düzgün görünüyor mu?

---

## Yaygın Sorunlar ve Çözümler

### Problem: "Module not found"

**Çözüm:**
```bash
cd web
rm -rf node_modules package-lock.json
npm install
vercel --prod
```

### Problem: Environment variables çalışmıyor

**Çözüm:**
1. Vercel Dashboard → Settings → Environment Variables
2. `NEXT_PUBLIC_` ile başlamalı (client-side için)
3. Redeploy et: **Deployments** → **...** → **Redeploy**

### Problem: Vercel build timeout

**Çözüm:**
```json
// package.json
{
  "scripts": {
    "build": "next build",
    "postbuild": "echo 'Build completed!'"
  }
}
```

---

## Üretim Optimizasyonu

### 1. Analytics Ekle (İsteğe Bağlı)

Vercel Dashboard'da:
- **Analytics** → **Enable**

### 2. Speed Insights

```bash
npm install @vercel/analytics
```

`web/src/app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

// ...layout içinde
<Analytics />
```

### 3. Image Optimization

Next.js otomatik optimize eder ama `next.config.js` kontrol et:
```javascript
images: {
  domains: ['xingaeye-videos.s3.amazonaws.com'],
  formats: ['image/avif', 'image/webp'],
}
```

---

## Monitoring

### Vercel Dashboard'da İzle:

1. **Deployments** → Deploy logları
2. **Analytics** → Ziyaretçi istatistikleri
3. **Speed Insights** → Performance metrikleri
4. **Logs** → Runtime logları

---

## Maliyet

### Vercel Hobby Plan (Ücretsiz)
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ❌ Team collaboration yok

### Pro Plan ($20/month)
- ✅ Team members
- ✅ Analytics
- ✅ Daha fazla bandwidth

---

## Hızlı Deploy Komutları

```bash
# Development
cd web
npm run dev

# Build test
npm run build
npm start

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Environment variables ekle
vercel env add NEXT_PUBLIC_API_URL

# Logs görüntüle
vercel logs
```

---

## Sonraki Adımlar

1. ✅ Backend'i deploy et (AWS)
2. ✅ Backend URL'ini Vercel env'e ekle
3. ✅ Mapbox token al
4. ✅ Custom domain ekle (opsiyonel)
5. ✅ SSL certificate (otomatik)
6. ✅ Monitoring kur

---

## Destek

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

Başarılı deploy! 🚀

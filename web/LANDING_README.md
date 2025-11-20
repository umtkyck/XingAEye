# 🚂 XingAEye Landing Page - Quick Start

## 🎨 Cutting-Edge 3D Landing Page

World-class landing page featuring WebGL, Three.js, custom shaders, and GSAP animations.

---

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd web
npm install
```

This will install:
- Three.js (3D engine)
- @react-three/fiber (React renderer)
- @react-three/drei (3D helpers)
- @react-three/postprocessing (Shader effects)
- GSAP (Animation library)
- Lenis (Smooth scroll)
- Postprocessing (Effects)

### 2. Generate Noise Texture

Open in browser:
```
http://localhost:3000/generate-noise.html
```

This will auto-download `noise.png`. Move it to `/public/noise.png`

**Or use online generator:**
- Go to https://noise-texture-generator.netlify.app/
- Generate 512x512 grayscale noise
- Download and save to `public/noise.png`

**Or skip it:**
- Landing page will work without it (just no grain overlay)

### 3. Run Development Server

```bash
npm run dev
```

### 4. View Landing Page

```
http://localhost:3000/landing
```

---

## 📁 File Structure

```
web/
├── src/
│   ├── app/
│   │   ├── landing/
│   │   │   ├── page.tsx          # Main landing page
│   │   │   ├── layout.tsx        # Landing layout
│   │   │   └── globals.css       # Landing styles
│   │   └── page.tsx              # Home (redirects to /landing)
│   ├── components/
│   │   └── landing/
│   │       ├── Scene3D.tsx       # WebGL 3D scene
│   │       ├── Hero.tsx          # Hero section
│   │       ├── Features.tsx      # Features grid
│   │       ├── Technology.tsx    # Tech stack
│   │       ├── Stats.tsx         # Animated counters
│   │       ├── CallToAction.tsx  # CTA section
│   │       └── Loader.tsx        # Loading screen
│   └── hooks/
│       └── useScrollAnimation.ts # Scroll effects
└── public/
    ├── noise.png                 # Grain texture (generate this)
    └── generate-noise.html       # Noise generator tool
```

---

## 🎨 Features

### ✨ Visual Effects
- [x] Custom dither shader (Bayer matrix 8x8)
- [x] WebGL 3D scene with distorted sphere
- [x] 1000-particle system
- [x] Glassmorphism UI
- [x] Gradient orbs
- [x] Grain texture overlay
- [x] Post-processing (Bloom, Chromatic Aberration, Noise)

### 🎬 Animations
- [x] GSAP character-by-character text reveal
- [x] Scroll-triggered section reveals
- [x] Animated number counters
- [x] Lenis smooth scroll
- [x] Float animations
- [x] Hover effects

### 📱 Responsive
- [x] Mobile (< 768px): Single column
- [x] Tablet (768px - 1024px): 2 columns
- [x] Desktop (> 1024px): 3 columns
- [x] 48px touch targets
- [x] Optimized 3D for mobile

---

## 🎯 Sections

1. **Hero** - Animated title, CTA buttons, stats
2. **Features** - 6 glassmorphic feature cards
3. **Technology** - 8 tech badges + architecture diagram
4. **Stats** - Animated counters (250+, 99.7%, 1.8s, 50K+)
5. **Call to Action** - Hero CTA card + contact info

---

## 🎨 Customization

### Change Colors

Edit `web/src/app/landing/globals.css`:

```css
/* Primary colors */
--electric-blue: #2563eb
--cyber-purple: #7c3aed
--neon-cyan: #06b6d4
```

### Adjust 3D Effects

Edit `Scene3D.tsx`:

```javascript
<MeshDistortMaterial
  distort={0.6}  // Change distortion (0.0 - 1.0)
  speed={2}      // Change animation speed
  color="#1e40af" // Change sphere color
/>
```

### Animation Speed

Edit `Hero.tsx`:

```javascript
gsap.from('.char', {
  stagger: 0.02,  // Character delay
  duration: 1,    // Animation duration
})
```

### Particle Count

Edit `Scene3D.tsx`:

```javascript
for (let i = 0; i < 1000; i++) {  // Change particle count
  // ...
}
```

---

## ⚡ Performance

### Current Optimizations
- Code splitting for 3D components
- Lazy loading below fold
- RequestAnimationFrame throttling
- High-performance WebGL settings
- Purged Tailwind CSS

### Performance Tips

**Mobile:**
```javascript
// Reduce particles on mobile
const particleCount = isMobile ? 500 : 1000
```

**Disable effects:**
```javascript
// Remove post-processing on low-end devices
{!isLowEnd && (
  <EffectComposer>
    <Bloom />
  </EffectComposer>
)}
```

---

## 🐛 Troubleshooting

### Issue: 3D scene not showing

**Fix:**
```bash
# Clear cache
rm -rf .next
npm run dev
```

### Issue: Animations laggy

**Fix:**
- Reduce particle count in `Scene3D.tsx`
- Disable post-processing effects
- Lower distortion amount

### Issue: Module not found errors

**Fix:**
```bash
npm install
npm run build
```

### Issue: Noise texture not loading

**Fix:**
1. Check `public/noise.png` exists
2. Or comment out grain overlay in `page.tsx`:
```javascript
{/* <div className="grain-overlay" /> */}
```

---

## 📦 Build for Production

```bash
npm run build
npm start
```

### Vercel Deploy

```bash
vercel --prod
```

Landing page will be at:
```
https://your-domain.vercel.app/landing
```

---

## 🎓 Technical Stack

| Technology | Purpose |
|------------|---------|
| Three.js | 3D graphics engine |
| React Three Fiber | React renderer for Three.js |
| @react-three/drei | 3D helpers & abstractions |
| @react-three/postprocessing | Shader effects |
| GSAP | Professional animations |
| Lenis | Smooth scrolling |
| Next.js 14 | React framework |
| Tailwind CSS | Utility-first CSS |

---

## 📚 Documentation

Full design system documentation:
```
docs/LANDING_PAGE_DESIGN.md
```

Includes:
- Complete color palette
- Typography scale
- Animation architecture
- Shader implementation
- Responsive breakpoints
- Design philosophy

---

## 🎨 Design Credits

Inspired by:
- Apple product pages (smooth animations)
- Stripe landing pages (clean hierarchy)
- Awwwards winners (cutting-edge 3D)
- Cyberpunk 2077 UI (futuristic aesthetics)

---

## 🆘 Support

**Issues?**
- Check troubleshooting section above
- Review design doc: `docs/LANDING_PAGE_DESIGN.md`
- Open an issue on GitHub

**Questions?**
- Email: support@xingaeye.com

---

## ✅ Checklist

- [ ] Run `npm install`
- [ ] Generate noise texture (`/generate-noise.html`)
- [ ] Move `noise.png` to `/public/`
- [ ] Run `npm run dev`
- [ ] Visit `/landing`
- [ ] Test on mobile
- [ ] Check performance (60fps)
- [ ] Customize colors/content
- [ ] Deploy to Vercel

---

**Happy building! 🚀**

Version: 1.0
Last Updated: 2024

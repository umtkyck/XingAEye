# XingAEye Web Application

Modern web dashboard for XingAEye Railroad Crossing Safety System.

## Features

- 🎨 Cutting-edge 3D landing page with WebGL + Three.js
- 🗺️ Real-time map view with crossing monitoring
- 🚨 Alert management and notifications
- 📊 Analytics and statistics dashboard
- 📱 Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **3D Graphics**: Three.js, React Three Fiber
- **Animation**: GSAP, Lenis
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Maps**: Mapbox GL JS

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Routes

- `/` - Redirects to landing page
- `/landing` - 3D landing page with WebGL effects
- `/dashboard` - Main application dashboard
- `/login` - Authentication page

## Deployment

This application is deployed on Vercel. See [VERCEL_DEPLOY.md](../VERCEL_DEPLOY.md) for deployment instructions.

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_backend_url
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

## License

MIT

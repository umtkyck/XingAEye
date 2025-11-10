import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'XingAEye - Railroad Crossing Safety',
    template: '%s | XingAEye',
  },
  description: 'AI-powered railroad crossing monitoring and safety system with real-time detection, alerts, and analytics',
  keywords: [
    'railroad crossing',
    'railway safety',
    'AI detection',
    'crossing monitoring',
    'train safety',
    'edge AI',
    'Jetson Orin Nano',
  ],
  authors: [{ name: 'XingAEye Team' }],
  creator: 'XingAEye',
  publisher: 'XingAEye',

  // Icons
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
    other: [
      {
        rel: 'icon',
        url: '/logo.svg',
      },
    ],
  },

  // Manifest
  manifest: '/manifest.json',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://xingaeye.com',
    siteName: 'XingAEye',
    title: 'XingAEye - Railroad Crossing Safety System',
    description: 'AI-powered railroad crossing monitoring with real-time detection, alerts, and analytics',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'XingAEye Railroad Crossing Safety System',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'XingAEye - Railroad Crossing Safety',
    description: 'AI-powered railroad crossing monitoring and safety system',
    images: ['/og-image.svg'],
    creator: '@xingaeye',
  },

  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },

  // Theme
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

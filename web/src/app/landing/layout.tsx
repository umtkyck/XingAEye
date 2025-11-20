import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'XingAEye - Next-Gen Railroad Crossing Safety',
  description: 'AI-powered railroad crossing monitoring with cutting-edge technology',
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

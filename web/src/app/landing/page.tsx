'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Navigation } from '@/components/landing/Navigation'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Technology } from '@/components/landing/Technology'
import { Stats } from '@/components/landing/Stats'
import { CallToAction } from '@/components/landing/CallToAction'
import { Scene3D } from '@/components/landing/Scene3D'
import { Loader } from '@/components/landing/Loader'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import Lenis from 'lenis'

export default function LandingPage() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenisRef.current?.destroy()
    }
  }, [])

  useScrollAnimation()

  return (
    <div className="relative bg-[#0a0a0f] text-white overflow-hidden">
      {/* Fixed 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Grain Texture Overlay */}
      <div
        className="fixed inset-0 z-10 pointer-events-none opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage: 'url(/noise.png)',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Navigation */}
      <Navigation />

      {/* Content */}
      <div className="relative z-20">
        <Hero />
        <Features />
        <Technology />
        <Stats />
        <CallToAction />
      </div>

      {/* Loading Screen */}
      <Loader />
    </div>
  )
}

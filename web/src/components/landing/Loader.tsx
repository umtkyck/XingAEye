'use client'

import { useEffect, useState } from 'react'
import gsap from 'gsap'

export function Loader() {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    // Hide loader after loading completes
    if (progress >= 100) {
      gsap.to('.loader', {
        opacity: 0,
        duration: 0.5,
        delay: 0.3,
        onComplete: () => setIsLoading(false),
      })
    }

    return () => clearInterval(interval)
  }, [progress])

  if (!isLoading) return null

  return (
    <div className="loader fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        {/* Logo Animation */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-black text-white">X</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-2xl font-bold text-white mb-4">
          XingAEye
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="mt-4 text-sm text-white/60">
          Loading... {Math.min(Math.round(progress), 100)}%
        </div>
      </div>
    </div>
  )
}

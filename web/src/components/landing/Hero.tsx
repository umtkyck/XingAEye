'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowRight, Play, Shield } from 'lucide-react'

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagasraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation with split text effect
      const titleChars = titleRef.current?.textContent?.split('') || []
      if (titleRef.current) {
        titleRef.current.innerHTML = titleChars
          .map((char, i) => `<span class="inline-block char" data-char="${i}">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('')

        gsap.from('.char', {
          opacity: 0,
          y: 100,
          rotationX: -90,
          stagger: 0.02,
          duration: 1,
          ease: 'back.out(1.7)',
          delay: 0.3,
        })
      }

      // Subtitle fade in
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        delay: 1,
      })

      // CTA buttons
      gsap.from(ctaRef.current?.children || [], {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.2,
      })

      // Floating badges animation
      gsap.to('.float-badge', {
        y: -10,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 overflow-hidden"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-red-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Floating Badge */}
        <div className="float-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white/90">
            AI-Powered Safety Monitoring
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
            NEW
          </span>
        </div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] tracking-tight"
          style={{
            background: 'linear-gradient(to bottom, #ffffff, #a0a0a0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Next-Gen Railroad
          <br />
          Crossing Safety
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Revolutionizing railway safety with cutting-edge AI, edge computing,
          and real-time monitoring. Preventing accidents before they happen.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary CTA */}
          <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50">
            <span className="relative z-10 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Secondary CTA */}
          <button className="group relative px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:bg-white/10">
            <span className="relative z-10 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="float-badge mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { value: '99.7%', label: 'Accuracy' },
            { value: '<2s', label: 'Response Time' },
            { value: '24/7', label: 'Monitoring' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/60 rounded-full animate-scroll" />
        </div>
      </div>
    </section>
  )
}

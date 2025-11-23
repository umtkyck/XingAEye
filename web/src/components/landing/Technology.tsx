'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const technologies = [
  { name: 'Jetson Orin Nano', category: 'Edge AI', color: '#76b900' },
  { name: 'AWS IoT Core', category: 'Cloud Platform', color: '#ff9900' },
  { name: 'TensorFlow', category: 'ML Framework', color: '#ff6f00' },
  { name: 'PyTorch', category: 'Deep Learning', color: '#ee4c2c' },
  { name: 'Three.js', category: '3D Graphics', color: '#000000' },
  { name: 'Next.js 14', category: 'Web Framework', color: '#000000' },
  { name: 'TypeScript', category: 'Language', color: '#3178c6' },
  { name: 'DynamoDB', category: 'Database', color: '#4053d6' },
]

export function Technology() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const techGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      })

      // Tech badges animation
      gsap.from(techGridRef.current?.children || [], {
        scrollTrigger: {
          trigger: techGridRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        scale: 0.8,
        stagger: 0.05,
        duration: 0.6,
        ease: 'back.out(1.5)',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 md:px-12"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-6xl font-black mb-6"
            style={{
              background: 'linear-gradient(to right, #ffffff, #ff6b6b, #4ecdc4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Powered by Leading Technology
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Built with the most advanced tools and frameworks in the industry
          </p>
        </div>

        {/* Technology Stack Visualization */}
        <div className="relative">
          {/* Center Node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center backdrop-blur-xl border-4 border-white/20 shadow-2xl z-10">
            <span className="text-2xl font-black text-white">XingAEye</span>
          </div>

          {/* Technology Badges */}
          <div ref={techGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-48">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-110 hover:border-white/30 hover:bg-white/10"
              >
                {/* Glow Effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
                  style={{ backgroundColor: tech.color }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-xs uppercase tracking-wider text-white/40 mb-2">
                    {tech.category}
                  </div>
                  <div className="text-lg font-bold text-white">
                    {tech.name}
                  </div>
                </div>

                {/* Corner Accent */}
                <div
                  className="absolute top-0 right-0 w-8 h-8 rounded-bl-2xl opacity-30"
                  style={{ backgroundColor: tech.color }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Diagram */}
        <div className="mt-32 p-12 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
          <h3 className="text-3xl font-black text-white mb-8 text-center">System Architecture</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Edge Layer */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Edge Layer</h4>
              <p className="text-white/60 text-sm">Jetson Orin Nano processes video in real-time at the crossing site</p>
            </div>

            {/* Cloud Layer */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <span className="text-3xl">☁️</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Cloud Layer</h4>
              <p className="text-white/60 text-sm">AWS manages data, analytics, and coordinates multiple devices</p>
            </div>

            {/* Application Layer */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <span className="text-3xl">📱</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Application Layer</h4>
              <p className="text-white/60 text-sm">Web and mobile apps provide monitoring and control interfaces</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

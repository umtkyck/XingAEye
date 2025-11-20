'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.register(ScrollTrigger)

const stats = [
  { value: 250, suffix: '+', label: 'Railroad Crossings Protected', duration: 2 },
  { value: 99.7, suffix: '%', label: 'Detection Accuracy', duration: 2.5 },
  { value: 1.8, suffix: 's', label: 'Average Response Time', duration: 2 },
  { value: 50000, suffix: '+', label: 'Incidents Prevented', duration: 3 },
]

function Counter({ value, suffix, duration }: { value: number; suffix: string; duration: number }) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const counter = { value: 0 }

    gsap.to(counter, {
      value,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: countRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(counter, {
            value,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              setCount(counter.value)
            },
          })
        },
      },
    })
  }, [value, duration])

  return (
    <span ref={countRef}>
      {count.toLocaleString('en-US', {
        maximumFractionDigits: value < 10 ? 1 : 0,
      })}
      {suffix}
    </span>
  )
}

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 md:px-12"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-purple-950/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Card */}
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-white/40">
                {/* Gradient Orb */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                {/* Number */}
                <div className="relative z-10 text-5xl md:text-6xl font-black mb-4 bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent">
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={stat.duration}
                  />
                </div>

                {/* Label */}
                <div className="relative z-10 text-white/70 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-2xl text-white/80 font-medium mb-8">
            Join the revolution in railroad crossing safety
          </p>
          <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 hover:shadow-2xl hover:shadow-blue-500/50">
            Request a Demo
          </button>
        </div>
      </div>
    </section>
  )
}

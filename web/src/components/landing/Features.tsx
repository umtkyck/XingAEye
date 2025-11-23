'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Eye, Zap, Shield, Brain, Video, Bell } from 'lucide-react'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const features = [
  {
    icon: Eye,
    title: 'AI Vision Detection',
    description: 'Advanced computer vision algorithms detect obstacles, vehicles, and pedestrians with 99.7% accuracy.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Real-Time Processing',
    description: 'Edge computing on Jetson Orin Nano provides sub-2-second response times for immediate alerts.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Proactive Safety',
    description: 'Predictive algorithms anticipate dangerous situations before they occur, preventing accidents.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Brain,
    title: 'Deep Learning',
    description: 'Continuously learning AI models adapt to environmental changes and improve over time.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Video,
    title: 'Cloud Recording',
    description: 'Automatic video capture and cloud storage of all incidents for analysis and compliance.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Bell,
    title: 'Multi-Channel Alerts',
    description: 'Instant notifications via SMS, email, push notifications, and dashboard alerts.',
    color: 'from-pink-500 to-rose-500',
  },
]

export function Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
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

      // Cards stagger animation
      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 100,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.2)',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 md:px-12"
    >
      {/* Section Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2
            ref={titleRef}
            className="text-4xl md:text-6xl font-black mb-6"
            style={{
              background: 'linear-gradient(to bottom, #ffffff, #9999ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Cutting-Edge Features
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Powered by the latest advancements in AI, edge computing, and IoT technology
          </p>
        </div>

        {/* Features Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-white/20">
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  {/* Icon Container */}
                  <div className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative Elements */}
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

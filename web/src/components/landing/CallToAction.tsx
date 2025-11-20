'use client'

import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'

export function CallToAction() {
  return (
    <section className="relative py-32 px-6 md:px-12">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main CTA Card */}
        <div className="relative p-12 md:p-20 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-2xl border border-white/20 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse" />

          {/* Content */}
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Ready to Transform Railway Safety?
            </h2>
            <p className="text-xl text-white/70 mb-12">
              Join leading transportation authorities worldwide in preventing accidents
              with cutting-edge AI technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button className="group relative px-10 py-5 bg-white text-gray-900 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/50">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>

              <button className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-bold text-lg transition-all hover:scale-105 hover:bg-white/20">
                Schedule a Call
              </button>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { icon: Mail, label: 'Email', value: 'contact@xingaeye.com' },
                { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-white/60 mb-1">{item.label}</div>
                      <div className="text-white font-medium">{item.value}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-2xl font-black text-white">X</span>
              </div>
              <span className="text-2xl font-black text-white">XingAEye</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-8 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Technology</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-white/40">
              © 2024 XingAEye. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}

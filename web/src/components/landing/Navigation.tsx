'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Technology', href: '#technology' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/landing" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-xl font-black text-white">X</span>
            </div>
            <span className="text-xl font-black text-white">XingAEye</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                {link.name}
              </a>
            ))}

            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-medium text-sm transition-all hover:scale-105 hover:bg-white/20"
            >
              Dashboard
            </Link>

            <Link
              href="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-medium text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/10">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/70 hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}

              <Link
                href="/dashboard"
                className="mt-4 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-medium text-center"
              >
                Dashboard
              </Link>

              <Link
                href="/login"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-medium text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#product', label: 'Product' },
  { href: '#pricing', label: 'Pricing' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-surface/80 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center">
            <Wallet size={16} className="text-white" />
          </div>
          <span className={`font-semibold tracking-tight transition-colors ${scrolled ? 'text-ink' : 'text-white'}`}>
            Xpense
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-muted hover:text-ink' : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-muted hover:text-ink' : 'text-white/80 hover:text-white'
            }`}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-brand hover:bg-brand-hover transition-colors text-white text-sm font-medium rounded-lg px-4 py-2"
          >
            Get started
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-ink' : 'text-white'}`}
        >
          <Menu size={22} />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-(--sidebar-bg)/60 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute right-0 top-0 h-full w-72 bg-surface p-6 flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink">Menu</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 text-muted">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-2 py-2.5 rounded-lg text-sm font-medium text-ink hover:bg-surface-hover"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <Link href="/login" className="text-center text-sm font-medium text-ink border border-border rounded-lg py-2.5">
                  Log in
                </Link>
                <Link href="/register" className="text-center bg-brand text-white text-sm font-medium rounded-lg py-2.5">
                  Get started
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
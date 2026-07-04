'use client'

import { useRef } from 'react'
import { motion, Variants } from 'framer-motion'
import { LayoutDashboard, PieChart, ShieldCheck, Zap, TrendingUp, Tags } from 'lucide-react'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const breakdownRows = [
  { label: 'Food', pct: 80, color: '#e0824a' },
  { label: 'Transport', pct: 45, color: '#5b8cf5' },
]

// Cursor-following spotlight — plain DOM style updates, no React state,
// so this stays smooth even at high mousemove frequency.
function SpotlightCard({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    ref.current!.style.setProperty('--x', `${e.clientX - rect.left}px`)
    ref.current!.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      variants={item}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-7 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(360px circle at var(--x, 50%) var(--y, 50%), rgba(91,95,239,0.14), transparent 45%)',
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

export default function FeatureGrid() {
  return (
    <section id="features" className="relative overflow-hidden bg-[#17181f] px-6 py-28">
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-150 h-150 rounded-full bg-brand/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mb-14"
        >
          <p className="text-sm font-medium text-brand mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-(--sidebar-text) text-lg">
            One dashboard for every rupee — where it came from and where it went.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-6 gap-5"
        >
          {/* Large card — dashboard insights */}
          <SpotlightCard className="md:col-span-4">
            <div className="w-11 h-11 rounded-xl bg-brand/15 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
              <LayoutDashboard size={20} className="text-brand" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-1.5">One dashboard, full picture</h3>
            <p className="text-(--sidebar-text) text-sm mb-6">
              Income, expenses, and net balance — updated the moment you log a transaction.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/4 border border-white/10 p-3">
                <p className="text-[11px] text-(--sidebar-text) mb-1">Income</p>
                <p className="font-tabular text-sm font-semibold text-positive">₹68,400</p>
              </div>
              <div className="rounded-xl bg-white/4 border border-white/10 p-3">
                <p className="text-[11px] text-(--sidebar-text) mb-1">Expense</p>
                <p className="font-tabular text-sm font-semibold text-negative">₹32,150</p>
              </div>
              <div className="rounded-xl bg-white/4 border border-white/10 p-3">
                <p className="text-[11px] text-(--sidebar-text) mb-1">Net</p>
                <p className="font-tabular text-sm font-semibold text-white">₹36,250</p>
              </div>
            </div>
          </SpotlightCard>

          {/* Tall card — security, brand-tinted to stand out */}
          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="md:col-span-2 md:row-span-2 rounded-2xl bg-linear-to-b from-brand/20 to-brand/5 border border-brand/20 p-7 flex flex-col"
          >
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-1.5">Bank-grade security</h3>
            <p className="text-(--sidebar-text) text-sm mb-6">
              Passwords are hashed, sessions use httpOnly cookies, and every sign-up is verified by email OTP.
            </p>
            <div className="mt-auto space-y-2.5">
              {['Password hashing', 'httpOnly sessions', 'Email verification'].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-positive" />
                  <span className="text-xs text-(--sidebar-text)">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category breakdown */}
          <SpotlightCard className="md:col-span-3">
            <div className="w-11 h-11 rounded-xl bg-brand/15 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
              <Tags size={20} className="text-brand" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-1.5">Categorized automatically</h3>
            <p className="text-(--sidebar-text) text-sm mb-6">
              Every transaction gets sorted, so you see exactly where money concentrates.
            </p>
            <div className="space-y-3">
              {breakdownRows.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                  <span className="text-xs text-(--sidebar-text) w-16 shrink-0">{row.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${row.pct}%`, backgroundColor: row.color }} />
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>

          {/* Analytics/charts */}
          <SpotlightCard className="md:col-span-3">
            <div className="w-11 h-11 rounded-xl bg-brand/15 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
              <PieChart size={20} className="text-brand" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-1.5">Charts that explain themselves</h3>
            <p className="text-(--sidebar-text) text-sm">
              Daily bars and category pies, filterable by month — no exporting to Excel required.
            </p>
          </SpotlightCard>

          {/* Fast entry */}
          <SpotlightCard className="md:col-span-3">
            <div className="w-11 h-11 rounded-xl bg-brand/15 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
              <Zap size={20} className="text-brand" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-1.5">Log a transaction in seconds</h3>
            <p className="text-(--sidebar-text) text-sm">
              Title, amount, category, done. No forms with twelve fields to fill in.
            </p>
          </SpotlightCard>

          {/* Income vs expense trend */}
          <SpotlightCard className="md:col-span-3">
            <div className="w-11 h-11 rounded-xl bg-brand/15 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
              <TrendingUp size={20} className="text-brand" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-1.5">Income vs. expense, always visible</h3>
            <p className="text-(--sidebar-text) text-sm">
              Every number is color-coded — green for what came in, red for what went out.
            </p>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  )
}
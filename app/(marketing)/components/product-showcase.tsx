'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring, Variants } from 'framer-motion'
import { ArrowUpCircle, ArrowDownCircle, Scale, Wallet } from 'lucide-react'

const breakdown = [
  { label: 'Food', amount: '₹8,240', pct: 82, color: '#e0824a' },
  { label: 'Transport', amount: '₹4,120', pct: 41, color: '#5b8cf5' },
  { label: 'Salary', amount: '₹42,000', pct: 100, color: '#2fbf8f' },
  { label: 'Entertainment', amount: '₹2,860', pct: 29, color: '#e04a9e' },
]

const bars = [45, 62, 30, 78, 55, 90, 40, 68, 35, 58, 82, 48, 60, 38]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 150, damping: 20 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section id="product" className="relative overflow-hidden bg-[#101119] px-6 py-28">
      {/* Ambient glow, subtler than the hero's blobs — just enough to lift the dark canvas */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-175 rounded-full bg-brand/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl mx-auto mb-14"
        >
          <p className="text-sm font-medium text-brand mb-3">Product</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Your money, laid out clearly
          </h2>
          <p className="text-(--sidebar-text) text-lg">
            One screen answers the only question that matters: where did it go.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 60 }}
          whileInView="reveal"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            reveal: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.7, ease: 'easeOut' },
            },
          }}
          style={{ perspective: 1200 }}
        >
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY }}
            className="rounded-2xl border border-white/10 shadow-[0_0_80px_-20px_rgba(91,95,239,0.35)] overflow-hidden bg-[#0d0e14]"
          >
            {/* Browser chrome bar */}
            <div className="flex items-center gap-2 px-4 h-10 bg-[#0d0e14] border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-negative/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#e0a13a]/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-positive/70" />
              <div className="ml-3 h-5 flex-1 max-w-xs rounded-md bg-white/5 flex items-center px-3">
                <span className="text-[10px] text-(--sidebar-text)">xpense.app/dashboard</span>
              </div>
            </div>

            {/* Simplified dashboard recreation — dark themed, staggered reveal */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="p-6 sm:p-8"
            >
              <motion.div variants={item} className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-md bg-brand flex items-center justify-center">
                  <Wallet size={13} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-white">Dashboard</span>
              </motion.div>

              <motion.div variants={item} className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-xl bg-white/4 border border-white/10 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <ArrowUpCircle size={14} className="text-positive" />
                    <span className="text-xs text-(--sidebar-text)">Income</span>
                  </div>
                  <p className="font-tabular text-lg font-semibold text-positive">₹68,400</p>
                </div>
                <div className="rounded-xl bg-white/4 border border-white/10 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <ArrowDownCircle size={14} className="text-negative" />
                    <span className="text-xs text-(--sidebar-text)">Expense</span>
                  </div>
                  <p className="font-tabular text-lg font-semibold text-negative">₹32,150</p>
                </div>
                <div className="rounded-xl bg-white/4 border border-white/10 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Scale size={14} className="text-brand" />
                    <span className="text-xs text-(--sidebar-text)">Net balance</span>
                  </div>
                  <p className="font-tabular text-lg font-semibold text-white">₹36,250</p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={item} className="rounded-xl bg-white/4 border border-white/10 p-5">
                  <p className="text-xs text-(--sidebar-text) mb-4">Daily activity</p>
                  <div className="flex items-end gap-1 h-28">
                    {bars.map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-brand/70" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={item} className="rounded-xl bg-white/4 border border-white/10 p-5">
                  <p className="text-xs text-(--sidebar-text) mb-4">By category</p>
                  <div className="space-y-3">
                    {breakdown.map((row) => (
                      <div key={row.label} className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                        <span className="text-xs text-(--sidebar-text) w-20 shrink-0 truncate">{row.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${row.pct}%`, backgroundColor: row.color }} />
                        </div>
                        <span className="font-tabular text-xs text-(--sidebar-text) shrink-0">{row.amount}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
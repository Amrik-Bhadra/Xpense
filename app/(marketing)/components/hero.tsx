"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUpCircle,
  ArrowDownCircle,
  Scale,
} from "lucide-react";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const breakdownRows = [
  { label: "Food", pct: 72, color: "#c2540d" },
  { label: "Transport", pct: 45, color: "#2f5fd6" },
  { label: "Salary", pct: 100, color: "#12876f" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-(--sidebar-bg) min-h-screen flex items-center pt-24 pb-16 px-6">
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand/30 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-positive/20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-brand/20 blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Faint grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-6xl mx-auto w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          <motion.p
            variants={item}
            className="text-sm font-medium text-brand mb-4"
          >
            Personal finance, simplified
          </motion.p>

          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl font-semibold tracking-tight text-white leading-tight mb-5"
          >
            Know where your money goes.
            <br />
            Down to the rupee.
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg text-(--sidebar-text) mb-8 max-w-lg"
          >
            Xpense tracks every rupee in and out, sorts it by category
            automatically, and shows you the full picture — no spreadsheets, no
            guesswork.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover transition-colors text-white font-medium rounded-xl px-6 py-3"
            >
              Get started free
              <ArrowRight size={16} />
            </Link>

            <Link
              href="#product"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 transition-colors text-white font-medium rounded-xl px-6 py-3"
            >
              See how it works
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-16 lg:-mt-36 lg:ml-auto lg:w-140 relative"
        >
          <div className="animate-float">
            <div className="rounded-2xl bg-surface border border-border shadow-2xl p-6">
              <p className="text-xs text-muted mb-4">This month</p>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-3 gap-3 mb-5"
              >
                <motion.div
                  variants={item}
                  className="rounded-xl bg-positive-soft p-3"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ArrowUpCircle size={13} className="text-positive" />
                    <span className="text-[11px] text-muted">Income</span>
                  </div>
                  <p className="font-tabular text-sm font-semibold text-positive">
                    ₹68,400
                  </p>
                </motion.div>
                <motion.div
                  variants={item}
                  className="rounded-xl bg-negative-soft p-3"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ArrowDownCircle size={13} className="text-negative" />
                    <span className="text-[11px] text-muted">Expense</span>
                  </div>
                  <p className="font-tabular text-sm font-semibold text-negative">
                    ₹32,150
                  </p>
                </motion.div>
                <motion.div
                  variants={item}
                  className="rounded-xl bg-brand-soft p-3"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Scale size={13} className="text-brand" />
                    <span className="text-[11px] text-muted">Net</span>
                  </div>
                  <p className="font-tabular text-sm font-semibold text-brand">
                    ₹36,250
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="flex items-end gap-1.5 h-16 mb-5 px-1"
              >
                {[40, 65, 30, 80, 55, 90, 45, 70, 35, 60, 85, 50].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col justify-end gap-0.5"
                    >
                      <div
                        className="rounded-sm bg-negative/70"
                        style={{ height: `${h * 0.4}%` }}
                      />
                      <div
                        className="rounded-sm bg-positive/70"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ),
                )}
              </motion.div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                transition={{ delayChildren: 1.1 }}
                className="space-y-3"
              >
                {breakdownRows.map((row) => (
                  <motion.div
                    key={row.label}
                    variants={item}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="text-xs text-ink w-16 shrink-0">
                      {row.label}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-surface-hover overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${row.pct}%`,
                          backgroundColor: row.color,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

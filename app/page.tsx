import Link from 'next/link'
import { ArrowUpRight, Wallet } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { categoryColor } from '@/lib/category-colors'

export default async function DashboardPage() {
  const totals = await prisma.expense.groupBy({
    by: ['categoryId'],
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
  })

  const categories = await prisma.category.findMany()
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  const grandTotal = totals.reduce((sum, t) => sum + (t._sum.amount ?? 0), 0)
  const maxAmount = Math.max(...totals.map((t) => t._sum.amount ?? 0), 1)

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header className="mb-8">
        <p className="text-sm text-muted">Overview</p>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      </header>

      <div className="rounded-2xl bg-surface border border-border p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted mb-1">Total spent</p>
            <p className="font-tabular text-4xl font-semibold tracking-tight">
              ₹{grandTotal.toFixed(2)}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-brand-soft flex items-center justify-center">
            <Wallet size={20} className="text-brand" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted">By category</h2>
        <Link
          href="/expenses"
          className="text-sm text-brand font-medium flex items-center gap-1 hover:underline"
        >
          View all <ArrowUpRight size={14} />
        </Link>
      </div>

      {totals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-muted text-sm">No spending yet. Add your first expense to see it here.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-surface border border-border divide-y divide-border">
          {totals.map((t) => {
            const amount = t._sum.amount ?? 0
            const color = categoryColor(categoryMap[t.categoryId] ?? '')
            const pct = (amount / maxAmount) * 100

            return (
              <div key={t.categoryId} className="p-4 flex items-center gap-4">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.text }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{categoryMap[t.categoryId]}</span>
                    <span className="font-tabular text-sm font-semibold">₹{amount.toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-hover overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: color.text }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
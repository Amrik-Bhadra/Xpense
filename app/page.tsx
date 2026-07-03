import Link from 'next/link'
import { ArrowUpRight, ArrowUpCircle, ArrowDownCircle, Scale } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { categoryColor } from '@/lib/category-colors'

export default async function DashboardPage() {
  const [incomeAgg, expenseAgg, totals, categories] = await Promise.all([
    prisma.transaction.aggregate({
      where: { type: 'INCOME' },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { type: 'EXPENSE' },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ['categoryId', 'type'],
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    }),
    prisma.category.findMany(),
  ])

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  const totalIncome = incomeAgg._sum.amount ?? 0
  const totalExpense = expenseAgg._sum.amount ?? 0
  const netBalance = totalIncome - totalExpense

  const incomeTotals = totals.filter((t) => t.type === 'INCOME')
  const expenseTotals = totals.filter((t) => t.type === 'EXPENSE')

  const maxIncome = Math.max(...incomeTotals.map((t) => t._sum.amount ?? 0), 1)
  const maxExpense = Math.max(...expenseTotals.map((t) => t._sum.amount ?? 0), 1)

  return (
    <div className="px-10 py-8">
      <header className="mb-8">
        <p className="text-sm text-muted">Overview</p>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-surface border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted">Income</p>
            <ArrowUpCircle size={16} className="text-positive" />
          </div>
          <p className="font-tabular text-2xl font-semibold tracking-tight text-positive">
            ₹{totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl bg-surface border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted">Expense</p>
            <ArrowDownCircle size={16} className="text-negative" />
          </div>
          <p className="font-tabular text-2xl font-semibold tracking-tight text-negative">
            ₹{totalExpense.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl bg-surface border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted">Net balance</p>
            <Scale size={16} className="text-brand" />
          </div>
          <p className={`font-tabular text-2xl font-semibold tracking-tight ${netBalance >= 0 ? 'text-positive' : 'text-negative'}`}>
            {netBalance >= 0 ? '₹' : '-₹'}{Math.abs(netBalance).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted">Breakdown by category</h2>
        <Link
          href="/transactions"
          className="text-sm text-brand font-medium flex items-center gap-1 hover:underline"
        >
          View all <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {incomeTotals.length > 0 && (
          <div>
            <p className="text-xs font-medium text-positive mb-2 px-1">INCOME</p>
            <div className="rounded-2xl bg-surface border border-border divide-y divide-border">
              {incomeTotals.map((t) => {
                const amount = t._sum.amount ?? 0
                const color = categoryColor(categoryMap[t.categoryId] ?? '')
                const pct = (amount / maxIncome) * 100

                return (
                  <div key={t.categoryId} className="p-4 flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.text }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">{categoryMap[t.categoryId]}</span>
                        <span className="font-tabular text-sm font-semibold text-positive">+₹{amount.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-hover overflow-hidden">
                        <div className="h-full rounded-full bg-positive" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {expenseTotals.length > 0 && (
          <div>
            <p className="text-xs font-medium text-negative mb-2 px-1">EXPENSE</p>
            <div className="rounded-2xl bg-surface border border-border divide-y divide-border">
              {expenseTotals.map((t) => {
                const amount = t._sum.amount ?? 0
                const color = categoryColor(categoryMap[t.categoryId] ?? '')
                const pct = (amount / maxExpense) * 100

                return (
                  <div key={t.categoryId} className="p-4 flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.text }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">{categoryMap[t.categoryId]}</span>
                        <span className="font-tabular text-sm font-semibold text-negative">-₹{amount.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-hover overflow-hidden">
                        <div className="h-full rounded-full bg-negative" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {totals.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-muted text-sm">No transactions yet. Add your first one to see it here.</p>
        </div>
      )}
    </div>
  )
}
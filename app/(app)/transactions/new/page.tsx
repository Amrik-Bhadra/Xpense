import { prisma } from '@/lib/prisma'
import ExpenseForm from './transaction-form'

export default async function NewExpensePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="p-8 max-w-md mx-auto">
      <p className="text-sm text-muted">New record</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Add expense</h1>
      <div className="rounded-2xl bg-surface border border-border p-6">
        <ExpenseForm categories={categories} />
      </div>
    </div>
  )
}
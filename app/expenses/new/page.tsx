import { prisma } from '@/lib/prisma'
import ExpenseForm from './expense-form'

export default async function NewExpensePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add Expense</h1>
      <ExpenseForm categories={categories} />
    </main>
  )
}
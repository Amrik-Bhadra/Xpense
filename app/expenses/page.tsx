import Link from 'next/link'
import { Plus, Pencil, Trash2, Receipt } from 'lucide-react'
import { prisma } from "@/lib/prisma";
import { deleteExpense } from './[id]/edit/actions'
import { categoryColor } from '@/lib/category-colors'

export default async function ExpensePage() {
    const expenses = await prisma.expense.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-sm text-muted">All records</p>
                    <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
                </div>
                <Link
                    href="/expenses/new"
                    className="inline-flex items-center gap-1.5 bg-brand hover:bg-(--brand-hover) transition-colors text-white rounded-lg px-4 py-2.5 text-sm font-medium"
                >
                    <Plus size={16} />
                    Add expense
                </Link>
            </div>

            { expenses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-14 text-center">
                    <div className="w-11 h-11 rounded-xl bg-(--brand-soft) flex items-center justify-center mx-auto mb-4">
                        <Receipt size={20} className="text-brand" />
                    </div>
                    <p className="font-medium mb-1">No expenses yet</p>
                    <p className="text-sm text-muted mb-5">Start tracking by adding your first expense.</p>
                    <Link
                        href="/expenses/new"
                        className="inline-flex items-center gap-1.5 bg-brand hover:bg-(--brand-hover) transition-colors text-white rounded-lg px-4 py-2.5 text-sm font-medium"
                    >
                        <Plus size={16} />
                        Add expense
                    </Link>
                </div>
            ) : (
                <div className="rounded-2xl bg-surface border border-border divide-y divide-border">
                    {expenses.map((expense) => {
                        const color = categoryColor(expense.category.name)
                        return (
                            <div key={expense.id} className="flex items-center justify-between p-4 group">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span
                                        className="text-xs font-medium px-2 py-1 rounded-md shrink-0"
                                        style={{ backgroundColor: color.bg, color: color.text }}
                                    >
                                        {expense.category.name}
                                    </span>
                                    <p className="font-medium truncate">{expense.title}</p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <p className="font-tabular font-semibold">₹{expense.amount.toFixed(2)}</p>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/expenses/${expense.id}/edit`}
                                            className="p-2 rounded-lg hover:bg-(--surface-hover) text-muted"
                                        >
                                            <Pencil size={15} />
                                        </Link>
                                        <form action={deleteExpense}>
                                            <input type="hidden" name="id" value={expense.id} />
                                            <button type="submit" className="p-2 rounded-lg hover:bg-(--negative-soft) text-muted hover:text-(--negative)">
                                                <Trash2 size={15} />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) }
        </div>
    );
}
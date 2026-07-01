import Link from 'next/link'
import { Plus, Pencil, Trash2, Receipt, Search, Info, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { prisma } from "@/lib/prisma";
import { deleteExpense } from './[id]/edit/actions'
import { categoryColor } from '@/lib/category-colors'

const PAGE_SIZE = 10

export default async function ExpensePage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const { page: pageParam } = await searchParams
    const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

    const [expenses, totalCount, categories] = await Promise.all([
        prisma.expense.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
        prisma.expense.count(),
        prisma.category.findMany({ orderBy: { name: 'asc' } }),
    ])

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
    const startSrNo = (page - 1) * PAGE_SIZE + 1

    const truncate = (text: string, max: number) =>
        text.length <= max ? text : text.slice(0, max) + '...'

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
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

            {/* Toolbar — search, category filter, date filter (wired up later) */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="relative flex-1 min-w-[220px]">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        className="w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-surface"
                    />
                </div>

                <select
                    defaultValue=""
                    className="border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-surface"
                >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <div className="relative">
                    <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    <input
                        type="date"
                        className="border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-surface"
                    />
                </div>
            </div>

            {expenses.length === 0 ? (
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
                <>
                    <div className="rounded-2xl bg-surface border border-border overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left text-xs text-muted">
                                    <th className="px-4 py-3 font-medium w-12">#</th>
                                    <th className="px-4 py-3 font-medium">Title</th>
                                    <th className="px-4 py-3 font-medium">Notes</th>
                                    <th className="px-4 py-3 font-medium">Category</th>
                                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {expenses.map((expense, i) => {
                                    const color = categoryColor(expense.category.name)
                                    const hasNotes = !!expense.notes
                                    const shortNotes = hasNotes ? truncate(expense.notes!, 30) : '—'
                                    const isTruncated = hasNotes && expense.notes!.length > 30

                                    return (
                                        <tr key={expense.id} className="hover:bg-(--surface-hover) transition-colors">
                                            <td className="px-4 py-3 text-muted">{startSrNo + i}</td>
                                            <td className="px-4 py-3 font-medium">{expense.title}</td>
                                            <td className="px-4 py-3 text-muted">
                                                <div className="flex items-center gap-1.5">
                                                    <span>{shortNotes}</span>
                                                    {isTruncated && (
                                                        <span title={expense.notes!} className="cursor-help">
                                                            <Info size={13} />
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className="text-xs font-medium px-2 py-1 rounded-md"
                                                    style={{ backgroundColor: color.bg, color: color.text }}
                                                >
                                                    {expense.category.name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-tabular font-semibold">
                                                ₹{expense.amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-muted">
                                                {expense.createdAt.toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/expenses/${expense.id}/edit`}
                                                        className="p-1.5 rounded-lg hover:bg-(--surface-hover) text-muted"
                                                    >
                                                        <Pencil size={14} />
                                                    </Link>
                                                    <form action={deleteExpense}>
                                                        <input type="hidden" name="id" value={expense.id} />
                                                        <button type="submit" className="p-1.5 rounded-lg hover:bg-(--negative-soft) text-muted hover:text-(--negative)">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted">
                            Showing {startSrNo}–{Math.min(startSrNo + PAGE_SIZE - 1, totalCount)} of {totalCount}
                        </p>
                        <div className="flex items-center gap-1">
                            <Link
                                href={`/expenses?page=${Math.max(1, page - 1)}`}
                                className={`p-2 rounded-lg border border-border ${
                                    page <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-(--surface-hover)'
                                }`}
                            >
                                <ChevronLeft size={15} />
                            </Link>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <Link
                                    key={p}
                                    href={`/expenses?page=${p}`}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                                        p === page
                                            ? 'bg-brand text-white'
                                            : 'border border-border hover:bg-(--surface-hover)'
                                    }`}
                                >
                                    {p}
                                </Link>
                            ))}

                            <Link
                                href={`/expenses?page=${Math.min(totalPages, page + 1)}`}
                                className={`p-2 rounded-lg border border-border ${
                                    page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-(--surface-hover)'
                                }`}
                            >
                                <ChevronRight size={15} />
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
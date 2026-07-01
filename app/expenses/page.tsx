import Link from 'next/link'
import { prisma } from "@/lib/prisma";
import { deleteExpense } from './[id]/edit/actions'

export default async function ExpensePage() {
    const expenses = await prisma.expense.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className="max-w-2xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Expenses</h1>
                <Link
                    href="/expenses/new"
                    className="bg-black text-white rounded-lg px-4 py-2 text-sm font-medium"
                >
                    + Add Expense
                </Link>
            </div>

            { expenses.length === 0 ? (
                <p className="text-gray-500">No expenses yet.</p>
            ) : (
                <ul className="space-y-3">
                    {expenses.map((expense) => (
                        <li
                        key={expense.id}
                        className="flex justify-between items-center border rounded-lg p-4"
                        >
                            <div>
                                <p className="font-medium">{expense.title}</p>
                                <p className="text-sm text-gray-500">{expense.category.name}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="font-semibold">₹{expense.amount.toFixed(2)}</p>
                                <Link
                                    href={`/expenses/${expense.id}/edit`}
                                    className="text-sm text-blue-600"
                                >
                                    Edit
                                </Link>
                                <form action={deleteExpense}>
                                    <input type="hidden" name="id" value={expense.id} />
                                    <button type="submit" className="text-sm text-red-600">
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </li>
                    ))}
                </ul>
            ) }
        </main>
    );
}
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateExpense } from "./actions";

export default async function EditExpenses({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [expense, categories] = await Promise.all([
    prisma.expense.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!expense) notFound();

  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-xl font-bold mb-6">Edit Expense</h1>

      <form action={updateExpense} className="space-y-4">
        <input type="hidden" name="id" value={expense.id} />

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={expense.title}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            defaultValue={expense.amount}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="categoryId"
            defaultValue={expense.categoryId}
            required
            className="w-full border rounded-lg p-2"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            defaultValue={expense.notes ?? ""}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white rounded-lg px-4 py-2 font-medium"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}

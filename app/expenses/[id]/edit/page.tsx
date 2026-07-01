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
    <div className="p-8 max-w-md mx-auto">
      <p className="text-sm text-muted">Edit record</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Edit expense</h1>

      <div className="rounded-2xl bg-surface border border-border p-6">
        <form action={updateExpense} className="space-y-5">
          <input type="hidden" name="id" value={expense.id} />

          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={expense.title}
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--brand)/20 focus:border-brand transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">₹</span>
              <input
                type="number"
                name="amount"
                step="0.01"
                defaultValue={expense.amount}
                required
                className="font-tabular w-full border border-border rounded-lg pl-7 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--brand)/20 focus:border-brand transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select
              name="categoryId"
              defaultValue={expense.categoryId}
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--brand)/20 focus:border-brand transition-colors bg-surface"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Notes <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea
              name="notes"
              defaultValue={expense.notes ?? ""}
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--brand)/20 focus:border-brand transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand hover:bg-(--brand-hover) transition-colors text-white rounded-lg py-2.5 text-sm font-medium"
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}
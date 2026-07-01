import { prisma } from "@/lib/prisma";
import { createExpense } from "./actions";

export default async function NewExpensePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add Expense</h1>

      <form action={createExpense} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="amount">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            step="0.01"
            required
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="category">
            Category
          </label>
          <select
            name="categoryId"
            id="category"
            required
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes (optional)
          </label>
          <textarea name="notes" className="w-full border rounded-lg p-2" />
        </div>

        <button
          type="submit"
          className="bg-black text-white rounded-lg px-4 py-2 font-medium"
        >
          Add Expense
        </button>
      </form>
    </main>
  );
}

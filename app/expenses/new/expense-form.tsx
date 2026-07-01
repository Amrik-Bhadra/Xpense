"use client";

import { useActionState } from "react";
import { createExpense, ActionState } from "./actions";

type Category = { id: string; name: string };

export default function ExpenseForm({
  categories,
}: {
  categories: Category[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createExpense,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          className="w-full border rounded-lg p-2"
        />
        {state?.errors?.title && (
          <p className="text-sm text-red-600 mt-1">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          name="amount"
          step="0.01"
          className="w-full border rounded-lg p-2"
        />
        {state?.errors?.amount && (
          <p className="text-sm text-red-600 mt-1">{state.errors.amount[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select name="categoryId" className="w-full border rounded-lg p-2">
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {state?.errors?.categoryId && (
          <p className="text-sm text-red-600 mt-1">
            {state.errors.categoryId[0]}
          </p>
        )}
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
  );
}

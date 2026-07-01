"use client";

import { useActionState } from "react";
import { createExpense, ActionState } from "./actions";

type Category = { id: string; name: string };

export default function ExpenseForm({ categories }: { categories: Category[] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(createExpense, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5">Title</label>
        <input
          type="text"
          name="title"
          placeholder="e.g. Groceries"
          className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--brand)/20 focus:border-brand transition-colors"
        />
        {state?.errors?.title && (
          <p className="text-xs text-(--negative) mt-1.5">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">₹</span>
          <input
            type="number"
            name="amount"
            step="0.01"
            placeholder="0.00"
            className="font-tabular w-full border border-border rounded-lg pl-7 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--brand)/20 focus:border-brand transition-colors"
          />
        </div>
        {state?.errors?.amount && (
          <p className="text-xs text-(--negative) mt-1.5">{state.errors.amount[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Category</label>
        <select
          name="categoryId"
          className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--brand)/20 focus:border-brand transition-colors bg-surface"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {state?.errors?.categoryId && (
          <p className="text-xs text-(--negative) mt-1.5">{state.errors.categoryId[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          Notes <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--brand)/20 focus:border-brand transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-brand hover:bg-(--brand-hover) transition-colors text-white rounded-lg py-2.5 text-sm font-medium"
      >
        Add expense
      </button>
    </form>
  );
}
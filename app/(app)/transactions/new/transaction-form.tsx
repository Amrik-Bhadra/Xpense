"use client";

import { useState } from "react";
import { useActionState } from "react";
import { createTransaction, ActionState } from "./actions";

type Category = { id: string; name: string };

export default function TransactionForm({ categories }: { categories: Category[] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(createTransaction, undefined);
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  return (
    <form action={formAction} className="space-y-5">
      {/* Type toggle */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Type</label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-surface-hover">
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={`py-2 rounded-md text-sm font-medium transition-colors ${
              type === "EXPENSE" ? "bg-negative text-white" : "text-muted hover:text-ink"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={`py-2 rounded-md text-sm font-medium transition-colors ${
              type === "INCOME" ? "bg-positive text-white" : "text-muted hover:text-ink"
            }`}
          >
            Income
          </button>
        </div>
        <input type="hidden" name="type" value={type} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Title</label>
        <input
          type="text"
          name="title"
          placeholder={type === "EXPENSE" ? "e.g. Groceries" : "e.g. Freelance payment"}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--brand)/20 focus:border-brand transition-colors"
        />
        {state?.errors?.title && (
          <p className="text-xs text-negative mt-1.5">{state.errors.title[0]}</p>
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
          <p className="text-xs text-negative mt-1.5">{state.errors.amount[0]}</p>
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
          <p className="text-xs text-negative mt-1.5">{state.errors.categoryId[0]}</p>
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
        className={`w-full transition-colors text-white rounded-lg py-2.5 text-sm font-medium ${
          type === "EXPENSE" ? "bg-negative hover:opacity-90" : "bg-positive hover:opacity-90"
        }`}
      >
        Add {type === "EXPENSE" ? "expense" : "income"}
      </button>
    </form>
  );
}
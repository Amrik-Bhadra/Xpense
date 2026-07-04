"use client";

import { useState } from "react";
import { updateTransaction } from "./actions";

type Category = { id: string; name: string };
type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  notes: string | null;
};

export default function EditTransactionForm({
  transaction,
  categories,
}: {
  transaction: Transaction;
  categories: Category[];
}) {
  const [type, setType] = useState<"INCOME" | "EXPENSE">(transaction.type);

  return (
    <form action={updateTransaction} className="space-y-5">
      <input type="hidden" name="id" value={transaction.id} />
      <input type="hidden" name="type" value={type} />

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
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Title</label>
        <input
          type="text"
          name="title"
          defaultValue={transaction.title}
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
            defaultValue={transaction.amount}
            required
            className="font-tabular w-full border border-border rounded-lg pl-7 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-(--brand)/20 focus:border-brand transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Category</label>
        <select
          name="categoryId"
          defaultValue={transaction.categoryId}
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
          defaultValue={transaction.notes ?? ""}
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
        Save changes
      </button>
    </form>
  );
}
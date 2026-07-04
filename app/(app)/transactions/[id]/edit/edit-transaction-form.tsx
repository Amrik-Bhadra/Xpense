"use client";

import { useRef, useState } from "react";
import { Pencil, Tag, FileText } from "lucide-react";
import { updateTransaction } from "./actions";
import ConfirmModal from "@/app/components/confirm-modal";

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
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<{
    title: string;
    amount: string;
    categoryName: string;
  } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const skipConfirmRef = useRef(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (skipConfirmRef.current) {
      skipConfirmRef.current = false;
      return;
    }

    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const categoryId = formData.get("categoryId") as string;
    const category = categories.find((c) => c.id === categoryId);

    setPendingData({
      title: (formData.get("title") as string) || "Untitled",
      amount: (formData.get("amount") as string) || "0",
      categoryName: category?.name ?? "Uncategorized",
    });
    setShowConfirm(true);
  }

  function handleConfirm() {
    setShowConfirm(false);
    skipConfirmRef.current = true;
    formRef.current?.requestSubmit();
  }

  return (
    <>
      <form ref={formRef} action={updateTransaction} onSubmit={handleSubmit} className="space-y-5">
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

      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        variant="brand"
        icon={Pencil}
        title="Save these changes?"
        description={
          pendingData && (
            <span className="block space-y-1.5 mt-1">
              <span className="flex items-center gap-2">
                <FileText size={13} className="text-muted shrink-0" />
                <span className="text-ink font-medium">{pendingData.title}</span>
              </span>
              <span className="flex items-center gap-2">
                <Tag size={13} className="text-muted shrink-0" />
                <span>{pendingData.categoryName}</span>
              </span>
              <span className="flex items-center gap-2 font-tabular">
                <span className="text-muted">₹</span>
                <span
                  className={`font-semibold ${type === "EXPENSE" ? "text-negative" : "text-positive"}`}
                >
                  {parseFloat(pendingData.amount || "0").toFixed(2)}
                </span>
              </span>
            </span>
          )
        }
        confirmLabel="Save changes"
      />
    </>
  );
}
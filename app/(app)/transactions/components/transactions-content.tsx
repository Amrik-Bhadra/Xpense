"use client";

import Link from "next/link";
import {
  Plus,
  Pencil,
  Receipt,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import DeleteTransactionModal from "./delete-transaction-modal";
import TransactionToolbar from "./transaction-toolbar";
import { categoryColor } from "@/lib/helpers/category-colors";
import {
  paymentMethodIcons,
  defaultPaymentMethodIcon,
  getPaymentMethodStyle,
} from "@/lib/payment-method-icons";

type Category = { id: string; name: string };
type PaymentMethod = { id: string; name: string };
type TransactionRow = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  notes: string | null;
  transactionDate: Date;
  category: { name: string };
  paymentMethod: { name: string };
};

type TransactionsContentProps = {
  transactions: TransactionRow[];
  totalCount: number;
  page: number;
  totalPages: number;
  startSrNo: number;
  categories: Category[];
  paymentMethods: PaymentMethod[];
  initialSearch: string;
  initialType: string;
  initialCategoryId: string;
  initialPaymentMethodId: string;
  initialDate: string;
};

export default function TransactionsContent({
  transactions: initialTransactions,
  totalCount,
  page,
  totalPages,
  startSrNo,
  categories,
  paymentMethods,
  initialSearch,
  initialType,
  initialCategoryId,
  initialPaymentMethodId,
  initialDate,
}: TransactionsContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);

  useEffect(() => {
    setTransactions(initialTransactions);
    setIsLoading(false);
  }, [initialTransactions]);

  const truncate = (text: string, max: number) =>
    text.length <= max ? text : text.slice(0, max) + "...";

  return (
    <>
      <TransactionToolbar
        initialSearch={initialSearch}
        initialType={initialType}
        initialCategoryId={initialCategoryId}
        initialPaymentMethodId={initialPaymentMethodId}
        initialDate={initialDate}
        categories={categories}
        paymentMethods={paymentMethods}
        onLoadingChange={setIsLoading}
      />

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-surface p-14 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/20 bg-white/70 shadow-sm">
              <Wallet size={18} className="text-brand" />
            </div>
          </div>
          <div className="mx-auto mb-3 flex items-center justify-center gap-2 text-brand">
            <LoaderCircle size={16} className="animate-spin" />
            <span className="text-sm font-medium">Loading transactions</span>
          </div>
          <p className="text-sm text-muted">
            Updating your results and keeping the page responsive.
          </p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-14 text-center">
          <div className="w-11 h-11 rounded-xl bg-brand-soft flex items-center justify-center mx-auto mb-4">
            <Receipt size={20} className="text-brand" />
          </div>
          <p className="font-medium mb-1">No transactions yet</p>
          <p className="text-sm text-muted mb-5">
            Start tracking by adding your first transaction.
          </p>
          <Link
            href="/transactions/new"
            className="inline-flex items-center gap-1.5 bg-brand hover:bg-brand-hover transition-colors text-white rounded-lg px-4 py-2.5 text-sm font-medium"
          >
            <Plus size={16} />
            Add transaction
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-2xl bg-surface border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="px-4 py-3 font-medium w-12">#</th>
                  <th className="px-4 py-3 font-medium w-10"></th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((txn, i) => {
                  const color = categoryColor(txn.category.name);
                  const paymentMethodStyle = getPaymentMethodStyle(txn.paymentMethod?.name ?? "");
                  const MethodIcon = paymentMethodIcons[txn.paymentMethod?.name ?? ""] ?? defaultPaymentMethodIcon;
                  const hasNotes = !!txn.notes;
                  const shortNotes = hasNotes ? truncate(txn.notes!, 30) : "—";
                  const isTruncated = hasNotes && txn.notes!.length > 30;
                  const isIncome = txn.type === "INCOME";

                  return (
                    <tr
                      key={txn.id}
                      className="hover:bg-surface-hover transition-colors"
                    >
                      <td className="px-4 py-3 text-muted">{startSrNo + i}</td>
                      <td className="px-4 py-3">
                        <span title={isIncome ? "Income" : "Expense"}>
                          {isIncome ? (
                            <ArrowUpCircle size={16} className="text-positive" />
                          ) : (
                            <ArrowDownCircle size={16} className="text-negative" />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{txn.title}</td>
                      <td className="px-4 py-3 text-muted">
                        <div className="flex items-center gap-1.5">
                          <span>{shortNotes}</span>
                          {isTruncated && (
                            <span title={txn.notes!} className="cursor-help">
                              <Info size={13} />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-medium px-2 py-1 rounded-md"
                          style={{
                            backgroundColor: color.bg,
                            color: color.text,
                          }}
                        >
                          {txn.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1"
                          style={{
                            backgroundColor: paymentMethodStyle.bg,
                            color: paymentMethodStyle.text,
                            borderColor: paymentMethodStyle.text + "22",
                          }}
                        >
                          <MethodIcon size={14} style={{ color: paymentMethodStyle.text }} />
                          <span className="text-xs font-medium">{txn.paymentMethod.name}</span>
                        </div>
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-tabular font-semibold ${isIncome ? "text-positive" : "text-negative"}`}
                      >
                        {isIncome ? "+" : "-"}₹{txn.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {new Date(txn.transactionDate).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/transactions/${txn.id}/edit`}
                            className="p-1.5 rounded-lg hover:bg-surface-hover text-muted"
                          >
                            <Pencil size={14} />
                          </Link>
                          <DeleteTransactionModal
                            transactionId={txn.id}
                            transactionTitle={txn.title}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted">
              Showing {startSrNo}–{Math.min(startSrNo + 10 - 1, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-1">
              <Link
                href={`/transactions?page=${Math.max(1, page - 1)}`}
                className={`p-2 rounded-lg border border-border ${
                  page <= 1
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-surface-hover"
                }`}
              >
                <ChevronLeft size={15} />
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/transactions?page=${p}`}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                    p === page
                      ? "bg-brand text-white"
                      : "border border-border hover:bg-surface-hover"
                  }`}
                >
                  {p}
                </Link>
              ))}

              <Link
                href={`/transactions?page=${Math.min(totalPages, page + 1)}`}
                className={`p-2 rounded-lg border border-border ${
                  page >= totalPages
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-surface-hover"
                }`}
              >
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}

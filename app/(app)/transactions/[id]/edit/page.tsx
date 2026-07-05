import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect, notFound } from "next/navigation";
import EditTransactionForm from "./edit-transaction-form";

export default async function EditExpenses({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const [transaction, categories, paymentMethods] = await Promise.all([
    prisma.transaction.findFirst({ where: { id, userId: user.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.paymentMethod.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!transaction) notFound();

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <p className="text-sm text-muted">Edit record</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Edit transaction</h1>

      <div className="rounded-2xl bg-surface border border-border p-6">
        <EditTransactionForm transaction={transaction} categories={categories} paymentMethods={paymentMethods} />
      </div>
    </div>
  );
}
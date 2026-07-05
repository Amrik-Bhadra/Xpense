import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import TransactionsContent from "./components/transactions-content";

type TransactionListItem = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  notes: string | null;
  transactionDate: Date;
  category: { name: string };
  paymentMethod: { name: string };
};

const PAGE_SIZE = 10;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    type?: string;
    categoryId?: string;
    paymentMethodId?: string;
    date?: string;
  }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const {
    page: pageParam,
    q,
    type,
    categoryId,
    paymentMethodId,
    date,
  } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const searchTerm = q?.trim() ?? "";
  const transactionType = type?.toUpperCase() === "INCOME" || type?.toUpperCase() === "EXPENSE" ? type.toUpperCase() : undefined;
  const selectedCategoryId = categoryId?.trim() || undefined;
  const selectedPaymentMethodId = paymentMethodId?.trim() || undefined;
  const selectedDate = date?.trim() || undefined;

  const where = {
    userId: user.id,
    ...(transactionType ? { type: transactionType as "INCOME" | "EXPENSE" } : {}),
    ...(selectedCategoryId ? { categoryId: selectedCategoryId } : {}),
    ...(selectedPaymentMethodId ? { paymentMethodId: selectedPaymentMethodId } : {}),
    ...(selectedDate
      ? {
          transactionDate: {
            gte: new Date(`${selectedDate}T00:00:00`),
            lt: new Date(`${selectedDate}T23:59:59.999`),
          },
        }
      : {}),
    ...(searchTerm
      ? {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" as const } },
            { notes: { contains: searchTerm, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [transactions, totalCount, categories, paymentMethods] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true, paymentMethod: true },
      orderBy: { transactionDate: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.transaction.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.paymentMethod.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const startSrNo = (page - 1) * PAGE_SIZE + 1;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted">All records</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Transactions
          </h1>
        </div>
        <Link
          href="/transactions/new"
          className="inline-flex items-center gap-1.5 bg-brand hover:bg-brand-hover transition-colors text-white rounded-lg px-4 py-2.5 text-sm font-medium"
        >
          <Plus size={16} />
          Add transaction
        </Link>
      </div>

      <TransactionsContent
        transactions={transactions as TransactionListItem[]}
        totalCount={totalCount}
        page={page}
        totalPages={totalPages}
        startSrNo={startSrNo}
        categories={categories}
        paymentMethods={paymentMethods}
        initialSearch={searchTerm}
        initialType={transactionType ?? ""}
        initialCategoryId={selectedCategoryId ?? ""}
        initialPaymentMethodId={selectedPaymentMethodId ?? ""}
        initialDate={selectedDate ?? ""}
      />
    </div>
  );
}

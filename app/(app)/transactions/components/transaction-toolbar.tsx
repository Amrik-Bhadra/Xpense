"use client";

import { Calendar, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Category = { id: string; name: string };
type PaymentMethod = { id: string; name: string };

type TransactionToolbarProps = {
  initialSearch: string;
  initialType: string;
  initialCategoryId: string;
  initialPaymentMethodId: string;
  initialDate: string;
  categories: Category[];
  paymentMethods: PaymentMethod[];
  onLoadingChange?: (loading: boolean) => void;
};

export default function TransactionToolbar({
  initialSearch,
  initialType,
  initialCategoryId,
  initialPaymentMethodId,
  initialDate,
  categories,
  paymentMethods,
  onLoadingChange,
}: TransactionToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState(initialType);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [paymentMethodId, setPaymentMethodId] = useState(initialPaymentMethodId);
  const [date, setDate] = useState(initialDate);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const mountedRef = useRef(false);

  useEffect(() => {
    onLoadingChange?.(isPending);
  }, [isPending, onLoadingChange]);

  const updateUrl = useCallback(
    (nextValues: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams?.toString() ?? window.location.search);

      Object.entries(nextValues).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      if (nextValues.q !== undefined || Object.keys(nextValues).some((key) => key !== "q")) {
        params.set("page", "1");
      }

      const query = params.toString();
      const nextUrl = `${pathname}${query ? `?${query}` : ""}`;
      const currentUrl = `${pathname}${window.location.search}`;

      if (nextUrl === currentUrl) {
        return;
      }

      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      updateUrl({ q: search.trim() || undefined });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search, updateUrl]);


  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      <div className="relative w-full sm:flex-1 sm:min-w-55">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search transactions..."
          disabled={isPending}
          className="w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-surface disabled:opacity-70"
        />
      </div>

      <select
        value={type}
        onChange={(event) => {
          const nextType = event.target.value;
          setType(nextType);
          updateUrl({ type: nextType || undefined });
        }}
        disabled={isPending}
        className="w-full sm:w-auto border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-surface disabled:opacity-70"
      >
        <option value="">All types</option>
        <option value="INCOME">Income</option>
        <option value="EXPENSE">Expense</option>
      </select>

      <select
        value={categoryId}
        onChange={(event) => {
          const nextCategoryId = event.target.value;
          setCategoryId(nextCategoryId);
          updateUrl({ categoryId: nextCategoryId || undefined });
        }}
        disabled={isPending}
        className="w-full sm:w-auto border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-surface disabled:opacity-70"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={paymentMethodId}
        onChange={(event) => {
          const nextPaymentMethodId = event.target.value;
          setPaymentMethodId(nextPaymentMethodId);
          updateUrl({ paymentMethodId: nextPaymentMethodId || undefined });
        }}
        disabled={isPending}
        className="w-full sm:w-auto border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-surface disabled:opacity-70"
      >
        <option value="">All payment methods</option>
        {paymentMethods.map((method) => (
          <option key={method.id} value={method.id}>
            {method.name}
          </option>
        ))}
      </select>

      <div className="relative">
        <Calendar
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
        <input
          type="date"
          value={date}
          onChange={(event) => {
            const nextDate = event.target.value;
            setDate(nextDate);
            updateUrl({ date: nextDate || undefined });
          }}
          disabled={isPending}
          className="w-full sm:w-auto border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-surface disabled:opacity-70"
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { categoryColor } from "@/lib/category-colors";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Slice = { name: string; value: number };

export default function CategoryPieChart() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [income, setIncome] = useState<Slice[]>([]);
  const [expense, setExpense] = useState<Slice[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const requestKey = `${month}-${year}`;
  const loading = loadedKey !== requestKey;

  useEffect(() => {
    let ignore = false;

    fetch(`/api/analytics/category?month=${month}&year=${year}`)
      .then((res) => res.json())
      .then((json) => {
        if (!ignore) {
          setIncome(json.income);
          setExpense(json.expense);
          setLoadedKey(requestKey);
        }
      });

    return () => {
      ignore = true;
    };
  }, [month, year, requestKey]);

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="rounded-2xl bg-surface border border-border p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-sm font-medium text-muted">Category breakdown</h3>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-border rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-surface"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-border rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-surface"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 min-h-72 flex items-center justify-center text-sm text-muted">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 min-h-72">
          <div className="flex flex-col">
            <p className="text-xs font-medium text-positive mb-1 text-center shrink-0">Income</p>
            {income.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-muted">No income data</div>
            ) : (
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={income} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                      {income.map((entry) => (
                        <Cell key={entry.name} fill={categoryColor(entry.name).text} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-medium text-negative mb-1 text-center shrink-0">Expense</p>
            {expense.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-muted">No expense data</div>
            ) : (
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expense} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                      {expense.map((entry) => (
                        <Cell key={entry.name} fill={categoryColor(entry.name).text} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
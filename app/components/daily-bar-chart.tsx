"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MONTHS } from "@/lib/data";

type DailyPoint = { day: number; income: number; expense: number };

export default function DailyBarChart() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<DailyPoint[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const requestKey = `${month}-${year}`;
  const loading = loadedKey !== requestKey;

  useEffect(() => {
    let ignore = false;

    fetch(`/api/analytics/daily?month=${month}&year=${year}`)
      .then((res) => res.json())
      .then((json) => {
        if (!ignore) {
          setData(json);
          setLoadedKey(requestKey);
        }
      });

    return () => {
      ignore = true;
    };
  }, [month, year, requestKey]);

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="rounded-2xl bg-surface border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted">
          Daily income vs expense
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-border rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-surface"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-border rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-surface"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-72 flex items-center justify-center text-sm text-muted">
          Loading...
        </div>
      ) : (
        <div className="flex-1 min-h-72">
          <ResponsiveContainer width="100%" height={288}>
            <BarChart data={data} barGap={2}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                stroke="var(--muted)"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted)" />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "var(--border)",
                  fontSize: 12,
                }}
                formatter={(value) => `₹${Number(value).toFixed(2)}`}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="income"
                name="Income"
                fill="var(--positive)"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="var(--negative)"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

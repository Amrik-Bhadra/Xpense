export default function Loading() {
  return (
    <div className="px-10 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-surface-hover animate-pulse" />
          <div className="h-7 w-40 rounded bg-surface-hover animate-pulse" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-surface-hover animate-pulse" />
      </div>

      {/* Toolbar skeleton */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="h-9 flex-1 min-w-55 rounded-lg bg-surface-hover animate-pulse" />
        <div className="h-9 w-32 rounded-lg bg-surface-hover animate-pulse" />
        <div className="h-9 w-40 rounded-lg bg-surface-hover animate-pulse" />
        <div className="h-9 w-40 rounded-lg bg-surface-hover animate-pulse" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium w-12">#</th>
              <th className="px-4 py-3 font-medium w-10"></th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Notes</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...Array(10)].map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <div className="h-4 w-4 rounded bg-surface-hover animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-4 rounded-full bg-surface-hover animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-28 rounded bg-surface-hover animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 rounded bg-surface-hover animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-6 w-20 rounded-md bg-surface-hover animate-pulse" />
                </td>
                <td className="px-4 py-3 flex justify-end">
                  <div className="h-4 w-16 rounded bg-surface-hover animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-20 rounded bg-surface-hover animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="h-6 w-6 rounded-lg bg-surface-hover animate-pulse" />
                    <div className="h-6 w-6 rounded-lg bg-surface-hover animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between mt-4">
        <div className="h-4 w-40 rounded bg-surface-hover animate-pulse" />
        <div className="flex items-center gap-1">
          <div className="h-8 w-8 rounded-lg bg-surface-hover animate-pulse" />
          <div className="h-8 w-8 rounded-lg bg-surface-hover animate-pulse" />
          <div className="h-8 w-8 rounded-lg bg-surface-hover animate-pulse" />
          <div className="h-8 w-8 rounded-lg bg-surface-hover animate-pulse" />
        </div>
      </div>
    </div>
  );
}
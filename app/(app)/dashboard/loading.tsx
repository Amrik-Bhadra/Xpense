export default function Loading() {
  return (
    <div className="px-10 py-8">
      {/* Header skeleton — darker shade */}
      <header className="mb-8 space-y-2">
        <div className="h-3 w-16 rounded bg-border animate-pulse" />
        <div className="h-7 w-40 rounded bg-border animate-pulse" />
      </header>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-surface border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-16 rounded bg-surface-hover animate-pulse" />
              <div className="h-4 w-4 rounded-full bg-surface-hover animate-pulse" />
            </div>
            <div className="h-7 w-28 rounded bg-surface-hover animate-pulse" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 items-stretch">
        <div className="xl:col-span-2 rounded-2xl bg-surface border border-border p-5">
          <div className="h-4 w-32 rounded bg-surface-hover animate-pulse mb-6" />
          <div className="h-56 w-full rounded-lg bg-surface-hover animate-pulse" />
        </div>
        <div className="xl:col-span-1 rounded-2xl bg-surface border border-border p-5 flex flex-col items-center">
          <div className="h-4 w-28 rounded bg-surface-hover animate-pulse mb-6 self-start" />
          <div className="h-44 w-44 rounded-full bg-surface-hover animate-pulse" />
        </div>
      </div>

      {/* Breakdown header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-36 rounded bg-border animate-pulse" />
        <div className="h-4 w-16 rounded bg-border animate-pulse" />
      </div>

      {/* Breakdown cards skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, col) => (
          <div key={col}>
            <div className="h-3 w-14 rounded bg-border animate-pulse mb-2 mx-1" />
            <div className="rounded-2xl bg-surface border border-border divide-y divide-border">
              {[...Array(4)].map((_, row) => (
                <div key={row} className="p-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full shrink-0 bg-surface-hover animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="h-3.5 w-24 rounded bg-surface-hover animate-pulse" />
                      <div className="h-3.5 w-16 rounded bg-surface-hover animate-pulse" />
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface-hover animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
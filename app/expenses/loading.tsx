export default function Loading() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-surface-hover animate-pulse" />
          <div className="h-7 w-32 rounded bg-surface-hover animate-pulse" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-surface-hover animate-pulse" />
      </div>

      <div className="rounded-2xl bg-surface border border-border divide-y divide-border)]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-16 rounded-md bg-surface-hover animate-pulse" />
              <div className="h-4 w-32 rounded bg-surface-hover animate-pulse" />
            </div>
            <div className="h-4 w-14 rounded bg-surface-hover animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
'use client'

import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <div className="w-11 h-11 rounded-xl bg-negative-soft flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={20} className="text-negative" />
        </div>
        <h2 className="font-semibold mb-1">Something went wrong</h2>
        <p className="text-sm text-muted mb-5">{error.message}</p>
        <button
          onClick={reset}
          className="bg-brand hover:bg-(--brand-hover) transition-colors text-white rounded-lg px-4 py-2.5 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
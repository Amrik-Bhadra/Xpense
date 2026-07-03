"use client";

import { useRef } from "react";

export default function OtpInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  function updateDigit(i: number, char: string) {
    const next = value.split("");
    next[i] = char;
    onChange(next.join("").slice(0, 6));
  }

  function handleChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    updateDigit(i, char ?? "");
    if (char && i < 5) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i]?.trim() && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  }

  return (
    <div>
      <div className="flex gap-2.5 justify-between" onPaste={handlePaste}>
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={digits[i]?.trim() ?? ""}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            className={`w-11 h-12 text-center text-lg font-semibold rounded-xl border bg-surface outline-none transition-all focus:ring-4 ${
              error
                ? "border-negative focus:ring-negative-soft"
                : "border-border focus:border-brand focus:ring-brand-soft"
            }`}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-negative text-center">{error}</p>}
    </div>
  );
}
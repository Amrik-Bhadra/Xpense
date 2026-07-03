"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

type Props = {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function PasswordField({ label, error, id, ...props }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={`w-full h-11 pl-10 pr-10 rounded-xl border bg-surface text-sm text-ink placeholder:text-muted outline-none transition-all focus:ring-4 ${
            error
              ? "border-negative focus:ring-negative-soft"
              : "border-border focus:border-brand focus:ring-brand-soft"
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors cursor-pointer"
          tabIndex={-1}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-negative">{error}</p>}
    </div>
  );
}
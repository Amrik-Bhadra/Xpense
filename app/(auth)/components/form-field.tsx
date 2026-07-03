import { type LucideIcon } from "lucide-react";

type Props = {
  label: string;
  icon: LucideIcon;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FormField({ label, icon: Icon, error, id, ...props }: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          id={id}
          className={`w-full h-11 pl-10 pr-3.5 rounded-xl border bg-surface text-sm text-ink placeholder:text-muted outline-none transition-all focus:ring-4 ${
            error
              ? "border-negative focus:ring-negative-soft"
              : "border-border focus:border-brand focus:ring-brand-soft"
          }`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-negative">{error}</p>}
    </div>
  );
}
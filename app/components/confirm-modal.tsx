"use client";

import { AlertTriangle, X, Loader2, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Variant = "danger" | "brand";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  icon?: LucideIcon;
};

const variantStyles: Record<
  Variant,
  {
    iconBg: string;
    iconColor: string;
    confirmBg: string;
    confirmHoverBg: string;
  }
> = {
  danger: {
    iconBg: "bg-negative-soft",
    iconColor: "text-negative",
    confirmBg: "bg-negative",
    confirmHoverBg: "hover:bg-negative/90",
  },
  brand: {
    iconBg: "bg-brand-soft",
    iconColor: "text-brand",
    confirmBg: "bg-brand",
    confirmHoverBg: "hover:bg-brand-hover",
  },
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  isPending = false,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  icon: Icon = AlertTriangle,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  const styles = variantStyles[variant];

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in-up"
      onClick={() => !isPending && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-surface border border-border shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center`}
          >
            <Icon size={18} className={styles.iconColor} />
          </div>
          <button
            type="button"
            onClick={() => !isPending && onClose()}
            disabled={isPending}
            className="text-muted hover:text-ink transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <h3 className="text-base font-semibold tracking-tight mb-1.5">
          {title}
        </h3>
        <p className="text-sm text-muted mb-6">{description}</p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-surface-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 h-10 rounded-xl ${styles.confirmBg} ${styles.confirmHoverBg} text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer`}
          >
            {isPending && <Loader2 size={15} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

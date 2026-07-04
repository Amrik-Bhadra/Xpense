"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import ConfirmModal from "@/app/components/confirm-modal";
import { deleteTransaction } from "../[id]/edit/actions";

type Props = {
  transactionId: string;
  transactionTitle: string;
};

export default function DeleteTransactionModal({
  transactionId,
  transactionTitle,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    const formData = new FormData();
    formData.set("id", transactionId);

    startTransition(async () => {
      await deleteTransaction(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-lg hover:bg-negative-soft text-muted hover:text-negative transition-colors cursor-pointer"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        isPending={isPending}
        variant="danger"
        title="Delete transaction?"
        description={
          <>
            This will permanently delete{" "}
            <span className="text-ink font-medium">&ldquo;{transactionTitle}&rdquo;</span>.
            This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
      />
    </>
  );
}
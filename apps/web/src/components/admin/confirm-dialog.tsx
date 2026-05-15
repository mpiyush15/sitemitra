"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-6 text-sm text-muted-foreground">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="destructive" onClick={() => { onConfirm?.(); onClose(); }}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

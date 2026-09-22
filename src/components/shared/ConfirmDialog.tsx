"use client";

import { Button, Modal, ModalActions } from "@/components/ui";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  /** Tampilkan spinner di tombol konfirmasi selama aksinya berjalan */
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Dialog konfirmasi sebelum aksi yang tidak bisa dibatalkan, mis. hapus data.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      size="sm"
      title={title}
      hideCloseButton
      footer={
        <ModalActions>
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </ModalActions>
      }
    >
      {description ? (
        <p className="text-sm text-slate-500">{description}</p>
      ) : (
        <p className="text-sm text-slate-500">Tindakan ini tidak bisa dibatalkan.</p>
      )}
    </Modal>
  );
}

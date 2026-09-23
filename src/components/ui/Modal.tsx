"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "cn";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

const sizeClass: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-5xl",
  full: "max-w-[95vw]",
};

interface ModalProps {
  /** Modal tidak dirender sama sekali saat false, jadi isinya selalu mulai segar */
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  size?: ModalSize;
  /** Footer biasanya diisi tombol aksi; pakai `ModalActions` supaya rata kanan */
  footer?: ReactNode;
  /** Sembunyikan tombol X di pojok kanan atas */
  hideCloseButton?: boolean;
  /** Matikan penutupan lewat klik area gelap / tombol Escape */
  dismissable?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Dialog melayang: dirender lewat portal ke `document.body`, menutup lewat
 * Escape atau klik area gelap, dan mengunci scroll halaman di belakangnya.
 *
 * @example
 * <Modal
 *   open={open}
 *   onClose={close}
 *   title="Tambah Regional"
 *   footer={<ModalActions><Button onClick={save}>Simpan</Button></ModalActions>}
 * >
 *   <Field label="Nama"><Input value={nama} onChange={onChange} /></Field>
 * </Modal>
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  footer,
  hideCloseButton = false,
  dismissable = true,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && dismissable) onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    // cegah halaman di belakang ikut tergulir
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, dismissable, onClose]);

  // portal hanya bisa dibuat di browser
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 sm:p-4"
      onMouseDown={(event) => {
        // klik di area gelap menutup modal
        if (dismissable && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          // tata letak
          "flex w-full flex-col",
          // ukuran — dvh, bukan vh, supaya bilah alamat browser ponsel ikut dihitung
          "max-h-[90dvh]",
          // tampilan
          "rounded-2xl bg-white shadow-xl",
          // lebar maksimum per ukuran, lihat sizeClass
          sizeClass[size],
          className,
        )}
      >
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
            <div>
              {title && (
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              )}
              {description && (
                <p className="mt-0.5 text-sm text-slate-400">{description}</p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">{children}</div>

        {footer && (
          <div className="border-t border-slate-100 px-4 py-4 sm:px-6">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** Baris tombol di footer modal: rata kanan, atau terpisah kalau ada `secondary`. */
export function ModalActions({
  children,
  secondary,
}: {
  children: ReactNode;
  /** Aksi sekunder yang ditaruh di kiri, mis. tombol hapus semua filter */
  secondary?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>{secondary}</div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

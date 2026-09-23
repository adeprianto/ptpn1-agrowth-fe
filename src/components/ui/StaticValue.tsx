import type { ReactNode } from "react";
import { cn } from "cn";

interface StaticValueProps {
  /** Kosongkan untuk menampilkan `placeholder` saja */
  children?: ReactNode;
  /** Teks pengganti saat nilainya belum ada */
  placeholder?: string;
  className?: string;
}

/**
 * Kotak bergaya kontrol form untuk nilai yang hanya ditampilkan — mis. field
 * yang terisi otomatis dari pilihan lain. Bukan `<input disabled>` supaya
 * isinya tidak ikut terkirim saat form disubmit.
 *
 * @example
 * <Field label="Job Function" required>
 *   <StaticValue placeholder="Pilih posisi terlebih dahulu.">{jobFunction}</StaticValue>
 * </Field>
 */
export function StaticValue({
  children,
  placeholder = "-",
  className,
}: StaticValueProps) {
  const isEmpty = children === null || children === undefined || children === "";

  return (
    <div
      className={cn(
        // ukuran
        "w-full",
        // tampilan
        "rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5",
        // teks
        "text-sm",
        // keadaan
        isEmpty ? "text-slate-400" : "text-slate-600",
        className,
      )}
    >
      {isEmpty ? placeholder : children}
    </div>
  );
}

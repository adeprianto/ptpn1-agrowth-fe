import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

export type AlertTone = "info" | "success" | "warning" | "error";

const toneStyle: Record<AlertTone, { box: string; icon: LucideIcon }> = {
  info: { box: "border-blue-200 bg-blue-50 text-blue-700", icon: Info },
  success: {
    box: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  warning: {
    box: "border-amber-200 bg-amber-50 text-amber-700",
    icon: AlertTriangle,
  },
  error: { box: "border-rose-200 bg-rose-50 text-rose-700", icon: XCircle },
};

interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  /** Kalau diisi, muncul tombol Tutup di kanan pesan */
  onDismiss?: () => void;
  className?: string;
}

/**
 * Kotak pesan inline — dipakai untuk menampilkan error fetch, konfirmasi
 * simpan, atau catatan di dalam form.
 *
 * @example
 * {error && <Alert tone="error">Gagal memuat data pegawai: {error}</Alert>}
 * {hapusError && <Alert tone="error" onDismiss={clearHapusError}>{hapusError}</Alert>}
 */
export function Alert({
  tone = "info",
  title,
  children,
  onDismiss,
  className,
}: AlertProps) {
  const { box, icon: Icon } = toneStyle[tone];

  return (
    <div
      role="alert"
      className={cn(
        // tata letak
        "flex gap-2.5",
        // tampilan
        "rounded-xl border px-4 py-3",
        // teks
        "text-sm",
        // warna mengikuti tone
        box,
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(Boolean(title) && "mt-0.5")}>{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 self-start font-medium hover:underline"
        >
          Tutup
        </button>
      )}
    </div>
  );
}

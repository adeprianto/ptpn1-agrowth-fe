import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Tombol ajakan, mis. tombol tambah data */
  action?: ReactNode;
  className?: string;
}

/**
 * Tampilan saat daftar kosong. Dipakai di luar tabel — `DataTable` sudah
 * punya baris kosongnya sendiri lewat prop `emptyMessage`.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-12 text-center",
        className,
      )}
    >
      {Icon && <Icon className="h-8 w-8 text-slate-300" />}
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {description && <p className="text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

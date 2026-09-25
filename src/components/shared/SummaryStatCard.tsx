import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

interface SummaryStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  /** Tampilan gelap untuk menandai kartu yang sedang dipilih, mis. metrik aktif */
  highlighted?: boolean;
}

export function SummaryStatCard({
  label,
  value,
  icon: Icon,
  highlighted = false,
}: SummaryStatCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-4 transition-colors sm:gap-4",
        highlighted
          ? "border-emerald-950 bg-emerald-950 text-white"
          : "border-slate-300 bg-white text-slate-800",
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-md sm:h-12 sm:w-12",
          highlighted ? "bg-emerald-700" : "bg-emerald-900",
        )}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-xs font-medium uppercase tracking-wide",
            highlighted ? "text-emerald-200" : "text-slate-400",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "mt-1 text-xl font-bold sm:text-2xl",
            highlighted ? "text-white" : "text-slate-800",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

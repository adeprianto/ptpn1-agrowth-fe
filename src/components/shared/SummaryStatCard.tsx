import type { LucideIcon } from "lucide-react";

interface SummaryStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

export function SummaryStatCard({
  label,
  value,
  icon: Icon,
}: SummaryStatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white p-4 text-slate-800 sm:gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-900 sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-xl font-bold text-slate-800 sm:text-2xl">{value}</p>
      </div>
    </div>
  );
}

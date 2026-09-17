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
    <div className="border border-slate-300 bg-white text-slate-800 p-4 flex items-center gap-4 rounded-lg">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-emerald-900">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

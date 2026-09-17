import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  /** mis. "2.4%" — tanda "+" & ikon panah ditambah otomatis */
  trend?: string;
  variant?: "default" | "featured";
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  const isFeatured = variant === "featured";

  return (
    <div
      className={`relative overflow-hidden rounded-lg p-4 ${
        isFeatured
          ? "bg-emerald-950 text-white "
          : "border border-slate-200 bg-white text-slate-800 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
      }`}
    >
      {/* Dekorasi bentuk pojok, meniru aksen di desain */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full ${
          isFeatured ? "bg-emerald-800/40" : "bg-blue-200"
        }`}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            isFeatured ? "bg-white/10" : "bg-blue-100"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              isFeatured ? "text-emerald-300" : "text-slate-500"
            }`}
          />
        </div>

        {trend && (
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              isFeatured
                ? "bg-white/10 text-emerald-200"
                : "bg-slate-100 text-emerald-600"
            }`}
          >
            <TrendingUp className="h-3 w-3" />+{trend}
          </span>
        )}
      </div>

      <div className="relative mt-6">
        <p
          className={`text-xs font-medium uppercase tracking-wide ${
            isFeatured ? "text-emerald-300/70" : "text-slate-400"
          }`}
        >
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

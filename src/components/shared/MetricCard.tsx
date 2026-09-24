import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "featured";
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  variant = "default",
}: MetricCardProps) {
  const isFeatured = variant === "featured";

  return (
    <div
      className={cn(
        // tampilan
        "rounded-2xl border p-5",
        // keadaan
        isFeatured
          ? "border-emerald-900 bg-emerald-950"
          : "border-slate-300 bg-white",
      )}
    >
      <div
        className={cn(
          // tata letak
          "flex h-12 w-12 items-center justify-center",
          // tampilan
          "rounded-full",
          // keadaan
          isFeatured ? "bg-emerald-800/60" : "bg-emerald-400",
        )}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>

      <p
        className={cn(
          // teks
          "mt-4 text-xs font-medium uppercase tracking-wide",
          // keadaan
          isFeatured ? "text-emerald-300/70" : "text-slate-400",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          // teks
          "mt-1 text-lg font-bold",
          // keadaan
          isFeatured ? "text-white" : "text-slate-800",
        )}
      >
        {value}
      </p>
    </div>
  );
}

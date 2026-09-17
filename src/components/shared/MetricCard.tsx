import type { LucideIcon } from "lucide-react";

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
      className={`rounded-2xl border p-5 ${
        isFeatured
          ? "border-emerald-900 bg-emerald-950"
          : "border-slate-300 bg-white"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          isFeatured ? "bg-emerald-800/60" : "bg-emerald-400"
        }`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>

      <p
        className={`mt-4 text-xs font-medium uppercase tracking-wide ${
          isFeatured ? "text-emerald-300/70" : "text-slate-400"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-1 text-lg font-bold ${
          isFeatured ? "text-white" : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

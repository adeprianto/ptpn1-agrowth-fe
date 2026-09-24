import type { ReactNode } from "react";
import { cn } from "cn";

export type BadgeTone = "slate" | "emerald" | "amber" | "blue" | "rose" | "violet";

export type BadgeVariant = "soft" | "solid" | "outline";

const toneClass: Record<BadgeVariant, Record<BadgeTone, string>> = {
  soft: {
    slate: "bg-slate-100 text-slate-600",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    rose: "bg-rose-100 text-rose-700",
    violet: "bg-violet-100 text-violet-700",
  },
  solid: {
    slate: "bg-slate-500 text-white",
    emerald: "bg-emerald-600 text-white",
    amber: "bg-amber-500 text-white",
    blue: "bg-blue-600 text-white",
    rose: "bg-rose-500 text-white",
    violet: "bg-violet-600 text-white",
  },
  outline: {
    slate: "border border-slate-300 text-slate-600",
    emerald: "border border-emerald-300 text-emerald-700",
    amber: "border border-amber-300 text-amber-700",
    blue: "border border-blue-300 text-blue-700",
    rose: "border border-rose-300 text-rose-700",
    violet: "border border-violet-300 text-violet-700",
  },
};

interface BadgeProps {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

/**
 * Label kecil berbentuk pil. Komponen ini hanya tahu WARNA dan ISI —
 * pemetaan "status apa memakai tone apa" jadi urusan masing-masing fitur.
 *
 * @example
 * <Badge tone="emerald">{unit.jumlahKaryawan} Karyawan</Badge>
 */
export function Badge({
  tone = "slate",
  variant = "soft",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        // tata letak
        "inline-flex shrink-0 items-center",
        // tampilan
        "rounded-full px-3 py-1",
        // teks
        "whitespace-nowrap text-xs font-medium",
        // warna mengikuti tone + variant
        toneClass[variant][tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

export interface SegmentedOption<TValue extends string> {
  value: TValue;
  label: string;
  icon?: LucideIcon;
}

interface SegmentedControlProps<TValue extends string> {
  options: SegmentedOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  /** Jumlah kolom pada layar lebar; di layar sempit selalu satu kolom */
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnClass = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
} as const;

/**
 * Pilihan tunggal berbentuk deretan tombol — alternatif `Select` untuk pilihan
 * yang sedikit dan penting, mis. Level Penempatan (HO / Regional / Unit).
 *
 * @example
 * <SegmentedControl
 *   value={level}
 *   onChange={setLevel}
 *   options={[
 *     { value: "HO", label: "Head Office", icon: Landmark },
 *     { value: "Regional", label: "Regional", icon: Network },
 *   ]}
 * />
 */
export function SegmentedControl<TValue extends string>({
  options,
  value,
  onChange,
  columns = 3,
  className,
}: SegmentedControlProps<TValue>) {
  return (
    <div className={cn("grid grid-cols-1 gap-3", columnClass[columns], className)}>
      {options.map((option) => {
        const isActive = option.value === value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              // tata letak
              "flex items-center gap-2.5",
              // tampilan
              "rounded-xl border px-4 py-3",
              // teks
              "text-sm font-medium",
              // interaksi
              "transition-colors",
              // keadaan
              isActive
                ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                : "border-slate-300 text-slate-600 hover:bg-slate-50",
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

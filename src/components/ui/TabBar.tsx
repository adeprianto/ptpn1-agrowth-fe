"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

export interface TabItem<TValue extends string> {
  value: TValue;
  label: string;
  icon?: LucideIcon;
}

interface TabBarProps<TValue extends string> {
  tabs: TabItem<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  className?: string;
}

/**
 * Deretan tab kecil untuk berpindah tampilan, mis. di pojok kanan atas kartu.
 * Komponen ini hanya menampilkan tab; isi tiap tab diatur oleh pemakainya.
 *
 * @example
 * const [tab, setTab] = useState<"tabel" | "excel">("tabel");
 *
 * <TabBar
 *   value={tab}
 *   onChange={setTab}
 *   tabs={[
 *     { value: "tabel", label: "Pilih dari Tabel" },
 *     { value: "excel", label: "Unggah Excel" },
 *   ]}
 * />
 */
export function TabBar<TValue extends string>({
  tabs,
  value,
  onChange,
  className,
}: TabBarProps<TValue>) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex gap-1 rounded-xl bg-slate-100 p-1", className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        const Icon = tab.icon;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              // tata letak
              "flex items-center gap-2",
              // tampilan
              "rounded-lg px-3 py-1.5",
              // teks
              "text-sm font-medium",
              // interaksi
              "transition-colors",
              // keadaan
              isActive
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

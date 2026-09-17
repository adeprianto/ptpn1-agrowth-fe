"use client";

import { Search } from "lucide-react";

export type UnitRangeFilter = "all" | "under10" | "10to20" | "over20";

const unitRangeLabels: Record<UnitRangeFilter, string> = {
  all: "Semua Jumlah Unit",
  under10: "< 10 Unit",
  "10to20": "10-20 Unit",
  over20: "> 20 Unit",
};

interface RegionalFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  wilayahOptions: string[];
  wilayahValue: string;
  onWilayahChange: (value: string) => void;
  unitRangeValue: UnitRangeFilter;
  onUnitRangeChange: (value: UnitRangeFilter) => void;
}

export function RegionalFilterBar({
  searchValue,
  onSearchChange,
  wilayahOptions,
  wilayahValue,
  onWilayahChange,
  unitRangeValue,
  onUnitRangeChange,
}: RegionalFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center ">
      <div className="relative flex-1 ">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 " />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama regional atau wilayah..."
          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <select
        value={wilayahValue}
        onChange={(e) => onWilayahChange(e.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="all">Semua Wilayah</option>
        {wilayahOptions.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>

      <select
        value={unitRangeValue}
        onChange={(e) => onUnitRangeChange(e.target.value as UnitRangeFilter)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        {(Object.keys(unitRangeLabels) as UnitRangeFilter[]).map((key) => (
          <option key={key} value={key}>
            {unitRangeLabels[key]}
          </option>
        ))}
      </select>
    </div>
  );
}

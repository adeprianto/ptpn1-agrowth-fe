"use client";

import { Search } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

interface UnitFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  regionalOptions: FilterOption[];
  regionalValue: string;
  onRegionalChange: (value: string) => void;
  jenisOptions: FilterOption[];
  jenisValue: string;
  onJenisChange: (value: string) => void;
  komoditasOptions: FilterOption[];
  komoditasValue: string;
  onKomoditasChange: (value: string) => void;
}

const selectClass =
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export function UnitFilterBar({
  searchValue,
  onSearchChange,
  regionalOptions,
  regionalValue,
  onRegionalChange,
  jenisOptions,
  jenisValue,
  onJenisChange,
  komoditasOptions,
  komoditasValue,
  onKomoditasChange,
}: UnitFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center ">
      <div className="relative flex-1 ">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 " />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama atau kode unit..."
          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <select
        value={regionalValue}
        onChange={(e) => onRegionalChange(e.target.value)}
        className={selectClass}
      >
        <option value="all">Semua Regional</option>
        {regionalOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={jenisValue}
        onChange={(e) => onJenisChange(e.target.value)}
        className={selectClass}
      >
        <option value="all">Semua Jenis</option>
        {jenisOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={komoditasValue}
        onChange={(e) => onKomoditasChange(e.target.value)}
        className={selectClass}
      >
        <option value="all">Semua Komoditas</option>
        {komoditasOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

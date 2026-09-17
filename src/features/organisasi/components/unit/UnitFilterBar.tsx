"use client";

import { Search } from "lucide-react";

interface UnitFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  RegionalOptions: string[];
  RegionalValue: string;
  onRegionalChange: (value: string) => void;
  JenisOptions: string[];
  JenisValue: string;
  onJenisChange: (value: string) => void;
  KomoditasOptions: string[];
  KomoditasValue: string;
  onKomoditasChange: (value: string) => void;
}

export function UnitFilterBar({
  searchValue,
  onSearchChange,
  RegionalOptions,
  RegionalValue,
  onRegionalChange,
  JenisOptions,
  JenisValue,
  onJenisChange,
  KomoditasOptions,
  KomoditasValue,
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
          placeholder="Cari nama unit atau code..."
          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <select
        value={RegionalValue}
        onChange={(e) => onRegionalChange(e.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="all">Semua Regional</option>
        {RegionalOptions.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>

      <select
        value={JenisValue}
        onChange={(e) => onJenisChange(e.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="all">Semua Jenis</option>
        {JenisOptions.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>

      <select
        value={KomoditasValue}
        onChange={(e) => onKomoditasChange(e.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="all">Semua Komoditas</option>
        {KomoditasOptions.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>
    </div>
  );
}

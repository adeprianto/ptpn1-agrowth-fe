"use client";

import { Search } from "lucide-react";

export interface PenempatanOption {
  nama: string;
  tipe: "HO" | "Regional" | "Unit";
}

interface PegawaiFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  penempatanOptions: PenempatanOption[];
  penempatanValue: string;
  onPenempatanChange: (value: string) => void;
  levelOptions: string[];
  levelValue: string;
  onLevelChange: (value: string) => void;
}

const selectClass =
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export function PegawaiFilterBar({
  searchValue,
  onSearchChange,
  penempatanOptions,
  penempatanValue,
  onPenempatanChange,
  levelOptions,
  levelValue,
  onLevelChange,
}: PegawaiFilterBarProps) {
  // Dikelompokkan per tipe (HO/Regional/Unit) biar 1 dropdown ini tetap rapi
  // walau nanti daftar Unit-nya panjang (puluhan).
  const hoOptions = penempatanOptions.filter((p) => p.tipe === "HO");
  const regionalOptions = penempatanOptions.filter(
    (p) => p.tipe === "Regional",
  );
  const unitOptions = penempatanOptions.filter((p) => p.tipe === "Unit");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama atau NIK..."
          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <select
        value={penempatanValue}
        onChange={(e) => onPenempatanChange(e.target.value)}
        className={selectClass}
      >
        <option value="all">Semua Penempatan</option>
        {hoOptions.length > 0 && (
          <optgroup label="Head Office">
            {hoOptions.map((p) => (
              <option key={p.nama} value={p.nama}>
                {p.nama}
              </option>
            ))}
          </optgroup>
        )}
        {regionalOptions.length > 0 && (
          <optgroup label="Regional">
            {regionalOptions.map((p) => (
              <option key={p.nama} value={p.nama}>
                {p.nama}
              </option>
            ))}
          </optgroup>
        )}
        {unitOptions.length > 0 && (
          <optgroup label="Unit">
            {unitOptions.map((p) => (
              <option key={p.nama} value={p.nama}>
                {p.nama}
              </option>
            ))}
          </optgroup>
        )}
      </select>

      <select
        value={levelValue}
        onChange={(e) => onLevelChange(e.target.value)}
        className={selectClass}
      >
        <option value="all">Semua Level</option>
        {levelOptions.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </div>
  );
}

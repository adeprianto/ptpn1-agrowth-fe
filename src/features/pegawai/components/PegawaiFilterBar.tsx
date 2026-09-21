"use client";

import { Search } from "lucide-react";
import type { EntityOption } from "@/features/organisasi/api/entityOptions";

// BOD level tetap 1–6 (enum BodLevel di backend), aman di-hardcode
const LEVEL_BOD_OPTIONS = [1, 2, 3, 4, 5, 6];

interface PegawaiFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  penempatanOptions: EntityOption[];
  penempatanValue: string;
  onPenempatanChange: (value: string) => void;
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
  levelValue,
  onLevelChange,
}: PegawaiFilterBarProps) {
  // Dikelompokkan per tipe (HO/Regional/Unit) biar 1 dropdown ini tetap rapi
  // walau daftar Unit-nya panjang (ratusan).
  const groups: { label: string; options: EntityOption[] }[] = [
    { label: "Head Office", options: penempatanOptions.filter((p) => p.type === "HEAD_OFFICE") },
    { label: "Regional", options: penempatanOptions.filter((p) => p.type === "REGIONAL") },
    { label: "Unit", options: penempatanOptions.filter((p) => p.type === "UNIT") },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama atau kode SAP..."
          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <select
        value={penempatanValue}
        onChange={(e) => onPenempatanChange(e.target.value)}
        className={selectClass}
      >
        <option value="all">Semua Penempatan</option>
        {groups.map(
          (group) =>
            group.options.length > 0 && (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            ),
        )}
      </select>

      <select
        value={levelValue}
        onChange={(e) => onLevelChange(e.target.value)}
        className={selectClass}
      >
        <option value="all">Semua Level</option>
        {LEVEL_BOD_OPTIONS.map((level) => (
          <option key={level} value={level}>
            BOD-{level}
          </option>
        ))}
      </select>
    </div>
  );
}

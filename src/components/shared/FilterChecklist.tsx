"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { FilterOption } from "./ColumnHeader";

// daftar dibatasi supaya kolom dengan ratusan nilai tetap ringan
const MAX_VISIBLE_OPTIONS = 200;

interface FilterChecklistProps {
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  autoFocus?: boolean;
  /** Kelas tinggi maksimum daftar, mis. "max-h-60" */
  listClassName?: string;
}

/**
 * Daftar centang bergaya filter Excel: kotak cari, "Pilih semua hasil",
 * "Kosongkan", dan judul kelompok (kalau opsi punya `group`).
 * Controlled: nilai yang dicentang dipegang pemanggil.
 */
export function FilterChecklist({
  options,
  selected,
  onChange,
  autoFocus = false,
  listClassName = "max-h-60",
}: FilterChecklistProps) {
  const [query, setQuery] = useState("");
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q === ""
      ? options
      : options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const visible = matches.slice(0, MAX_VISIBLE_OPTIONS);

  function toggle(value: string) {
    onChange(
      selectedSet.has(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  }

  function selectAllMatches() {
    onChange([...new Set([...selected, ...matches.map((o) => o.value)])]);
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          autoFocus={autoFocus}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nilai..."
          className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={selectAllMatches}
          disabled={matches.length === 0}
          className="font-medium text-emerald-700 hover:underline disabled:text-slate-300 disabled:no-underline"
        >
          Pilih semua{query ? " hasil" : ""} ({matches.length.toLocaleString("id-ID")})
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          disabled={selected.length === 0}
          className="text-slate-500 hover:underline disabled:text-slate-300 disabled:no-underline"
        >
          Kosongkan
        </button>
      </div>

      <div
        className={`overflow-y-auto rounded-lg border border-slate-100 py-1 ${listClassName}`}
      >
        {visible.length === 0 && (
          <p className="px-3 py-4 text-center text-xs text-slate-400">
            {options.length === 0 ? "Belum ada data" : "Tidak ada yang cocok"}
          </p>
        )}

        {visible.map((option, index) => {
          // judul kelompok muncul saat kelompoknya berganti dari item sebelumnya
          const header =
            option.group && option.group !== visible[index - 1]?.group
              ? option.group
              : null;

          return (
            <div key={option.value}>
              {header && (
                <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {header}
                </p>
              )}
              <label className="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selectedSet.has(option.value)}
                  onChange={() => toggle(option.value)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/30"
                />
                <span className="truncate text-sm text-slate-700">
                  {option.label}
                </span>
              </label>
            </div>
          );
        })}

        {matches.length > MAX_VISIBLE_OPTIONS && (
          <p className="px-3 py-2 text-center text-[11px] text-slate-400">
            {(matches.length - MAX_VISIBLE_OPTIONS).toLocaleString("id-ID")} nilai
            lain disembunyikan — persempit dengan kotak cari
          </p>
        )}
      </div>
    </div>
  );
}

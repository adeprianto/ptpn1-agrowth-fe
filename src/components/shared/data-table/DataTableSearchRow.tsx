"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDataTableContext } from "./DataTableContext";
import type { ColumnSearchConfig } from "./dataTableFeatures";

/** Jeda sebelum ketikan diterapkan, supaya tiap huruf tidak memanggil API. */
const DEBOUNCE_MS = 400;

interface SearchCellProps {
  columnId: string;
  label: string;
  config: ColumnSearchConfig;
}

function DataTableSearchCell({ columnId, label, config }: SearchCellProps) {
  const { filterValueOf, setColumnSearch } = useDataTableContext();
  const applied = filterValueOf(columnId)?.search ?? "";

  const [draft, setDraft] = useState(applied);

  // Kalau filter diubah dari luar (chip dilepas, tombol Reset, modal),
  // kotak ini ikut menyesuaikan. Disamakan saat render, bukan lewat efek.
  const [lastApplied, setLastApplied] = useState(applied);
  if (applied !== lastApplied) {
    setLastApplied(applied);
    setDraft(applied);
  }

  useEffect(() => {
    if (draft.trim() === applied) return;

    const timer = setTimeout(() => setColumnSearch(columnId, draft), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, applied, columnId, setColumnSearch]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={draft}
        aria-label={`Cari ${label}`}
        placeholder={config.placeholder ?? "Cari..."}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          // Enter menerapkan langsung tanpa menunggu jeda
          if (event.key === "Enter") setColumnSearch(columnId, draft);
        }}
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-7 pr-2 text-xs font-normal normal-case tracking-normal text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      />
    </div>
  );
}

/**
 * Baris kedua di dalam `<thead>`: satu kotak cari di bawah judul kolom yang
 * mendeklarasikan `meta.search`. Kolom lain menyisakan sel kosong supaya
 * lebar kolomnya tetap sejajar.
 *
 * Otomatis tidak dirender kalau tidak ada satu pun kolom yang punya kotak cari.
 */
export function DataTableSearchRow() {
  const { table, searchFields, cellPaddingXClass } = useDataTableContext();

  if (searchFields.length === 0) return null;

  const searchById = new Map(searchFields.map((field) => [field.id, field]));

  return (
    <tr className="border-b border-slate-200 bg-slate-50/60">
      {table.getAllLeafColumns().map((column) => {
        const field = searchById.get(column.id);

        return (
          <th key={column.id} className={cn(cellPaddingXClass, "py-3 font-normal")}>
            {field && (
              <DataTableSearchCell
                columnId={field.id}
                label={field.label}
                config={field.config}
              />
            )}
          </th>
        );
      })}
    </tr>
  );
}

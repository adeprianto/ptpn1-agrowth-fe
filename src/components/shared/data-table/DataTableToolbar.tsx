"use client";

import type { ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useDataTableContext } from "./DataTableContext";

function describeFilter(value: unknown) {
  if (Array.isArray(value)) return `${value.length} dipilih`;
  return `"${String(value)}"`;
}

/** Tombol pembuka modal filter, lengkap dengan jumlah filter yang aktif. */
export function DataTableFilterButton({ className }: { className?: string }) {
  const { state, openFilter } = useDataTableContext();
  const count = state.columnFilters.length;

  return (
    <button
      type="button"
      onClick={() => openFilter()}
      className={cn(
        "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
        count > 0
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50",
        className,
      )}
    >
      <SlidersHorizontal className="h-4 w-4" />
      Filter
      {count > 0 && (
        <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[11px] leading-none text-white">
          {count}
        </span>
      )}
    </button>
  );
}

/** Deretan chip filter yang sedang aktif; tiap chip bisa dilepas satu-satu. */
export function DataTableActiveFilters() {
  const { state, table, columnLabel } = useDataTableContext();

  if (state.columnFilters.length === 0) {
    return <p className="text-slate-400">Klik judul kolom untuk mengurutkan.</p>;
  }

  return (
    <>
      <span className="text-slate-500">Filter aktif:</span>
      {state.columnFilters.map((filter) => {
        const column = table.getColumn(filter.id);
        const label = column ? columnLabel(column) : filter.id;

        return (
          <span
            key={filter.id}
            className="flex items-center gap-1 rounded-full bg-emerald-50 py-1 pl-3 pr-1.5 text-xs font-medium text-emerald-700"
          >
            {label}: {describeFilter(filter.value)}
            <button
              type="button"
              onClick={() =>
                state.setColumnFilters((prev) =>
                  prev.filter((f) => f.id !== filter.id),
                )
              }
              aria-label={`Hapus filter ${label}`}
              className="rounded-full p-0.5 hover:bg-emerald-100"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        );
      })}
    </>
  );
}

/** Tautan kecil untuk mengembalikan sort & filter ke nilai awal. */
export function DataTableResetButton() {
  const { state } = useDataTableContext();

  if (!state.isDirty) return null;

  return (
    <button
      type="button"
      onClick={state.reset}
      className="ml-auto text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
    >
      Reset filter &amp; urutan
    </button>
  );
}

/**
 * Baris di atas tabel: tombol filter, chip filter aktif, tombol reset.
 * Otomatis tidak dirender kalau tabel tidak punya satu pun kolom berfilter.
 *
 * @example Tambahkan kontrol sendiri di sisi kiri
 * <DataTableToolbar>
 *   <SearchInput value={search} onValueChange={setSearch} />
 * </DataTableToolbar>
 */
export function DataTableToolbar({ children }: { children?: ReactNode }) {
  const { filterFields } = useDataTableContext();

  if (filterFields.length === 0) return children ? <div>{children}</div> : null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {children}
      <DataTableFilterButton />
      <DataTableActiveFilters />
      <DataTableResetButton />
    </div>
  );
}

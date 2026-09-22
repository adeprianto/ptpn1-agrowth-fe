"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useDataTableContext } from "./DataTableContext";

function describeFilter(value: unknown) {
  if (Array.isArray(value)) return `${value.length} dipilih`;
  return `"${String(value)}"`;
}

/**
 * Deretan chip filter yang sedang aktif; tiap chip bisa dilepas satu-satu,
 * atau diklik untuk membuka kembali modal filter kolomnya.
 */
export function DataTableActiveFilters() {
  const { state, table, columnLabel, openFilter } = useDataTableContext();

  if (state.columnFilters.length === 0) {
    return (
      <p className="text-slate-400">
        Klik judul kolom untuk mengurutkan, atau ikon corong untuk memfilter.
      </p>
    );
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
            className="flex items-center gap-1 rounded-full bg-emerald-50 py-1 pl-1 pr-1.5 text-xs font-medium text-emerald-700"
          >
            <button
              type="button"
              onClick={() => openFilter(filter.id)}
              className="rounded-full px-2 py-0.5 hover:bg-emerald-100"
            >
              {label}: {describeFilter(filter.value)}
            </button>
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
 * Baris di atas tabel: chip filter yang sedang aktif dan tombol reset.
 *
 * Filter dipasang lewat ikon corong di header masing-masing kolom, jadi
 * baris ini hanya menampilkan hasilnya.
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
      <DataTableActiveFilters />
      <DataTableResetButton />
    </div>
  );
}

"use client";

import { cn } from "cn";
import { ColumnHeader } from "./ColumnHeader";
import { useDataTableContext } from "./DataTableContext";
import { DataTableSearchRow } from "./DataTableSearchRow";
import {
  cellClassFromMeta,
  headerClassFromMeta,
  type DataTableColumnMeta,
} from "./dataTableFeatures";

/** Baris header: judul kolom, kontrol sort, dan ikon pembuka filter. */
export function DataTableHead() {
  const { table, state, cellPaddingClass, columnLabel, openFilter } =
    useDataTableContext();
  const activeFilterIds = new Set(state.columnFilters.map((f) => f.id));

  return (
    <thead>
      {table.getHeaderGroups().map((group) => (
        <tr
          key={group.id}
          className="border-b border-slate-300 text-xs font-medium text-slate-400"
        >
          {group.headers.map((header) => {
            const column = header.column;
            const meta = column.columnDef.meta as DataTableColumnMeta | undefined;
            const sorted = column.getIsSorted();
            const canSort = column.getCanSort();

            // judul khusus, mis. checkbox "pilih semua" dari selectColumn
            if (meta?.headerContent) {
              return (
                <th
                  key={header.id}
                  className={cn(cellPaddingClass, headerClassFromMeta(meta))}
                >
                  {meta.headerContent}
                </th>
              );
            }

            return (
              <ColumnHeader
                key={header.id}
                label={columnLabel(column)}
                align={meta?.align}
                paddingClass={cellPaddingClass}
                className={headerClassFromMeta(meta)}
                sortKey={canSort ? column.id : undefined}
                sort={sorted ? { key: column.id, direction: sorted } : null}
                onSortChange={
                  canSort
                    ? (next) =>
                        next
                          ? column.toggleSorting(next.direction === "desc", false)
                          : column.clearSorting()
                    : undefined
                }
                // ikon corong membuka modal filter dan menyorot kolom ini
                // ikon corong hanya untuk kolom yang punya daftar centang
                onFilterClick={meta?.filter ? () => openFilter(column.id) : undefined}
                filterActive={activeFilterIds.has(column.id)}
              />
            );
          })}
        </tr>
      ))}

      {/* kotak cari per kolom, tepat di bawah judulnya */}
      <DataTableSearchRow />
    </thead>
  );
}

/** Isi tabel, termasuk baris pengganti saat data kosong atau sedang dimuat. */
export function DataTableBody() {
  const { table, loading, emptyMessage, cellPaddingClass } = useDataTableContext();
  const rows = table.getRowModel().rows;
  const columnCount = table.getAllLeafColumns().length;

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={columnCount}
            className="px-4 py-10 text-center text-sm text-slate-400 sm:px-6"
          >
            {loading ? "Memuat data..." : emptyMessage}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className={loading ? "opacity-50" : undefined}>
      {rows.map((row) => (
        <tr key={row.id} className="border-b border-slate-50 last:border-0">
          {row.getAllCells().map((cell) => {
            const meta = cell.column.columnDef.meta as
              | DataTableColumnMeta
              | undefined;

            return (
              <td
                key={cell.id}
                className={cn(cellPaddingClass, cellClassFromMeta(meta))}
              >
                <table.FlexRender cell={cell} />
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}

/**
 * Kotak tabel: pembungkus bergulir horizontal + head + body.
 * Pakai `DataTableHead` / `DataTableBody` langsung kalau butuh markup sendiri.
 */
export function DataTableContent({ className }: { className?: string }) {
  const { tableClassName } = useDataTableContext();

  return (
    <div
      className={cn(
        // tata letak — tabel lebar digulir di dalam kotak ini, bukan di halaman
        "overflow-x-auto",
        // tampilan
        "rounded-2xl border border-slate-300 bg-white",
        className,
      )}
    >
      <table className={cn("w-full text-left text-sm", tableClassName)}>
        <DataTableHead />
        <DataTableBody />
      </table>
    </div>
  );
}

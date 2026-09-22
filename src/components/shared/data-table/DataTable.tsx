"use client";

import { useCallback, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useTable, type Column, type RowData } from "@tanstack/react-table";
import { ColumnHeader } from "../ColumnHeader";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableFilterModal, type FilterField } from "./DataTableFilterModal";
import {
  dataTableFeatures,
  type DataTableColumnDef,
  type DataTableFeatures,
} from "./dataTableFeatures";
import {
  DEFAULT_PAGE_SIZE_OPTIONS,
  useDataTableState,
  type DataTableState,
} from "./useDataTableState";

interface DataTableProps<TData extends RowData> {
  columns: DataTableColumnDef<TData>[];
  data: TData[];
  getRowId?: (row: TData) => string;

  /**
   * Mode server: isi dengan total baris dari API (mis. `meta.total`).
   * Sort, filter, dan pagination tidak diproses di browser — halaman yang
   * memanggil API membaca `tableState` lalu mengirimnya sebagai parameter.
   * Kosongkan untuk mode client (semua diproses di browser).
   */
  rowCount?: number;
  /** State dari `useDataTableState()`. Wajib untuk mode server. */
  tableState?: DataTableState;

  loading?: boolean;
  emptyMessage?: string;
  /** Kelas lebar minimum tabel, mis. "min-w-300" untuk tabel dengan banyak kolom */
  tableClassName?: string;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  /** Baris chip filter aktif + tombol reset di atas tabel */
  showActiveFilters?: boolean;
}

function columnLabel<TData extends RowData>(column: Column<DataTableFeatures, TData, unknown>) {
  const { meta, header } = column.columnDef;
  return meta?.label ?? (typeof header === "string" ? header : column.id);
}

function describeFilter(value: unknown) {
  if (Array.isArray(value)) return `${value.length} dipilih`;
  return `"${String(value)}"`;
}

/**
 * Tabel generik berbasis TanStack Table v9: sort lewat klik judul kolom,
 * filter semua kolom sekaligus lewat modal (tombol "Filter" atau ikon corong
 * di header), dan pagination dengan pilihan jumlah baris per halaman.
 *
 * @example Mode client (data kecil, semua di browser)
 * <DataTable columns={columns} data={rows} />
 *
 * @example Mode server
 * const tableState = useDataTableState({ defaultSorting: [{ id: "name", desc: false }] });
 * // ...fetch memakai tableState.sorting / columnFilters / pagination
 * <DataTable columns={columns} data={rows} rowCount={meta.total} tableState={tableState} />
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  rowCount,
  tableState,
  loading = false,
  emptyMessage = "Tidak ada data yang cocok dengan filter.",
  tableClassName = "min-w-200",
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  showPagination = true,
  showActiveFilters = true,
}: DataTableProps<TData>) {
  const internalState = useDataTableState();
  const state = tableState ?? internalState;
  const isServer = rowCount !== undefined;

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId,
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      pagination: state.pagination,
    },
    onSortingChange: state.setSorting,
    onColumnFiltersChange: state.setColumnFilters,
    onPaginationChange: state.setPagination,
    manualSorting: isServer,
    manualFiltering: isServer,
    manualPagination: isServer,
    rowCount: isServer ? rowCount : undefined,
    // halaman di-reset oleh useDataTableState saat sort/filter berubah
    autoResetPageIndex: false,
  });

  // null = modal tertutup; string = terbuka (isinya id kolom yang disorot, "" = tanpa sorotan)
  const [filterModalFocus, setFilterModalFocus] = useState<string | null>(null);
  const closeFilterModal = useCallback(() => setFilterModalFocus(null), []);

  const totalRows = isServer
    ? (rowCount ?? 0)
    : table.getFilteredRowModel().rows.length;
  const rows = table.getRowModel().rows;
  const leafColumns = table.getAllLeafColumns();

  const filterFields: FilterField[] = leafColumns.flatMap((column) => {
    const config = column.columnDef.meta?.filter;
    return config ? [{ id: column.id, label: columnLabel(column), config }] : [];
  });
  const hasFilterableColumns = filterFields.length > 0;
  const activeFilterIds = new Set(state.columnFilters.map((f) => f.id));

  return (
    <div className="space-y-3">
      {showActiveFilters && hasFilterableColumns && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setFilterModalFocus("")}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium ${
              state.columnFilters.length > 0
                ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {state.columnFilters.length > 0 && (
              <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[11px] leading-none text-white">
                {state.columnFilters.length}
              </span>
            )}
          </button>

          {state.columnFilters.length === 0 ? (
            <p className="text-slate-400">
              Klik judul kolom untuk mengurutkan.
            </p>
          ) : (
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
          )}

          {state.isDirty && (
            <button
              type="button"
              onClick={state.reset}
              className="ml-auto text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
            >
              Reset filter &amp; urutan
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white">
        <table className={`w-full text-left text-sm ${tableClassName}`}>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr
                key={group.id}
                className="border-b border-slate-300 text-xs font-medium text-slate-400"
              >
                {group.headers.map((header) => {
                  const column = header.column;
                  const sorted = column.getIsSorted();
                  const canSort = column.getCanSort();

                  return (
                    <ColumnHeader
                      key={header.id}
                      label={columnLabel(column)}
                      className={column.columnDef.meta?.headerClassName}
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
                      onFilterClick={
                        column.columnDef.meta?.filter
                          ? () => setFilterModalFocus(column.id)
                          : undefined
                      }
                      filterActive={activeFilterIds.has(column.id)}
                    />
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className={loading ? "opacity-50" : undefined}>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-50 last:border-0">
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-4 py-3 ${cell.column.columnDef.meta?.cellClassName ?? ""}`}
                  >
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={leafColumns.length}
                  className="px-6 py-10 text-center text-sm text-slate-400"
                >
                  {loading ? "Memuat data..." : emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <DataTablePagination
          pageIndex={state.pagination.pageIndex}
          pageSize={state.pagination.pageSize}
          totalRows={totalRows}
          pageSizeOptions={pageSizeOptions}
          onPageIndexChange={(pageIndex) =>
            state.setPagination((prev) => ({ ...prev, pageIndex }))
          }
          onPageSizeChange={(pageSize) =>
            state.setPagination({ pageIndex: 0, pageSize })
          }
        />
      )}

      {filterModalFocus !== null && (
        <DataTableFilterModal
          fields={filterFields}
          value={state.columnFilters}
          focusId={filterModalFocus || null}
          // satu kali update state = satu kali fetch, halaman ikut kembali ke 1
          onApply={(filters) => state.setColumnFilters(filters)}
          onClose={closeFilterModal}
        />
      )}
    </div>
  );
}

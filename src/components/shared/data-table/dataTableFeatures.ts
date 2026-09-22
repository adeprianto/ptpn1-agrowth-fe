import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
  type ColumnDef,
  type FilterFn,
  type RowData,
} from "@tanstack/react-table";
import type { FilterOption } from "../ColumnHeader";

/**
 * Konfigurasi per kolom yang dibaca `DataTable` lewat `columnDef.meta`.
 */
export interface DataTableColumnMeta {
  /** Judul di header & chip filter aktif; default memakai `header` kalau berupa teks */
  label?: string;
  /** Filter di panel header: kotak cari teks, atau checklist nilai */
  filter?:
    | { type: "text"; placeholder?: string }
    | { type: "options"; options: FilterOption[] };
  headerClassName?: string;
  cellClassName?: string;
}

/**
 * Filter checklist: baris lolos kalau nilainya ada di daftar yang dicentang.
 * Hanya dipakai di mode client; di mode server nilai filter dikirim ke API.
 * (Diberi tipe `any` untuk fitur supaya tidak merujuk balik ke `dataTableFeatures`.)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterFn_inOptions: FilterFn<any, any> = Object.assign(
  (
    row: { getValue: (id: string) => unknown },
    columnId: string,
    filterValue: string[],
  ) => filterValue.includes(String(row.getValue(columnId) ?? "")),
  {
    autoRemove: (value: unknown) => !Array.isArray(value) || value.length === 0,
  },
);

/**
 * Fitur TanStack Table v9 yang dipakai semua tabel di aplikasi.
 * Didefinisikan sekali di module scope supaya referensinya stabil.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inOptions: filterFn_inOptions,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    basic: sortFn_basic,
  },
  columnMeta: {} as DataTableColumnMeta,
});

export type DataTableFeatures = typeof dataTableFeatures;

/** Tipe definisi kolom untuk `DataTable` */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>;

/**
 * Column helper yang sudah terikat ke `dataTableFeatures`.
 *
 * @example
 * const col = createDataTableColumnHelper<Pegawai>();
 * const columns = col.columns([
 *   col.accessor("nik", { header: "NIK", meta: { filter: { type: "text" } } }),
 * ]);
 */
export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

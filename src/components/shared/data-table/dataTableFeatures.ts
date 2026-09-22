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

/** Perataan isi kolom. Dipakai header dan sel sekaligus supaya selalu sejajar. */
export type ColumnAlign = "left" | "center" | "right";

/** Bentuk filter yang bisa dipasang di sebuah kolom. */
export type ColumnFilterConfig =
  | { type: "text"; placeholder?: string }
  | { type: "options"; options: FilterOption[] };

/**
 * Konfigurasi per kolom yang dibaca `DataTable` lewat `columnDef.meta`.
 * Semuanya opsional — kolom paling sederhana cukup `header` + `accessor`.
 */
export interface DataTableColumnMeta {
  /** Judul di header & chip filter aktif; default memakai `header` kalau berupa teks */
  label?: string;
  /** Filter di modal: kotak cari teks, atau checklist nilai */
  filter?: ColumnFilterConfig;
  /** Perataan header + sel */
  align?: ColumnAlign;
  /** Lebar kolom dalam kelas Tailwind, mis. "w-16" atau "min-w-48" */
  width?: string;
  /** Jangan biarkan isi sel terpotong jadi dua baris */
  nowrap?: boolean;
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

const alignClass: Record<ColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/** Kelas untuk sel header sebuah kolom, dirakit dari `meta`. */
export function headerClassFromMeta(meta: DataTableColumnMeta | undefined) {
  return [
    meta?.align ? alignClass[meta.align] : null,
    meta?.width ?? null,
    meta?.headerClassName ?? null,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Kelas untuk sel isi sebuah kolom, dirakit dari `meta`. */
export function cellClassFromMeta(meta: DataTableColumnMeta | undefined) {
  return [
    meta?.align ? alignClass[meta.align] : null,
    meta?.nowrap ? "whitespace-nowrap" : null,
    meta?.cellClassName ?? null,
  ]
    .filter(Boolean)
    .join(" ");
}

import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
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
import type { FilterOption } from "./ColumnHeader";

/** Perataan isi kolom. Dipakai header dan sel sekaligus supaya selalu sejajar. */
export type ColumnAlign = "left" | "center" | "right";

/**
 * Kotak cari teks di bawah judul kolom.
 * Mencocokkan nilai accessor kolom secara "mengandung".
 */
export interface ColumnSearchConfig {
  placeholder?: string;
}

/**
 * Daftar centang di modal filter, dibuka lewat ikon corong di samping judul.
 * Baris lolos kalau nilai kolomnya ada di antara yang dicentang.
 */
export interface ColumnFilterConfig {
  options: FilterOption[];
}

/**
 * Filter yang sedang berlaku untuk satu kolom.
 *
 * Keduanya berdiri sendiri dan boleh aktif bersamaan — kalau begitu baris
 * harus lolos dua-duanya:
 * - `search` diisi kotak di bawah judul kolom
 * - `values` diisi daftar centang di modal filter
 */
export interface ColumnFilterValue {
  search?: string;
  values?: string[];
}

/** true kalau filter kolom ini benar-benar menyaring sesuatu. */
export function isFilterActive(value: ColumnFilterValue | undefined): boolean {
  return Boolean(value?.search?.trim()) || Boolean(value?.values?.length);
}

/**
 * Konfigurasi per kolom yang dibaca `DataTable` lewat `columnDef.meta`.
 * Semuanya opsional — kolom paling sederhana cukup `header` + `accessor`.
 */
export interface DataTableColumnMeta {
  /** Judul di header, chip filter, dan judul modal; default memakai `header` */
  label?: string;
  /** Munculkan kotak cari di bawah judul kolom ini */
  search?: ColumnSearchConfig;
  /** Munculkan ikon corong yang membuka modal daftar centang */
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
 * Cara `ColumnFilterValue` disaring di mode client. Mode server tidak
 * memakainya — nilainya diteruskan apa adanya ke API.
 *
 * Yang dicocokkan adalah nilai accessor kolom. Kalau sel menampilkan teks
 * yang berbeda dari nilai accessor-nya (mis. accessor mengembalikan id tapi
 * sel merender nama), buat accessor mengembalikan teks yang ingin dicari dan
 * pindahkan tampilannya ke `cell`.
 *
 * (Diberi tipe `any` untuk fitur supaya tidak merujuk balik ke `dataTableFeatures`.)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterFn_column: FilterFn<any, any> = Object.assign(
  (
    row: { getValue: (id: string) => unknown },
    columnId: string,
    filterValue: ColumnFilterValue,
  ) => {
    const cellValue = String(row.getValue(columnId) ?? "");
    const keyword = filterValue?.search?.trim().toLowerCase();

    if (keyword && !cellValue.toLowerCase().includes(keyword)) return false;
    if (filterValue?.values?.length && !filterValue.values.includes(cellValue)) {
      return false;
    }

    return true;
  },
  {
    autoRemove: (value: unknown) =>
      !isFilterActive(value as ColumnFilterValue | undefined),
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
    column: filterFn_column,
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
 *   col.accessor("nik", {
 *     header: "NIK",
 *     meta: { search: { placeholder: "Cari NIK..." } },
 *   }),
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

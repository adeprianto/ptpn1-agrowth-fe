import type { RowData, SortingState } from "@tanstack/react-table";
import type { DataTableColumnDef } from "./dataTableFeatures";

/** Kerapatan baris. `compact` untuk tabel sisipan di halaman detail. */
export type TableDensity = "compact" | "normal";

/**
 * Konfigurasi satu tabel: kolom plus semua pilihan tampilannya.
 *
 * Dipisah dari komponen supaya bisa didefinisikan sekali per modul, diekspor,
 * lalu dipakai ulang di halaman mana pun — termasuk dioverride sebagian lewat
 * `extendTableConfig`.
 */
export interface TableConfig<TRow extends RowData> {
  columns: DataTableColumnDef<TRow>[];
  /** Kunci baris yang stabil; wajib kalau baris bisa berubah urutan */
  getRowId?: (row: TRow) => string;
  defaultSorting?: SortingState;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  emptyMessage?: string;
  /** Kelas lebar minimum tabel, mis. "min-w-300" untuk tabel berkolom banyak */
  tableClassName?: string;
  density?: TableDensity;
  /** Baris tombol filter + chip filter aktif di atas tabel */
  showToolbar?: boolean;
  showPagination?: boolean;
}

/** Nilai bawaan yang berlaku kalau konfigurasi tidak menyebutkannya. */
export const TABLE_CONFIG_DEFAULTS = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 15, 25, 50],
  emptyMessage: "Tidak ada data yang cocok dengan filter.",
  tableClassName: "min-w-200",
  density: "normal",
  showToolbar: true,
  showPagination: true,
} as const satisfies Omit<TableConfig<never>, "columns" | "getRowId" | "defaultSorting">;

/**
 * Tandai sebuah objek sebagai konfigurasi tabel. Fungsinya cuma menjaga
 * inferensi tipe kolom — tidak mengubah isinya.
 *
 * @example
 * // src/features/organisasi/components/unit/unitTableConfig.tsx
 * export const unitTableConfig = defineTableConfig<Unit>({
 *   columns: buildUnitColumns(),
 *   getRowId: (unit) => unit.id,
 *   defaultSorting: [{ id: "nama", desc: false }],
 *   tableClassName: "min-w-220",
 * });
 */
export function defineTableConfig<TRow extends RowData>(
  config: TableConfig<TRow>,
): TableConfig<TRow> {
  return config;
}

/**
 * Pakai ulang konfigurasi yang sudah ada dengan beberapa perubahan.
 *
 * @example
 * // tabel unit yang sama, tapi ringkas dan tanpa toolbar untuk halaman detail
 * const unitRingkas = extendTableConfig(unitTableConfig, {
 *   density: "compact",
 *   showToolbar: false,
 *   defaultPageSize: 5,
 * });
 */
export function extendTableConfig<TRow extends RowData>(
  base: TableConfig<TRow>,
  overrides: Partial<TableConfig<TRow>>,
): TableConfig<TRow> {
  return { ...base, ...overrides };
}

/** Padding sel per kerapatan — dipakai header maupun isi supaya sejajar. */
export const densityCellClass: Record<TableDensity, string> = {
  compact: "px-4 py-2.5",
  normal: "px-6 py-4",
};

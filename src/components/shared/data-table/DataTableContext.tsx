"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useTable, type ReactTable, type RowData } from "@tanstack/react-table";
import {
  dataTableFeatures,
  isFilterActive,
  type ColumnFilterConfig,
  type ColumnFilterValue,
  type ColumnSearchConfig,
  type DataTableColumnMeta,
  type DataTableFeatures,
} from "./dataTableFeatures";
import {
  densityCellClass,
  densityPaddingXClass,
  TABLE_CONFIG_DEFAULTS,
  type TableConfig,
  type TableDensity,
} from "./tableConfig";
import { useDataTableState, type DataTableState } from "./useDataTableState";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTable = ReactTable<DataTableFeatures, any>;

/**
 * Bentuk minimal sebuah kolom yang dibutuhkan untuk menyusun judulnya.
 * Sengaja struktural, bukan `Column<...>` bergenerik, supaya kolom dari tabel
 * bertipe data apa pun bisa masuk tanpa cast.
 */
export interface ColumnLike {
  id: string;
  columnDef: { header?: unknown; meta?: unknown };
}

/** Satu kolom yang punya daftar centang, siap diberikan ke modal filter. */
export interface FilterField {
  /** Id kolom, sekaligus key di `columnFilters` */
  id: string;
  label: string;
  config: ColumnFilterConfig;
}

/** Satu kolom yang punya kotak cari di bawah judulnya. */
export interface SearchField {
  id: string;
  label: string;
  config: ColumnSearchConfig;
}

interface DataTableContextValue {
  table: AnyTable;
  /** Sort, filter, dan halaman yang sedang berlaku */
  state: DataTableState;
  /** true kalau sort/filter/paging diproses API, bukan di browser */
  isServer: boolean;
  /** Total baris setelah filter — dari API untuk mode server */
  totalRows: number;
  loading: boolean;
  emptyMessage: string;
  tableClassName: string;
  density: TableDensity;
  /** Kelas padding sel sesuai kerapatan tabel */
  cellPaddingClass: string;
  /** Padding kiri-kanan saja, untuk baris yang mengatur padding vertikalnya sendiri */
  cellPaddingXClass: string;
  pageSizeOptions: number[];
  /** Kolom yang punya daftar centang (ikon corong + modal) */
  filterFields: FilterField[];
  /** Kolom yang punya kotak cari di bawah judulnya */
  searchFields: SearchField[];
  /** Kolom yang modal filternya sedang terbuka; null = tidak ada */
  openFilterField: FilterField | null;
  /** Buka modal daftar centang untuk satu kolom */
  openFilter: (columnId: string) => void;
  closeFilter: () => void;
  /** Filter yang sedang berlaku untuk sebuah kolom */
  filterValueOf: (columnId: string) => ColumnFilterValue | undefined;
  /** Isi kotak cari satu kolom; teks kosong menghapus bagian pencariannya */
  setColumnSearch: (columnId: string, keyword: string) => void;
  /** Isi daftar centang satu kolom; `undefined` menghapus bagian centangnya */
  setColumnValues: (columnId: string, values: string[] | undefined) => void;
  /** Hapus seluruh filter satu kolom (kotak cari sekaligus centangnya) */
  clearColumnFilter: (columnId: string) => void;
  /** Judul kolom untuk header, chip filter, dan label modal */
  columnLabel: (column: ColumnLike) => string;
}

const DataTableContext = createContext<DataTableContextValue | null>(null);

/** Baca konteks tabel terdekat. Hanya boleh dipanggil di dalam `DataTableProvider`. */
export function useDataTableContext(): DataTableContextValue {
  const context = useContext(DataTableContext);

  if (!context) {
    throw new Error(
      "Komponen DataTable harus berada di dalam <DataTableProvider> (atau <DataTable>).",
    );
  }

  return context;
}

function labelOf(column: ColumnLike) {
  const meta = column.columnDef.meta as DataTableColumnMeta | undefined;
  const header = column.columnDef.header;
  return meta?.label ?? (typeof header === "string" ? header : column.id);
}

export interface DataTableProviderProps<TRow extends RowData>
  extends Partial<TableConfig<TRow>> {
  /** Konfigurasi tabel yang bisa dipakai ulang antar halaman */
  config?: TableConfig<TRow>;
  data: TRow[];
  /**
   * Mode server: isi dengan total baris dari API (mis. `meta.total`).
   * Kosongkan untuk mode client — semua diproses di browser.
   */
  rowCount?: number;
  /** State dari `useDataTableState()`. Wajib untuk mode server. */
  tableState?: DataTableState;
  loading?: boolean;
  children: ReactNode;
}

/**
 * Menyiapkan instance TanStack Table dan menyebarkannya lewat context, supaya
 * toolbar, isi tabel, pagination, dan modal filter bisa disusun sendiri.
 *
 * Pakai `<DataTable>` kalau susunan bawaannya sudah cukup.
 *
 * @example Susunan sendiri — pagination dipindah ke atas tabel
 * <DataTableProvider config={unitTableConfig} data={rows} rowCount={total} tableState={state}>
 *   <DataTableToolbar />
 *   <DataTablePaginationBar />
 *   <DataTableContent />
 *   <DataTableFilterDialog />
 * </DataTableProvider>
 */
export function DataTableProvider<TRow extends RowData>({
  config,
  data,
  rowCount,
  tableState,
  loading = false,
  children,
  ...overrides
}: DataTableProviderProps<TRow>) {
  const settings = { ...TABLE_CONFIG_DEFAULTS, ...config, ...overrides };
  // `columns` boleh datang dari `config` atau dari prop langsung; salah satu
  // wajib ada, dan tabel tanpa kolom akan tampil kosong alih-alih melempar.
  const columns = settings.columns ?? [];
  const getRowId = settings.getRowId;

  const internalState = useDataTableState({
    defaultSorting: settings.defaultSorting,
    defaultPageSize: settings.defaultPageSize,
  });
  const state = tableState ?? internalState;
  const isServer = rowCount !== undefined;

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId,
    // semua kolom memakai cara saring yang sama: teks dari kotak cari +
    // nilai dari daftar centang (lihat filterFn_column)
    defaultColumn: { filterFn: "column" },
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

  // id kolom yang modal filternya terbuka; null = tidak ada yang terbuka
  const [filterColumnId, setFilterColumnId] = useState<string | null>(null);
  const openFilter = useCallback((columnId: string) => setFilterColumnId(columnId), []);
  const closeFilter = useCallback(() => setFilterColumnId(null), []);

  const leafColumns = table.getAllLeafColumns();

  const filterFields: FilterField[] = leafColumns.flatMap((column) => {
    const meta = column.columnDef.meta as DataTableColumnMeta | undefined;
    return meta?.filter
      ? [{ id: column.id, label: labelOf(column), config: meta.filter }]
      : [];
  });

  const searchFields: SearchField[] = leafColumns.flatMap((column) => {
    const meta = column.columnDef.meta as DataTableColumnMeta | undefined;
    return meta?.search
      ? [{ id: column.id, label: labelOf(column), config: meta.search }]
      : [];
  });

  /**
   * Ubah satu bagian filter kolom tanpa menyentuh kolom lain maupun bagian
   * lain dari kolom itu sendiri. Kalau setelah diubah kolom itu tidak lagi
   * menyaring apa pun, entri filternya dibuang supaya chip ikut hilang.
   */
  const patchColumnFilter = (
    columnId: string,
    patch: Partial<ColumnFilterValue>,
  ) =>
    state.setColumnFilters((previous) => {
      const current = previous.find((filter) => filter.id === columnId)?.value as
        | ColumnFilterValue
        | undefined;
      const others = previous.filter((filter) => filter.id !== columnId);
      const next: ColumnFilterValue = { ...current, ...patch };

      return isFilterActive(next) ? [...others, { id: columnId, value: next }] : others;
    });

  const totalRows = isServer
    ? (rowCount ?? 0)
    : table.getFilteredRowModel().rows.length;

  // Tidak di-memo: semua konsumennya berada di dalam provider ini, jadi mereka
  // ikut render ulang bersama tabel dan nilai baru tiap render tidak menambah
  // pekerjaan apa pun.
  const value: DataTableContextValue = {
    table: table as AnyTable,
    state,
    isServer,
    totalRows,
    loading,
    emptyMessage: settings.emptyMessage,
    tableClassName: settings.tableClassName,
    density: settings.density,
    cellPaddingClass: densityCellClass[settings.density],
    cellPaddingXClass: densityPaddingXClass[settings.density],
    pageSizeOptions: [...settings.pageSizeOptions],
    filterFields,
    searchFields,
    openFilterField:
      filterFields.find((field) => field.id === filterColumnId) ?? null,
    openFilter,
    closeFilter,
    filterValueOf: (columnId) =>
      state.columnFilters.find((filter) => filter.id === columnId)?.value as
        | ColumnFilterValue
        | undefined,
    setColumnSearch: (columnId, keyword) =>
      patchColumnFilter(columnId, { search: keyword.trim() || undefined }),
    setColumnValues: (columnId, values) =>
      patchColumnFilter(columnId, { values: values?.length ? values : undefined }),
    clearColumnFilter: (columnId) =>
      state.setColumnFilters((previous) =>
        previous.filter((filter) => filter.id !== columnId),
      ),
    columnLabel: labelOf,
  };

  return (
    <DataTableContext.Provider value={value}>{children}</DataTableContext.Provider>
  );
}

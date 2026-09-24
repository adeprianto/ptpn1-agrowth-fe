/**
 * Tabel data berbasis TanStack Table v9.
 *
 * Tiga lapis, pakai sesuai kebutuhan:
 *
 * 1. `DataTable` — susunan bawaan (toolbar → tabel → pagination → modal filter).
 * 2. `DataTableProvider` + sub-komponen — kalau susunannya perlu diatur sendiri.
 * 3. `defineTableConfig` + `columnPresets` — konfigurasi kolom yang bisa
 *    dipakai ulang antar modul, dan `useServerDataTable` untuk menyambungkannya
 *    ke endpoint.
 */

// Lapisan komponen
export { DataTable } from "./DataTable";
export {
  DataTableProvider,
  useDataTableContext,
  type DataTableProviderProps,
  type FilterField,
  type SearchField,
} from "./DataTableContext";
export {
  DataTableBody,
  DataTableContent,
  DataTableHead,
} from "./DataTableContent";
export {
  DataTableFilterDialog,
  DataTablePaginationBar,
} from "./DataTableConnected";
export {
  DataTableActiveFilters,
  DataTableResetButton,
  DataTableToolbar,
} from "./DataTableToolbar";
export { DataTablePagination, getPageNumbers } from "./DataTablePagination";
export {
  ColumnHeader,
  type FilterOption,
  type SortDirection,
  type SortState,
} from "./ColumnHeader";
export { FilterChecklist } from "./FilterChecklist";
export {
  ColumnFilterModal,
  type ColumnFilterModalProps,
} from "./ColumnFilterModal";
export { DataTableSearchRow } from "./DataTableSearchRow";

// Definisi kolom
export {
  cellClassFromMeta,
  createDataTableColumnHelper,
  dataTableFeatures,
  headerClassFromMeta,
  isFilterActive,
  type ColumnAlign,
  type ColumnFilterConfig,
  type ColumnFilterValue,
  type ColumnSearchConfig,
  type DataTableColumnDef,
  type DataTableColumnMeta,
  type DataTableFeatures,
} from "./dataTableFeatures";
export {
  actionsColumn,
  badgeColumn,
  linkColumn,
  NUMBER_CELL_CLASS,
  numberColumn,
  rowNumberColumn,
  selectColumn,
  titleColumn,
  toFilterOptions,
  toValueOptions,
} from "./columnPresets";

// Konfigurasi tabel
export {
  defineTableConfig,
  densityCellClass,
  densityPaddingXClass,
  extendTableConfig,
  TABLE_CONFIG_DEFAULTS,
  type TableConfig,
  type TableDensity,
} from "./tableConfig";

// State & pengambilan data
export {
  columnFiltersToRecord,
  DEFAULT_PAGE_SIZE_OPTIONS,
  useDataTableState,
  type DataTableState,
} from "./useDataTableState";
export {
  filterList,
  filterText,
  useServerDataTable,
  type ServerTableParams,
  type ServerTableResult,
  type UseServerDataTableReturn,
} from "./useServerDataTable";

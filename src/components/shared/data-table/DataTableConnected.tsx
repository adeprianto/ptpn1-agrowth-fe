"use client";

import { useDataTableContext } from "./DataTableContext";
import { DataTableFilterModal } from "./DataTableFilterModal";
import { DataTablePagination } from "./DataTablePagination";

/**
 * Pagination yang sudah tersambung ke konteks tabel.
 * Pakai `DataTablePagination` langsung kalau butuh di luar `DataTable`.
 */
export function DataTablePaginationBar({ className }: { className?: string }) {
  const { state, totalRows, pageSizeOptions } = useDataTableContext();

  return (
    <DataTablePagination
      pageIndex={state.pagination.pageIndex}
      pageSize={state.pagination.pageSize}
      totalRows={totalRows}
      pageSizeOptions={pageSizeOptions}
      className={className}
      onPageIndexChange={(pageIndex) =>
        state.setPagination((prev) => ({ ...prev, pageIndex }))
      }
      onPageSizeChange={(pageSize) => state.setPagination({ pageIndex: 0, pageSize })}
    />
  );
}

/**
 * Modal filter semua kolom, tersambung ke konteks tabel.
 * Hanya dirender saat terbuka supaya draft filternya selalu mulai dari
 * filter yang sedang aktif.
 */
export function DataTableFilterDialog() {
  const { filterFields, filterFocusId, state, closeFilter } = useDataTableContext();

  if (filterFocusId === null || filterFields.length === 0) return null;

  return (
    <DataTableFilterModal
      fields={filterFields}
      value={state.columnFilters}
      focusId={filterFocusId || null}
      // satu kali update state = satu kali fetch, halaman ikut kembali ke 1
      onApply={(filters) => state.setColumnFilters(filters)}
      onClose={closeFilter}
    />
  );
}

"use client";

import { ColumnFilterModal } from "./ColumnFilterModal";
import { useDataTableContext } from "./DataTableContext";
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
 * Modal filter untuk kolom yang ikon corongnya diklik, tersambung ke konteks
 * tabel. Hanya satu kolom yang diubah tiap kali Terapkan ditekan.
 *
 * Pakai `ColumnFilterModal` langsung kalau butuh di luar `DataTable`.
 */
export function DataTableFilterDialog() {
  const { openFilterField, closeFilter, filterValueOf, setColumnValues } =
    useDataTableContext();

  if (!openFilterField) return null;

  return (
    <ColumnFilterModal
      open
      label={openFilterField.label}
      config={openFilterField.config}
      value={filterValueOf(openFilterField.id)?.values}
      // satu kali update state = satu kali fetch, halaman ikut kembali ke 1;
      // kotak cari kolom ini tidak ikut tersentuh
      onApply={(values) => setColumnValues(openFilterField.id, values)}
      onClose={closeFilter}
    />
  );
}

"use client";

import type { ReactNode } from "react";
import type { RowData } from "@tanstack/react-table";
import { DataTableProvider, type DataTableProviderProps } from "./DataTableContext";
import { DataTableContent } from "./DataTableContent";
import { DataTableFilterDialog, DataTablePaginationBar } from "./DataTableConnected";
import { DataTableToolbar } from "./DataTableToolbar";

interface DataTableProps<TRow extends RowData>
  extends Omit<DataTableProviderProps<TRow>, "children"> {
  /** Kontrol tambahan di sisi kiri toolbar, mis. kotak pencarian */
  toolbarExtra?: ReactNode;
}

/**
 * Tabel generik berbasis TanStack Table v9 dengan susunan bawaan:
 * toolbar → tabel → pagination → modal filter.
 *
 * Sort lewat klik judul kolom. Filter dipasang per kolom lewat ikon corong di
 * header kolomnya; toolbar menampilkan chip filter yang sedang aktif. Paging
 * dengan pilihan jumlah baris per halaman.
 *
 * Butuh susunan lain? Pakai `DataTableProvider` dan rangkai sendiri
 * `DataTableToolbar`, `DataTableContent`, `DataTablePaginationBar`, dan
 * `DataTableFilterDialog`.
 *
 * @example Mode client — data sudah lengkap di browser
 * <DataTable config={jabatanTableConfig} data={rows} />
 *
 * @example Mode server — sort/filter/paging dikerjakan API
 * const tableState = useDataTableState({ defaultSorting: [{ id: "name", desc: false }] });
 * <DataTable
 *   config={pegawaiTableConfig}
 *   data={rows}
 *   rowCount={meta.total}
 *   tableState={tableState}
 *   loading={loading}
 * />
 *
 * @example Override sebagian konfigurasi untuk satu halaman saja
 * <DataTable config={unitTableConfig} data={rows} density="compact" showToolbar={false} />
 */
export function DataTable<TRow extends RowData>({
  toolbarExtra,
  ...props
}: DataTableProps<TRow>) {
  const showToolbar = props.showToolbar ?? props.config?.showToolbar ?? true;
  const showPagination =
    props.showPagination ?? props.config?.showPagination ?? true;

  return (
    <DataTableProvider {...props}>
      <div className="space-y-3">
        {showToolbar && <DataTableToolbar>{toolbarExtra}</DataTableToolbar>}
        <DataTableContent />
        {showPagination && <DataTablePaginationBar />}
        <DataTableFilterDialog />
      </div>
    </DataTableProvider>
  );
}

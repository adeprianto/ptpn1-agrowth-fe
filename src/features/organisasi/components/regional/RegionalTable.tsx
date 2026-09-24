"use client";

import { useMemo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  actionsColumn,
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  numberColumn,
  rowNumberColumn,
  titleColumn,
  type DataTableState,
  type TableConfig,
} from "@/components/shared/data-table";
import { Badge } from "@/components/ui";
import type { Regional } from "../../model/regional";

const col = createDataTableColumnHelper<Regional>();

interface RegionalTableOptions {
  /** Nomor baris pertama di halaman ini */
  startIndex?: number;
  /** Aksi edit & hapus hanya untuk akun yang berwenang; kosongkan untuk sembunyi */
  onEdit?: (row: Regional) => void;
  onDelete?: (row: Regional) => void;
}

/**
 * Konfigurasi tabel regional. Dipisah dari komponennya supaya bisa dipakai
 * ulang atau diubah sebagian lewat `extendTableConfig`.
 *
 * Id kolom sengaja sama dengan nama parameter sort di backend.
 */
export function createRegionalTableConfig({
  startIndex = 1,
  onEdit,
  onDelete,
}: RegionalTableOptions = {}): TableConfig<Regional> {
  return defineTableConfig<Regional>({
    getRowId: (row) => row.id,
    tableClassName: "min-w-180",
    emptyMessage: "Tidak ada regional yang cocok dengan pencarian.",
    columns: col.columns([
      rowNumberColumn<Regional>(startIndex),
      titleColumn<Regional>({
        id: "name",
        header: "Regional",
        value: (row) => row.nama,
        subtitle: (row) => row.kode,
        search: { placeholder: "Cari nama regional..." },
      }),
      col.accessor("jumlahUnit", {
        id: "jumlah_unit",
        header: "Unit",
        sortFn: "basic",
        meta: { nowrap: true },
        cell: ({ getValue }) => <Badge tone="emerald">{getValue()} Unit</Badge>,
      }),
      numberColumn<Regional>({
        id: "jumlah_karyawan",
        header: "Karyawan",
        value: (row) => row.jumlahKaryawan,
      }),
      actionsColumn<Regional>({
        ariaLabel: (row) => `Aksi untuk ${row.nama}`,
        actions: (row) => [
          {
            label: "Lihat Detail",
            icon: Eye,
            href: `/dashboard/organisasi/regional/${row.id}`,
          },
          ...(onEdit
            ? [{ label: "Edit", icon: Pencil, onClick: () => onEdit(row) }]
            : []),
          ...(onDelete
            ? [
                {
                  label: "Hapus",
                  icon: Trash2,
                  variant: "danger" as const,
                  onClick: () => onDelete(row),
                },
              ]
            : []),
        ],
      }),
    ]),
  });
}

interface RegionalTableProps extends RegionalTableOptions {
  rows: Regional[];
  /** Total baris dari API (mode server) */
  rowCount: number;
  tableState: DataTableState;
  loading?: boolean;
}

export function RegionalTable({
  rows,
  rowCount,
  tableState,
  loading = false,
  startIndex,
  onEdit,
  onDelete,
}: RegionalTableProps) {
  const config = useMemo(
    () => createRegionalTableConfig({ startIndex, onEdit, onDelete }),
    [startIndex, onEdit, onDelete],
  );

  return (
    <DataTable
      config={config}
      data={rows}
      rowCount={rowCount}
      tableState={tableState}
      loading={loading}
    />
  );
}

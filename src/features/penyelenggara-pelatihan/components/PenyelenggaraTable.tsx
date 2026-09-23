"use client";

import { useMemo } from "react";
import { Globe, Pencil, Trash2 } from "lucide-react";
import {
  actionsColumn,
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  rowNumberColumn,
  titleColumn,
  type DataTableState,
  type TableConfig,
} from "@/components/shared/data-table";
import { Badge } from "@/components/ui";
import { orDash } from "@/lib/format";
import {
  PENYELENGGARA_TIPE_LABEL,
  PENYELENGGARA_TIPE_SHORT,
  PENYELENGGARA_TIPE_TONE,
  type Penyelenggara,
  type PenyelenggaraTipe,
} from "../model/penyelenggara";

const col = createDataTableColumnHelper<Penyelenggara>();

const TIPE_OPTIONS = (Object.keys(PENYELENGGARA_TIPE_LABEL) as PenyelenggaraTipe[]).map(
  (tipe) => ({ value: tipe, label: PENYELENGGARA_TIPE_LABEL[tipe] }),
);

const STATUS_OPTIONS = [
  { value: "1", label: "Aktif" },
  { value: "0", label: "Non-aktif" },
];

interface PenyelenggaraTableOptions {
  startIndex?: number;
  onDelete?: (row: Penyelenggara) => void;
}

/** Konfigurasi tabel penyelenggara pelatihan. */
export function createVendorTableConfig({
  startIndex = 1,
  onDelete,
}: PenyelenggaraTableOptions = {}): TableConfig<Penyelenggara> {
  return defineTableConfig<Penyelenggara>({
    getRowId: (row) => row.id,
    tableClassName: "min-w-200",
    emptyMessage: "Belum ada penyelenggara yang cocok dengan pencarian atau filter.",
    columns: col.columns([
      rowNumberColumn<Penyelenggara>(startIndex),
      titleColumn<Penyelenggara>({
        id: "name",
        header: "Nama",
        value: (row) => row.nama,
        subtitle: (row) =>
          row.picNama
            ? `PIC: ${row.picNama}${row.picJabatan ? ` · ${row.picJabatan}` : "" }`
            : null,
        search: { placeholder: "Cari nama penyelenggara..." },
      }),
      col.accessor((row) => row.tipe ?? "", {
        id: "classification",
        header: "Jenis",
        meta: { label: "Jenis", filter: { options: TIPE_OPTIONS }, nowrap: true },
        cell: ({ row }) =>
          row.original.tipe ? (
            <Badge tone={PENYELENGGARA_TIPE_TONE[row.original.tipe]}>
              {PENYELENGGARA_TIPE_SHORT[row.original.tipe]}
            </Badge>
          ) : (
            <span className="text-slate-300">-</span>
          ),
      }),
      col.accessor((row) => row.telepon ?? "", {
        id: "phone",
        header: "Kontak",
        meta: { search: { placeholder: "Cari telepon..." } },
        cell: ({ row }) => (
          <>
            <p className="whitespace-nowrap text-slate-700">
              {orDash(row.original.telepon)}
            </p>
            <p className="text-xs text-slate-400">{orDash(row.original.email)}</p>
          </>
        ),
      }),
      col.accessor((row) => row.kota ?? "", {
        id: "city",
        header: "Kota",
        meta: { search: { placeholder: "Cari kota..." } },
        cell: ({ row }) => (
          <>
            <p className="text-slate-700">{orDash(row.original.kota)}</p>
            {row.original.website && (
              <a
                href={row.original.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-emerald-600 hover:underline"
              >
                <Globe className="h-3 w-3" />
                Website
              </a>
            )}
          </>
        ),
      }),
      col.accessor((row) => (row.aktif ? "1" : "0"), {
        id: "status",
        header: "Status",
        meta: { label: "Status", filter: { options: STATUS_OPTIONS }, nowrap: true },
        cell: ({ row }) => (
          <Badge tone={row.original.aktif ? "emerald" : "rose" }>
            {row.original.aktif ? "Aktif" : "Non-aktif" }
          </Badge>
        ),
      }),
      actionsColumn<Penyelenggara>({
        ariaLabel: (row) => `Aksi untuk ${row.nama}`,
        actions: (row) => [
          {
            label: "Edit",
            icon: Pencil,
            href: `/penyelenggara-pelatihan/${row.id}/edit`,
          },
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

interface PenyelenggaraTableProps extends PenyelenggaraTableOptions {
  rows: Penyelenggara[];
  rowCount: number;
  tableState: DataTableState;
  loading?: boolean;
}

export function PenyelenggaraTable({
  rows,
  rowCount,
  tableState,
  loading = false,
  startIndex,
  onDelete,
}: PenyelenggaraTableProps) {
  const config = useMemo(
    () => createVendorTableConfig({ startIndex, onDelete }),
    [startIndex, onDelete],
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

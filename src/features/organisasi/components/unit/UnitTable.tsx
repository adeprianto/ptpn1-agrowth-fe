"use client";

import { useMemo } from "react";
import { Eye, MapPin, Pencil, Trash2 } from "lucide-react";
import {
  actionsColumn,
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  numberColumn,
  rowNumberColumn,
  type DataTableState,
  type TableConfig,
} from "@/components/shared/data-table";
import { Badge, type BadgeTone } from "@/components/ui";
import type { MasterItem } from "../../model/masterData";
import type { Unit } from "../../model/unit";
import { getJenisDisplay, getKomoditasTone } from "./jenisUnit";

const col = createDataTableColumnHelper<Unit>();

/** Daftar badge untuk kolom yang isinya bisa lebih dari satu nilai. */
function BadgeList({
  items,
  render,
}: {
  items: MasterItem[];
  render: (item: MasterItem) => { label: string; tone: BadgeTone };
}) {
  if (items.length === 0) return <span className="text-slate-300">-</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => {
        const display = render(item);
        return (
          <Badge key={item.id} tone={display.tone}>
            {display.label}
          </Badge>
        );
      })}
    </div>
  );
}

export interface UnitTableOptions {
  startIndex?: number;
  /** Isi checklist filter kolom; kosongkan kalau tabel dipakai mode client */
  regionalOptions?: MasterItem[];
  jenisOptions?: MasterItem[];
  komoditasOptions?: MasterItem[];
  onDelete?: (row: Unit) => void;
}

/**
 * Konfigurasi tabel unit. Id kolom sengaja sama dengan nama parameter filter
 * di backend supaya `UnitList` bisa meneruskannya langsung.
 */
export function createUnitTableConfig({
  startIndex = 1,
  regionalOptions,
  jenisOptions,
  komoditasOptions,
  onDelete,
}: UnitTableOptions = {}): TableConfig<Unit> {
  const asOptions = (items?: MasterItem[]) =>
    items?.map((item) => ({ value: item.id, label: item.nama })) ?? [];

  return defineTableConfig<Unit>({
    getRowId: (row) => row.id,
    tableClassName: "min-w-200",
    emptyMessage: "Tidak ada unit yang cocok dengan pencarian atau filter.",
    columns: col.columns([
      rowNumberColumn<Unit>(startIndex),
      col.accessor("nama", {
        id: "name",
        header: "Unit",
        meta: { search: { placeholder: "Cari nama atau kode unit..." } },
        cell: ({ row }) => {
          // Ikon unit mengikuti kategori operasional pertamanya
          const primary = getJenisDisplay(row.original.jenis[0]);
          const PrimaryIcon = primary.icon;

          return (
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${primary.iconBg}`}
              >
                <PrimaryIcon className={`h-4 w-4 ${primary.iconColor}`} />
              </span>
              <div>
                <p className="font-medium text-slate-800">{row.original.nama}</p>
                <p className="text-xs text-slate-400">{row.original.kode}</p>
              </div>
            </div>
          );
        },
      }),
      col.accessor((row) => row.regionalId ?? "", {
        id: "regional_id",
        header: "Regional",
        meta: {
          search: { placeholder: "Cari regional..." },
          filter: { options: asOptions(regionalOptions) },
        },
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="h-4 w-4 text-slate-300" />
            {row.original.regionalNama ?? "-" }
          </span>
        ),
      }),
      col.display({
        id: "operational_category_id",
        header: "Kategori",
        meta: { label: "Kategori", filter: { options: asOptions(jenisOptions) } },
        cell: ({ row }) => (
          <BadgeList
            items={row.original.jenis}
            render={(item) => {
              const display = getJenisDisplay(item);
              return { label: display.label, tone: display.tone };
            }}
          />
        ),
      }),
      col.display({
        id: "business_type_id",
        header: "Komoditas",
        meta: { label: "Komoditas", filter: { options: asOptions(komoditasOptions) } },
        cell: ({ row }) => (
          <BadgeList
            items={row.original.komoditas}
            render={(item) => ({ label: item.nama, tone: getKomoditasTone(item) })}
          />
        ),
      }),
      numberColumn<Unit>({
        id: "jumlah_karyawan",
        header: "Karyawan",
        value: (row) => row.jumlahKaryawan,
      }),
      actionsColumn<Unit>({
        ariaLabel: (row) => `Aksi untuk ${row.nama}`,
        actions: (row) => [
          { label: "Lihat Detail", icon: Eye, href: `/organisasi/unit/${row.id}` },
          { label: "Edit", icon: Pencil, href: `/organisasi/unit/${row.id}/edit` },
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

interface UnitTableProps extends UnitTableOptions {
  rows: Unit[];
  rowCount: number;
  tableState: DataTableState;
  loading?: boolean;
}

export function UnitTable({
  rows,
  rowCount,
  tableState,
  loading = false,
  ...options
}: UnitTableProps) {
  const config = useMemo(
    () => createUnitTableConfig(options),
    // opsi filter datang dari fetch terpisah; cukup dibandingkan per bagian
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      options.startIndex,
      options.regionalOptions,
      options.jenisOptions,
      options.komoditasOptions,
      options.onDelete,
    ],
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

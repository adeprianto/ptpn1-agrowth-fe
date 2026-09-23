"use client";

import { useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  actionsColumn,
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  numberColumn,
  rowNumberColumn,
  titleColumn,
  toValueOptions,
  type DataTableState,
  type FilterOption,
  type TableConfig,
} from "@/components/shared/data-table";
import { Badge, TagChipList, type BadgeTone } from "@/components/ui";
import { orDash } from "@/lib/format";
import {
  BIDANG_LABEL,
  JENIS_KOMPETENSI_LABEL,
  JENIS_PSDM_LABEL,
  type JenisPsdm,
  type Pelatihan,
} from "../model/pelatihan";

const col = createDataTableColumnHelper<Pelatihan>();

/**
 * Ubah peta nilai→label jadi opsi checklist.
 * Yang dicentang adalah nilai yang dikenal backend, yang dibaca pengguna
 * adalah labelnya.
 */
function optionsFrom<T extends string>(labels: Record<T, string>): FilterOption[] {
  return (Object.keys(labels) as T[]).map((value) => ({
    value,
    label: labels[value],
  }));
}

const JENIS_PSDM_TONE: Record<JenisPsdm, BadgeTone> = {
  bod_boc: "blue",
  agrowallet: "emerald",
  iht: "blue",
  public_training: "violet",
  kursus_jabatan: "violet",
  benchmarking: "amber",
  program_budaya: "amber",
  sertifikasi: "emerald",
};

const STATUS_OPTIONS = [
  { value: "1", label: "Aktif" },
  { value: "0", label: "Non-aktif" },
];

interface PelatihanTableOptions {
  startIndex?: number;
  /** Isi checklist kolom Tag; diambil dari GET /api/trainings/tags */
  tagOptions?: string[];
  onDelete?: (row: Pelatihan) => void;
}

/** Konfigurasi tabel program pelatihan. */
export function createTrainingTableConfig({
  startIndex = 1,
  tagOptions = [],
  onDelete,
}: PelatihanTableOptions = {}): TableConfig<Pelatihan> {
  return defineTableConfig<Pelatihan>({
    getRowId: (row) => row.id,
    tableClassName: "min-w-320",
    emptyMessage: "Belum ada program pelatihan yang cocok dengan pencarian atau filter.",
    columns: col.columns([
      rowNumberColumn<Pelatihan>(startIndex),
      titleColumn<Pelatihan>({
        id: "name",
        header: "Nama Pelatihan",
        value: (row) => row.nama,
        subtitle: (row) => row.deskripsi,
        search: { placeholder: "Cari nama pelatihan..." },
        meta: { width: "min-w-64" },
      }),
      col.accessor((row) => row.penyelenggara ?? "", {
        id: "vendor",
        header: "Penyelenggara",
        meta: {
          search: { placeholder: "Cari penyelenggara..." },
          cellClassName: "text-slate-700",
        },
        cell: ({ getValue }) => orDash(getValue() as string),
      }),
      col.accessor((row) => row.tags.join(" "), {
        id: "tags",
        header: "Tag",
        // satu baris punya banyak tag, jadi tidak ada urutan yang masuk akal
        enableSorting: false,
        meta: {
          label: "Tag",
          search: { placeholder: "Cari tag..." },
          filter: { options: toValueOptions(tagOptions) },
          width: "min-w-48",
        },
        cell: ({ row }) => <TagChipList tags={row.original.tags} />,
      }),
      col.accessor((row) => row.jenisPsdmLabel, {
        id: "hr_development_type",
        header: "Jenis Pengembangan SDM",
        meta: {
          label: "Jenis Pengembangan SDM",
          filter: { options: optionsFrom(JENIS_PSDM_LABEL) },
          nowrap: true,
        },
        cell: ({ row }) =>
          row.original.jenisPsdm ? (
            <Badge tone={JENIS_PSDM_TONE[row.original.jenisPsdm]}>
              {row.original.jenisPsdmLabel}
            </Badge>
          ) : (
            <span className="text-slate-300">-</span>
          ),
      }),
      col.accessor((row) => row.jenisKompetensiLabel, {
        id: "competency_type",
        header: "Jenis Kompetensi",
        meta: {
          label: "Jenis Kompetensi",
          filter: { options: optionsFrom(JENIS_KOMPETENSI_LABEL) },
          cellClassName: "text-slate-700",
        },
      }),
      col.accessor((row) => row.bidangLabel, {
        id: "learning_sector",
        header: "Bidang",
        meta: {
          label: "Bidang",
          filter: { options: optionsFrom(BIDANG_LABEL) },
          nowrap: true,
          cellClassName: "text-slate-700",
        },
      }),
      numberColumn<Pelatihan>({
        id: "realizations_count",
        header: "Realisasi",
        value: (row) => row.jumlahRealisasi,
        suffix: "kali",
        // backend belum mengizinkan pengurutan berdasarkan jumlah realisasi
        meta: { headerClassName: "whitespace-nowrap" },
      }),
      col.accessor((row) => (row.aktif ? "1" : "0"), {
        id: "status",
        header: "Status",
        meta: { label: "Status", filter: { options: STATUS_OPTIONS }, nowrap: true },
        cell: ({ row }) => (
          <Badge tone={row.original.aktif ? "emerald" : "rose"}>
            {row.original.aktif ? "Aktif" : "Non-aktif"}
          </Badge>
        ),
      }),
      actionsColumn<Pelatihan>({
        ariaLabel: (row) => `Aksi untuk ${row.nama}`,
        actions: (row) => [
          { label: "Edit", icon: Pencil, href: `/dashboard/program-pelatihan/${row.id}/edit` },
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

interface PelatihanTableProps extends PelatihanTableOptions {
  rows: Pelatihan[];
  rowCount: number;
  tableState: DataTableState;
  loading?: boolean;
}

export function PelatihanTable({
  rows,
  rowCount,
  tableState,
  loading = false,
  startIndex,
  tagOptions,
  onDelete,
}: PelatihanTableProps) {
  const config = useMemo(
    () => createTrainingTableConfig({ startIndex, tagOptions, onDelete }),
    [startIndex, tagOptions, onDelete],
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

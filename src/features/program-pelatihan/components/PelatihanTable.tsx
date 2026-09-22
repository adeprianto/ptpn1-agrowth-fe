"use client";

import { useMemo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  actionsColumn,
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  optionsFilter,
  rowNumberColumn,
  textFilter,
  toValueOptions,
  type TableConfig,
} from "@/components/shared/data-table";
import { Badge, type BadgeTone } from "@/components/ui";
import type { PelatihanRow } from "./programPelatihanDummyData";

const col = createDataTableColumnHelper<PelatihanRow>();

const JENIS_PSDM_TONE: Record<PelatihanRow["jenisPsdm"], BadgeTone> = {
  "Pengembangan BOD/BOC": "blue",
  Agrowallet: "emerald",
  IHT: "blue",
  "Public Training": "violet",
  "Kursus Jabatan": "violet",
  Benchmarking: "amber",
  "Program Budaya": "amber",
  Sertifikasi: "emerald",
};

const JENIS_PSDM_OPTIONS = toValueOptions(Object.keys(JENIS_PSDM_TONE));

const JENIS_KOMPETENSI_OPTIONS = toValueOptions([
  "Hard Competency",
  "Soft Competency",
  "Hard & Soft Competency",
]);

interface PelatihanTableOptions {
  /** Isi checklist filter Bidang, diturunkan dari data yang ada */
  bidangOptions: string[];
  onDelete?: (row: PelatihanRow) => void;
}

/**
 * Konfigurasi tabel program pelatihan.
 *
 * Datanya masih dummy dan sudah lengkap di browser, jadi tabel ini dipakai
 * dalam mode client.
 */
export function createPelatihanTableConfig({
  bidangOptions,
  onDelete,
}: PelatihanTableOptions): TableConfig<PelatihanRow> {
  return defineTableConfig<PelatihanRow>({
    getRowId: (row) => row.id,
    tableClassName: "min-w-200",
    defaultSorting: [{ id: "nama", desc: false }],
    emptyMessage: "Tidak ada program pelatihan yang cocok dengan pencarian.",
    columns: col.columns([
      rowNumberColumn<PelatihanRow>(),
      col.accessor("nama", {
        header: "Nama Pelatihan",
        meta: {
          filter: textFilter("Cari nama pelatihan..."),
          cellClassName: "font-medium text-slate-800",
        },
      }),
      col.accessor("penyelenggara", {
        header: "Penyelenggara",
        meta: {
          filter: textFilter("Cari penyelenggara..."),
          nowrap: true,
          cellClassName: "font-medium text-slate-800",
        },
      }),
      col.accessor("jenisKompetensi", {
        header: "Jenis Kompetensi",
        meta: {
          filter: optionsFilter(JENIS_KOMPETENSI_OPTIONS),
          cellClassName: "font-medium text-slate-800",
        },
      }),
      col.accessor("jenisPsdm", {
        header: "Jenis Pengembangan SDM",
        meta: { filter: optionsFilter(JENIS_PSDM_OPTIONS), nowrap: true },
        cell: ({ row }) => (
          <Badge tone={JENIS_PSDM_TONE[row.original.jenisPsdm]}>
            {row.original.jenisPsdm}
          </Badge>
        ),
      }),
      col.accessor("bidang", {
        header: "Bidang",
        meta: {
          filter: optionsFilter(toValueOptions(bidangOptions)),
          cellClassName: "font-medium text-slate-800",
        },
      }),
      actionsColumn<PelatihanRow>({
        ariaLabel: (row) => `Aksi untuk ${row.nama}`,
        actions: (row) => [
          { label: "Lihat Detail", icon: Eye, href: `/program-pelatihan/${row.id}` },
          {
            label: "Edit",
            icon: Pencil,
            href: `/program-pelatihan/${row.id}/edit`,
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

interface PelatihanTableProps extends Partial<PelatihanTableOptions> {
  rows: PelatihanRow[];
}

export function PelatihanTable({ rows, bidangOptions, onDelete }: PelatihanTableProps) {
  // kalau tidak dikirim dari luar, isi filter Bidang diturunkan dari datanya
  const bidang = useMemo(
    () => bidangOptions ?? Array.from(new Set(rows.map((row) => row.bidang))).sort(),
    [bidangOptions, rows],
  );

  const config = useMemo(
    () => createPelatihanTableConfig({ bidangOptions: bidang, onDelete }),
    [bidang, onDelete],
  );

  // mode client: data program pelatihan sudah lengkap di browser
  return <DataTable config={config} data={rows} />;
}

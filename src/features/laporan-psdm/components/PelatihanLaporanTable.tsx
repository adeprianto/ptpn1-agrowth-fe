"use client";

import { useMemo } from "react";
import { FilePlus, FileText } from "lucide-react";
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
} from "@/components/shared/data-table";
import { Badge, TagChipList } from "@/components/ui";
import { orDash } from "@/lib/format";
import {
  BIDANG_LABEL,
  JENIS_KOMPETENSI_LABEL,
  JENIS_PSDM_LABEL,
  type Pelatihan,
} from "@/features/program-pelatihan/model/pelatihan";

const col = createDataTableColumnHelper<Pelatihan>();

/**
 * Ubah peta nilai -> label jadi pilihan checklist filter.
 * Yang dikirim ke backend nilainya (mis. "bod_boc"), yang dibaca user labelnya.
 */
function optionsFrom(labels: Record<string, string>): FilterOption[] {
  return Object.entries(labels).map(([value, label]) => ({ value, label }));
}

/**
 * Kolom tabel pelatihan di halaman Laporan Realisasi PSDM.
 * Kolom paling kanan berisi aksi untuk menambah atau melihat laporannya.
 *
 * Id kolom = nama parameter filter di backend, jadi filter yang dicentang
 * bisa langsung diteruskan ke API (lihat fetcher di LaporanPsdmList).
 */
function buildColumns(startIndex: number, tagOptions: string[]) {
  return col.columns([
    rowNumberColumn<Pelatihan>(startIndex),
    titleColumn<Pelatihan>({
      id: "name",
      header: "Nama Pelatihan",
      value: (row) => row.nama,
      subtitle: (row) => row.penyelenggara,
      search: { placeholder: "Cari nama pelatihan..." },
      meta: { width: "min-w-72" },
    }),
    col.accessor((row) => row.tags.join(" "), {
      id: "tags",
      header: "Tag Pelatihan",
      // satu pelatihan punya banyak tag, jadi kolom ini tidak diurutkan
      enableSorting: false,
      meta: {
        search: { placeholder: "Cari tag..." },
        filter: { options: toValueOptions(tagOptions) },
        width: "min-w-48",
      },
      cell: ({ row }) => <TagChipList tags={row.original.tags} />,
    }),
    col.accessor((row) => row.jenisPsdmLabel, {
      id: "hr_development_type",
      header: "Jenis Pengembangan SDM",
      meta: { filter: { options: optionsFrom(JENIS_PSDM_LABEL) }, nowrap: true },
      cell: ({ getValue }) => <Badge tone="emerald">{getValue() as string}</Badge>,
    }),
    col.accessor((row) => row.jenisKompetensiLabel, {
      id: "competency_type",
      header: "Jenis Kompetensi",
      meta: {
        filter: { options: optionsFrom(JENIS_KOMPETENSI_LABEL) },
        cellClassName: "text-slate-700",
      },
      cell: ({ getValue }) => orDash(getValue() as string),
    }),
    col.accessor((row) => row.bidangLabel, {
      id: "learning_sector",
      header: "Bidang",
      meta: {
        filter: { options: optionsFrom(BIDANG_LABEL) },
        nowrap: true,
        cellClassName: "text-slate-700",
      },
    }),
    {
      ...numberColumn<Pelatihan>({
        id: "realizations_count",
        header: "Jumlah Laporan",
        value: (row) => row.jumlahRealisasi,
        suffix: "laporan",
        meta: { headerClassName: "whitespace-nowrap" },
      }),
      // backend belum mengizinkan pengurutan berdasarkan jumlah realisasi
      enableSorting: false,
    },
    actionsColumn<Pelatihan>({
      ariaLabel: (row) => `Aksi laporan untuk ${row.nama}`,
      actions: (row) => [
        {
          label: "Tambah Laporan",
          icon: FilePlus,
          href: `/laporan-psdm/pelatihan/${row.id}/create`,
        },
        {
          label: "Lihat / Ubah Laporan",
          icon: FileText,
          href: `/laporan-psdm/pelatihan/${row.id}`,
          // belum ada laporan yang bisa dilihat atau diubah
          disabled: row.jumlahRealisasi === 0,
        },
      ],
    }),
  ]);
}

interface PelatihanLaporanTableProps {
  rows: Pelatihan[];
  rowCount: number;
  tableState: DataTableState;
  loading?: boolean;
  startIndex: number;
  /** Isi checklist filter kolom Tag, dari GET /api/trainings/tags */
  tagOptions: string[];
}

export function PelatihanLaporanTable({
  rows,
  rowCount,
  tableState,
  loading = false,
  startIndex,
  tagOptions,
}: PelatihanLaporanTableProps) {
  const config = useMemo(
    () =>
      defineTableConfig<Pelatihan>({
        columns: buildColumns(startIndex, tagOptions),
        getRowId: (row) => row.id,
        tableClassName: "min-w-280",
        emptyMessage: "Tidak ada pelatihan yang cocok dengan pencarian atau filter.",
      }),
    [startIndex, tagOptions],
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

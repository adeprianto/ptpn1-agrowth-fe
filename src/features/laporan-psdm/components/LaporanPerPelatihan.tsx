"use client";

import { useMemo } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  actionsColumn,
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  NUMBER_CELL_CLASS,
  numberColumn,
  rowNumberColumn,
  useServerDataTable,
} from "@/components/shared/data-table";
import { Alert, ButtonLink } from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { formatDateRange, formatRupiah, orDash } from "@/lib/format";
import { getTraining } from "@/features/program-pelatihan/api/pelatihan";
import { deleteTrainingRealization, getTrainingRealizationList } from "../api/laporan";
import { PESAN_PELATIHAN_NONAKTIF, methodLabel, type Laporan } from "../model/laporan";

const col = createDataTableColumnHelper<Laporan>();

function buildColumns(
  startIndex: number,
  onDelete: (row: Laporan) => void,
  /** true kalau pelatihannya non-aktif: Ubah & Hapus dimatikan */
  terkunci: boolean,
) {
  const columns = col.columns([
    rowNumberColumn<Laporan>(startIndex),
    col.accessor((row) => row.tanggalMulai, {
      id: "periode",
      header: "Periode Pelatihan",
      meta: { nowrap: true, cellClassName: "font-medium text-slate-800" },
      cell: ({ row }) =>
        formatDateRange(row.original.tanggalMulai, row.original.tanggalAkhir),
    }),
    col.accessor((row) => methodLabel(row.metode), {
      id: "metode",
      header: "Metode",
      meta: { cellClassName: "text-slate-700" },
    }),
    col.accessor((row) => row.kota ?? "", {
      id: "kota",
      header: "Kota",
      meta: { cellClassName: "text-slate-700" },
      cell: ({ getValue }) => orDash(getValue() as string),
    }),
    numberColumn<Laporan>({
      id: "peserta",
      header: "Peserta",
      value: (row) => row.jumlahPeserta,
      suffix: "orang",
    }),
    numberColumn<Laporan>({
      id: "jam",
      header: "Total Jam",
      value: (row) => row.totalJam,
      suffix: "jam",
    }),
    col.accessor((row) => row.totalBiaya, {
      id: "biaya",
      header: "Total Biaya",
      meta: { align: "right", nowrap: true, cellClassName: NUMBER_CELL_CLASS },
      cell: ({ getValue }) => formatRupiah(getValue() as number),
    }),
    actionsColumn<Laporan>({
      ariaLabel: () => "Aksi laporan",
      actions: (row) => [
        // selalu aktif: laporan pelatihan non-aktif pun tetap bisa dilihat
        { label: "Lihat Detail", icon: Eye, href: `/dashboard/laporan-psdm/${row.id}` },
        {
          label: "Ubah Laporan",
          icon: Pencil,
          href: `/dashboard/laporan-psdm/${row.id}/edit`,
          disabled: terkunci,
        },
        {
          label: "Hapus",
          icon: Trash2,
          variant: "danger",
          onClick: () => onDelete(row),
          disabled: terkunci,
        },
      ],
    }),
  ]);

  // backend selalu mengurutkan laporan dari tanggal mulai terbaru,
  // jadi judul kolom tidak dibuat bisa diklik untuk sort
  return columns.map((column) => ({ ...column, enableSorting: false }));
}

/** Daftar laporan realisasi milik satu pelatihan, lengkap dengan ubah & hapus. */
export function LaporanPerPelatihan({ trainingId }: { trainingId: string }) {
  const pelatihan = useAsyncData((signal) => getTraining(trainingId, signal), {
    deps: [trainingId],
  });

  const { tableState, rows, total, loading, error, refresh, startIndex } =
    useServerDataTable<Laporan>({
      deps: [trainingId],
      fetcher: ({ page, perPage }, signal) =>
        getTrainingRealizationList({ trainingId, page, perPage }, signal).then((res) => ({
          rows: res.rows,
          total: res.meta?.total ?? res.rows.length,
        })),
    });

  const hapus = useDeleteConfirm<Laporan>({
    onDelete: (row) => deleteTrainingRealization(row.id),
    onSuccess: refresh,
  });

  // Selama data pelatihan belum dimuat, anggap terkunci supaya tombol tidak
  // sempat terlihat aktif sesaat.
  const terkunci = pelatihan.data?.aktif !== true;

  const config = useMemo(
    () =>
      defineTableConfig<Laporan>({
        columns: buildColumns(startIndex, hapus.ask, terkunci),
        getRowId: (row) => row.id,
        tableClassName: "min-w-220",
        showToolbar: false,
        emptyMessage: "Belum ada laporan realisasi untuk pelatihan ini.",
      }),
    [startIndex, hapus.ask, terkunci],
  );

  const namaPelatihan = pelatihan.data?.nama ?? "Memuat...";

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Laporan Realisasi PSDM", href: "/dashboard/laporan-psdm" },
          { label: namaPelatihan },
        ]}
      />

      <PageHeader
        title={namaPelatihan}
        description={`Laporan realisasi pelatihan · Penyelenggara: ${orDash(pelatihan.data?.penyelenggara)}`}
        action={
          !terkunci && (
            <ButtonLink
              href={`/dashboard/laporan-psdm/pelatihan/${trainingId}/create`}
              size="lg"
              icon={Plus}
            >
              Tambah Laporan
            </ButtonLink>
          )
        }
      />

      {pelatihan.data && !pelatihan.data.aktif && (
        <Alert tone="warning">{PESAN_PELATIHAN_NONAKTIF}</Alert>
      )}

      {pelatihan.error && (
        <Alert tone="error">Gagal memuat data pelatihan: {pelatihan.error}</Alert>
      )}
      {error && <Alert tone="error">Gagal memuat laporan: {error}</Alert>}
      {hapus.error && (
        <Alert tone="error" onDismiss={hapus.dismissError}>
          {hapus.error}
        </Alert>
      )}

      <DataTable
        config={config}
        data={rows}
        rowCount={total}
        tableState={tableState}
        loading={loading}
      />

      <ConfirmDialog
        open={hapus.target !== null}
        title="Hapus laporan realisasi ini?"
        description="Seluruh data peserta dan biaya di laporan ini ikut terhapus."
        confirmLabel="Hapus"
        variant="danger"
        loading={hapus.deleting}
        onConfirm={hapus.confirm}
        onCancel={hapus.cancel}
      />
    </div>
  );
}

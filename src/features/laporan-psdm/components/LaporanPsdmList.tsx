"use client";

import { Clock, FilePlus, Hourglass, Trash2, Users, Wallet } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import { filterList, filterText, useServerDataTable } from "@/components/shared/data-table";
import { Alert, ButtonLink } from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { formatNumber, formatRupiah } from "@/lib/format";
import {
  getTrainingList,
  getTrainingTags,
} from "@/features/program-pelatihan/api/pelatihan";
import type {
  BidangPelatihan,
  JenisKompetensi,
  JenisPsdm,
  Pelatihan,
} from "@/features/program-pelatihan/model/pelatihan";
import { PelatihanLaporanTable } from "./PelatihanLaporanTable";
import { getTrainingRealizationSummary } from "../api/laporan";

/**
 * Halaman awal Laporan Realisasi PSDM.
 *
 * Alurnya: pilih pelatihan di tabel -> menu aksi di kolom paling kanan ->
 * "Tambah Laporan" (form baru) atau "Lihat / Ubah Laporan" (daftar laporan
 * pelatihan itu, tempat edit & hapus).
 */
export default function LaporanPsdmList() {
  const { tableState, rows, total, loading, error, startIndex } =
    useServerDataTable<Pelatihan>({
      fetcher: ({ filters, sort, direction, page, perPage }, signal) =>
        getTrainingList(
          {
            // id kolom di tabel = nama parameter cari/filter di backend
            nama: filterText(filters.name),
            tag: filterText(filters.tags),
            tags: filterList(filters.tags),
            jenisPsdm: filterList(filters.hr_development_type) as JenisPsdm[] | undefined,
            jenisKompetensi: filterList(filters.competency_type) as
              | JenisKompetensi[]
              | undefined,
            bidang: filterList(filters.learning_sector) as BidangPelatihan[] | undefined,
            sort,
            direction,
            page,
            perPage,
          },
          signal,
        ).then((res) => ({ rows: res.rows, total: res.meta?.total ?? res.rows.length })),
    });

  const { data: summary } = useAsyncData(getTrainingRealizationSummary);
  // isi checklist filter kolom Tag
  const { data: tags } = useAsyncData(getTrainingTags);

  // Tampilan kosong hanya kalau memang belum ada pelatihan sama sekali,
  // bukan karena hasil pencarian kosong.
  const belumAdaPelatihan = !loading && !error && total === 0 && !tableState.isDirty;

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Laporan Realisasi PSDM" },
        ]}
      />

      <PageHeader
        title="Laporan Realisasi PSDM"
        description="Pilih pelatihan, lalu tambahkan atau ubah laporan realisasinya lewat menu aksi"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryStatCard
          label="Total Realisasi Biaya"
          value={summary ? formatRupiah(summary.totalBiaya) : "-"}
          icon={Wallet}
        />
        <SummaryStatCard
          label="Total Jam Pembelajaran"
          value={summary ? `${formatNumber(summary.totalJam)} Jam` : "-"}
          icon={Clock}
        />
        <SummaryStatCard
          label="Total Peserta"
          value={summary ? formatNumber(summary.totalPeserta) : "-"}
          icon={Users}
        />
      </div>

      {error && <Alert tone="error">Gagal memuat data pelatihan: {error}</Alert>}

      {belumAdaPelatihan ? (
        <BelumAdaPelatihan />
      ) : (
        <PelatihanLaporanTable
          rows={rows}
          rowCount={total}
          tableState={tableState}
          loading={loading}
          startIndex={startIndex}
          tagOptions={tags ?? []}
        />
      )}
    </div>
  );
}

/** Tampilan saat belum ada satu pun program pelatihan yang bisa dilaporkan. */
function BelumAdaPelatihan() {
  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-lg border border-slate-300 bg-white p-5 shadow-sm sm:p-10">
      {/* Latar belakang gradien kiri & kanan */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-64 bg-linear-to-r from-green-50/70 to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-64 bg-linear-to-l from-green-50/70 to-transparent"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Ilustrasi ikon */}
        <div className="relative mb-6 flex h-36 w-36 items-center justify-center rounded-3xl bg-gray-50/50">
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-gray-200"></div>
          <div className="relative flex h-24 w-20 flex-col items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="mb-2 h-1 w-8 rounded-full bg-gray-200"></div>
            <div className="mb-2 h-1 w-12 rounded-full bg-gray-200"></div>
            <div className="mb-2 h-1 w-10 rounded-full bg-gray-200"></div>
            <div className="mt-2 flex w-full justify-around px-2">
              <div className="h-4 w-2 rounded-sm bg-gray-200"></div>
              <div className="h-6 w-2 rounded-sm bg-gray-200"></div>
              <div className="h-5 w-2 rounded-sm bg-green-400"></div>
            </div>

            <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-500 shadow-sm">
              <Hourglass size={14} />
            </div>
            <div className="absolute -bottom-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#004d40] text-white shadow-sm">
              <Trash2 size={18} />
            </div>
          </div>
        </div>

        <span className="mb-6 rounded-full bg-gray-200 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-600">
          Status Rekapitulasi: Nihil
        </span>

        <h2 className="mb-4 text-3xl font-bold text-[#003d2b]">
          Belum Ada Data Laporan Realisasi PSDM
        </h2>
        <p className="mb-10 max-w-3xl text-sm leading-relaxed text-gray-600">
          Laporan realisasi dibuat dari program pelatihan. Belum ada program
          pelatihan yang tersedia — tambahkan program pelatihan terlebih dahulu,
          lalu kembali ke halaman ini untuk melaporkan realisasinya.
        </p>

        <ButtonLink href="/dashboard/program-pelatihan/create" size="lg" icon={FilePlus}>
          Tambah Program Pelatihan
        </ButtonLink>
      </div>
    </div>
  );
}

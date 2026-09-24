"use client";

import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, Badge, ButtonLink, Card, CardHeader, Field, StaticValue } from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { formatDate, formatNumber, formatRupiah } from "@/lib/format";
import { getTraining } from "@/features/program-pelatihan/api/pelatihan";
import { PesertaBiayaTable } from "./PesertaBiayaTable";
import { getTrainingRealizationDetail } from "../api/laporan";
import {
  countDays,
  methodLabel,
  needsLocation,
  PESAN_PELATIHAN_NONAKTIF,
  toNumber,
} from "../model/laporan";

/** Satu isian hanya-baca: label di atas, nilai di bawah. */
function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Field label={label}>
      <StaticValue>{children}</StaticValue>
    </Field>
  );
}

/**
 * Detail satu laporan realisasi — hanya untuk dilihat, jadi tetap bisa dibuka
 * walaupun pelatihannya non-aktif. Susunannya sama dengan form laporan.
 *
 * Alurnya: muat laporan -> dari situ dapat id pelatihan -> muat pelatihannya.
 */
export function LaporanDetail({ laporanId }: { laporanId: string }) {
  const laporan = useAsyncData((signal) => getTrainingRealizationDetail(laporanId, signal), {
    deps: [laporanId],
  });

  const trainingId = laporan.data?.trainingId;
  const pelatihan = useAsyncData((signal) => getTraining(trainingId as string, signal), {
    deps: [trainingId],
    enabled: Boolean(trainingId),
  });

  const form = laporan.data?.form;
  const data = pelatihan.data;
  const listHref = trainingId
    ? `/dashboard/laporan-psdm/pelatihan/${trainingId}`
    : "/dashboard/laporan-psdm";

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Laporan Realisasi PSDM", href: "/dashboard/laporan-psdm" },
          { label: data?.nama ?? "Pelatihan", href: listHref },
          { label: "Detail Laporan" },
        ]}
      />

      <PageHeader
        title="Detail Laporan Realisasi Pengembangan SDM"
        description={data?.nama}
        action={
          // tombol ubah hanya untuk pelatihan yang masih aktif
          data?.aktif && (
            <ButtonLink href={`/dashboard/laporan-psdm/${laporanId}/edit`} size="lg" icon={Pencil}>
              Ubah Laporan
            </ButtonLink>
          )
        }
      />

      {laporan.error && <Alert tone="error">Gagal memuat laporan: {laporan.error}</Alert>}
      {pelatihan.error && <Alert tone="error">Gagal memuat pelatihan: {pelatihan.error}</Alert>}
      {data && !data.aktif && <Alert tone="warning">{PESAN_PELATIHAN_NONAKTIF}</Alert>}

      {!form ? (
        !laporan.error && (
          <Card padding="roomy" className="text-center text-sm text-slate-400">
            Memuat data laporan...
          </Card>
        )
      ) : (
        <>
          {/* 1. Rincian Pelatihan */}
          <Card padding="roomy">
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  Rincian Pelatihan
                  {data && (
                    <Badge tone={data.aktif ? "emerald" : "rose"}>
                      {data.aktif ? "Aktif" : "Non-aktif"}
                    </Badge>
                  )}
                </span>
              }
            />
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Info label="Nama Pelatihan">{data?.nama}</Info>
              <Info label="Penyelenggara / PIC">{data?.penyelenggara}</Info>
              <Info label="Jenis Pengembangan SDM">{data?.jenisPsdmLabel}</Info>
              <Info label="Jenis Kompetensi">{data?.jenisKompetensiLabel}</Info>
              <Info label="Bidang">{data?.bidangLabel}</Info>
            </div>
          </Card>

          {/* 2. Waktu & Lokasi */}
          <Card padding="roomy">
            <CardHeader title="Waktu & Lokasi Pelatihan" />
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Info label="Tanggal Mulai">{formatDate(form.tanggalMulai)}</Info>
              <Info label="Tanggal Akhir">
                {formatDate(form.tanggalAkhir)} ({countDays(form.tanggalMulai, form.tanggalAkhir)} hari)
              </Info>
              <Info label="Metode Pelatihan">{methodLabel(form.metode)}</Info>
              {needsLocation(form.metode) && (
                <>
                  <Info label="Kota Pelatihan">{form.kota}</Info>
                  <div className="sm:col-span-2">
                    <Info label="Lokasi Pelatihan (Alamat)">{form.alamat}</Info>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* 3. Durasi */}
          <Card padding="roomy">
            <CardHeader title="Durasi Pelatihan" description="Jam pembelajaran per hari untuk setiap peserta" />
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Info label="Experiential Learning">{form.jamExperiential} jam/hari</Info>
              <Info label="Social Learning">{form.jamSocial} jam/hari</Info>
              <Info label="Formal Learning">{form.jamFormal} jam/hari</Info>
            </div>
          </Card>

          {/* 4. Biaya */}
          <Card padding="roomy">
            <CardHeader title="Biaya Pelatihan" />
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Info label="Kategori Biaya">{form.kategoriBiaya}</Info>
              <Info label="Alokasi Biaya">{form.alokasiBiaya}</Info>
              <Info label="Biaya Pelatihan per Peserta">
                {formatRupiah(toNumber(form.biayaPelatihan))}
              </Info>
            </div>
          </Card>

          {/* 5. Peserta & biaya riil */}
          <Card padding="roomy">
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  Informasi Peserta & Alokasi Biaya Riil
                  <Badge tone="emerald">{formatNumber(form.peserta.length)} Peserta</Badge>
                </span>
              }
            />
            <div className="mt-5">
              <PesertaBiayaTable
                peserta={form.peserta}
                biayaPelatihan={toNumber(form.biayaPelatihan)}
                readOnly
              />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

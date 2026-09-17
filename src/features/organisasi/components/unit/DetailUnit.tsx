"use client";

import Link from "next/link";
import { ListChecks, User, Users, Wallet } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { PanelCard } from "@/components/shared/PanelCard";
import { EntityInfoCard } from "@/components/shared/EntityInforCard";
import { AnggaranPengembanganChart } from "@/components/shared/AnggaranPengembanganChart";
import { DistribusiKaryawanChart } from "@/components/shared/DistribusiKaryawanChart";
import { PengajuanPelatihanList } from "@/components/shared/PengajuanPelatihanList";
import { unitRows } from "./unitDummyData";
import { getUnitDetail } from "./unitDetailDummyData";
import { UnitPositionTable } from "./UnitPositionTable";

interface DetailUnitProps {
  id: string;
}

export function DetailUnit({ id }: DetailUnitProps) {
  const unit = unitRows.find((row) => row.id === id);

  if (!unit) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">Unit tidak ditemukan.</p>
        <Link
          href="/organisasi"
          className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:underline"
        >
          Kembali ke Organisasi
        </Link>
      </div>
    );
  }

  const detail = getUnitDetail(id);

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Unit", href: "/organisasi/unit" },
          { label: unit.name },
        ]}
      />

      <PageHeader
        title={unit.name}
        description={`${unit.kode} . ${unit.regional} . Komoditas ${unit.komoditas}`}
      />

      {!detail ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
          Detail lengkap (struktur posisi, anggaran, dll) untuk unit ini belum
          tersedia di data dummy.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total Karyawan"
              value={detail.totalKaryawan}
              icon={Users}
            />
            <MetricCard
              label="Posisi Terisi"
              value={`${detail.posisiTerisi}/${detail.posisiKuota}`}
              icon={User}
            />
            <MetricCard
              label="Realisasi Anggaran"
              value={`Rp ${detail.realisasiAnggaran.toLocaleString("id-ID")}`}
              icon={Wallet}
            />
            <MetricCard
              label="Pengajuan Aktif"
              value={
                detail.riwayatPengajuan.filter(
                  (r) =>
                    r.status === "diajukan" || r.status === "menunggu_approval",
                ).length
              }
              icon={ListChecks}
              variant="featured"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <EntityInfoCard
                title="Informasi Unit"
                penanggungJawab={detail.penanggungJawab}
                noHp={detail.noHp}
                alamatKantor={detail.alamat}
                indukOrganisasiLabel="Induk Organisasi"
                indukOrganisasiValue={unit.regional}
              />
            </div>
            <div className="lg:col-span-3">
              <UnitPositionTable rows={detail.strukturPosisi} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PanelCard
              title="Anggaran Pengembangan SDM"
              subtitle="Rencana vs Realisasi per Bulan"
            >
              <AnggaranPengembanganChart data={detail.anggaranPengembangan} />
            </PanelCard>

            <PanelCard
              title="Distribusi Karyawan"
              subtitle="Berdasarkan Job Family"
            >
              <DistribusiKaryawanChart data={detail.distribusiKaryawan} />
            </PanelCard>
          </div>

          <PanelCard
            title="Riwayat Pengajuan Pelatihan"
            subtitle="Pengajuan yang pernah dikirim oleh unit ini"
          >
            <PengajuanPelatihanList rows={detail.riwayatPengajuan} />
          </PanelCard>
        </>
      )}
    </div>
  );
}

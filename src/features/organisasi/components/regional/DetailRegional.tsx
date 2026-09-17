"use client";

import Link from "next/link";
import { ListChecks, Network, User, Wallet } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { PanelCard } from "@/components/shared/PanelCard";
import { regionalRows } from "./regionalDummyData";
import { RegionalInfoCard } from "./RegionalInfoCard";
import { RegionalUnitStructureTable } from "./RegionalUnitStructureTable";
import { AnggaranPengembanganChart } from "./AnggaranPengembanganChart";
import { DistribusiKaryawanChart } from "./DistribusiKaryawanChart";
import { MenungguValidasiList } from "./MenungguValidasiList";
import {
  pendingValidationRows,
  unitStructureRows,
} from "./regionalDetailDummyData";

interface DetailRegionalProps {
  id: string;
}

export function DetailRegional({ id }: DetailRegionalProps) {
  // Ini bagian yang nge-resolve id -> record aslinya. Breadcrumb & judul
  // halaman pakai `regional.nama`, BUKAN `id` mentah dari URL.
  const regional = regionalRows.find((r) => r.id === id);

  if (!regional) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">Regional tidak ditemukan.</p>
        <Link
          href="/organisasi/regional"
          className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:underline"
        >
          Kembali ke daftar Regional
        </Link>
      </div>
    );
  }

  // DUMMY — realisasi anggaran & jumlah menunggu validasi belum dari API,
  // nanti diganti hasil GET /api/v1/organisasi/regional/{id}
  const realisasiAnggaran = 245_000_000;
  const menungguValidasi = pendingValidationRows.filter(
    (v) => v.status === "menunggu_approval" || v.status === "diajukan",
  ).length;

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/organisasi" },
          { label: "Regional", href: "/organisasi/regional" },
          { label: regional.nama },
        ]}
      />

      <PageHeader
        title={`${regional.nama} - ${regional.wilayah}`}
        description={`${regional.kode} · Ringkasan organisasi, SDM, dan pengembangan di wilayah kerja ini.`}
        action={null}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Jumlah Unit"
          value={regional.jumlahUnit}
          icon={Network}
        />
        <MetricCard
          label="Total Karyawan"
          value={regional.jumlahKaryawan}
          icon={User}
        />
        <MetricCard
          label="Realisasi Anggaran"
          value={`Rp ${realisasiAnggaran.toLocaleString("id-ID")}`}
          icon={Wallet}
        />
        <MetricCard
          label="Menunggu Validasi"
          value={menungguValidasi}
          icon={ListChecks}
          variant="featured"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <RegionalInfoCard indukOrganisasi="Head Office (HO)" />
        </div>
        <div className="lg:col-span-3">
          <RegionalUnitStructureTable rows={unitStructureRows} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PanelCard
          className="lg:col-span-2"
          title="Anggaran Pengembangan SDM"
          subtitle="Rencana vs Realisasi per Bulan"
        >
          <AnggaranPengembanganChart />
        </PanelCard>

        <PanelCard
          title="Distribusi Karyawan"
          subtitle="Berdasarkan Job Family"
        >
          <DistribusiKaryawanChart />
        </PanelCard>
      </div>

      <PanelCard
        title="Menunggu Validasi di Level ini"
        subtitle="Pengajuan pelatihan dari unit-unit di regional ini"
      >
        <MenungguValidasiList rows={pendingValidationRows} />
      </PanelCard>
    </div>
  );
}

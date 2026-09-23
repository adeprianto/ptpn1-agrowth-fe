"use client";

import { ListChecks, Network, User, Wallet } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { DetailPageState } from "@/components/shared/DetailPageState";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { PanelCard } from "@/components/shared/PanelCard";
import { useAsyncData } from "@/hooks/useAsyncData";
import { formatNumber, formatRupiah } from "@/lib/format";
import { getRegional } from "../../api/regional";
import { RegionalInfoCard } from "./RegionalInfoCard";
import { RegionalUnitStructureTable } from "./RegionalUnitStructureTable";
import { EntityEmployeeTable } from "../shared/EntityEmployeeTable";
import { AnggaranPengembanganChart } from "./AnggaranPengembanganChart";
import { DistribusiKaryawanChart } from "./DistribusiKaryawanChart";
import { MenungguValidasiList } from "./MenungguValidasiList";
import { pendingValidationRows } from "./regionalDetailDummyData";

interface DetailRegionalProps {
  id: string;
}

export function DetailRegional({ id }: DetailRegionalProps) {
  const query = useAsyncData((signal) => getRegional(id, signal), { deps: [id] });
  const regional = query.data;

  if (!regional) {
    return (
      <DetailPageState
        query={query}
        resource="regional"
        backHref="/dashboard/organisasi/regional"
        backLabel="Kembali ke daftar Regional"
      />
    );
  }

  // DUMMY — realisasi anggaran & jumlah menunggu validasi belum dari API,
  // nanti diganti hasil GET /api/v1/organisasi/regional/{id}
  const realisasiAnggaran = 245_000_000;
  const menungguValidasi = pendingValidationRows.filter(
    (row) => row.status === "menunggu_approval" || row.status === "diajukan",
  ).length;

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/dashboard/organisasi" },
          { label: "Regional", href: "/dashboard/organisasi/regional" },
          { label: regional.nama },
        ]}
      />

      <PageHeader
        title={regional.nama}
        description={`${regional.kode} · Ringkasan organisasi, SDM, dan pengembangan di wilayah kerja ini.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Jumlah Unit" value={regional.jumlahUnit} icon={Network} />
        <MetricCard
          label="Total Karyawan"
          value={formatNumber(regional.jumlahKaryawan)}
          icon={User}
        />
        <MetricCard
          label="Realisasi Anggaran"
          value={formatRupiah(realisasiAnggaran)}
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
          <RegionalInfoCard
            penanggungJawab={regional.kepalaRegional ?? undefined}
            indukOrganisasi={regional.induk ?? "-"}
          />
        </div>
        <div className="lg:col-span-3">
          <RegionalUnitStructureTable regionalId={regional.id} />
        </div>
      </div>

      <EntityEmployeeTable
        entityId={regional.id}
        title="Karyawan Kantor Regional"
        subtitle={`${formatNumber(
          regional.jumlahKaryawanKantor,
        )} pegawai ditempatkan langsung di kantor regional (di luar pegawai unit)`}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PanelCard
          className="lg:col-span-2"
          title="Anggaran Pengembangan SDM"
          subtitle="Rencana vs Realisasi per Bulan"
        >
          <AnggaranPengembanganChart />
        </PanelCard>

        <PanelCard title="Distribusi Karyawan" subtitle="Berdasarkan Job Family">
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

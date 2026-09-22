"use client";

import { ListChecks, User, Users, Wallet } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { DetailPageState } from "@/components/shared/DetailPageState";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { PanelCard } from "@/components/shared/PanelCard";
import { EntityInfoCard } from "@/components/shared/EntityInforCard";
import { AnggaranPengembanganChart } from "@/components/shared/AnggaranPengembanganChart";
import { DistribusiKaryawanChart } from "@/components/shared/DistribusiKaryawanChart";
import { PengajuanPelatihanList } from "@/components/shared/PengajuanPelatihanList";
import { useAsyncData } from "@/hooks/useAsyncData";
import { formatNumber, formatRupiah } from "@/lib/format";
import { getUnit } from "../../api/unit";
import { komoditasLabel } from "../../model/unit";
import { getUnitDetailDummy } from "./unitDetailDummyData";
import { UnitPositionTable } from "./UnitPositionTable";
import { EntityEmployeeTable } from "../shared/EntityEmployeeTable";
import { getJenisDisplay } from "./jenisUnit";

interface DetailUnitProps {
  id: string;
}

export function DetailUnit({ id }: DetailUnitProps) {
  const query = useAsyncData((signal) => getUnit(id, signal), { deps: [id] });
  const unit = query.data;

  if (!unit) {
    return (
      <DetailPageState
        query={query}
        resource="unit"
        backHref="/organisasi/unit"
        backLabel="Kembali ke daftar Unit"
      />
    );
  }

  // DUMMY — struktur posisi, anggaran, distribusi & pengajuan belum dari API
  const detail = getUnitDetailDummy();

  const jenisLabel = unit.jenis.map((item) => getJenisDisplay(item).label).join(", ");
  const komoditas = komoditasLabel(unit);
  const description = [
    unit.kode,
    unit.regionalNama,
    jenisLabel,
    komoditas !== "-" && `Komoditas ${komoditas}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const pengajuanAktif = detail.riwayatPengajuan.filter(
    (row) => row.status === "diajukan" || row.status === "menunggu_approval",
  ).length;

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Unit", href: "/organisasi/unit" },
          { label: unit.nama },
        ]}
      />

      <PageHeader title={unit.nama} description={description} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Karyawan"
          value={formatNumber(unit.jumlahKaryawan)}
          icon={Users}
        />
        <MetricCard
          label="Posisi Terisi"
          value={`${detail.posisiTerisi}/${detail.posisiKuota}`}
          icon={User}
        />
        <MetricCard
          label="Realisasi Anggaran"
          value={formatRupiah(detail.realisasiAnggaran)}
          icon={Wallet}
        />
        <MetricCard
          label="Pengajuan Aktif"
          value={pengajuanAktif}
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
            indukOrganisasiValue={unit.regionalNama ?? "-"}
          />
        </div>
        <div className="lg:col-span-3">
          <UnitPositionTable rows={detail.strukturPosisi} />
        </div>
      </div>

      <EntityEmployeeTable
        entityId={unit.id}
        title="Karyawan Unit"
        subtitle={`${formatNumber(unit.jumlahKaryawan)} pegawai ditempatkan di unit ini`}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PanelCard
          title="Anggaran Pengembangan SDM"
          subtitle="Rencana vs Realisasi per Bulan"
        >
          <AnggaranPengembanganChart data={detail.anggaranPengembangan} />
        </PanelCard>

        <PanelCard title="Distribusi Karyawan" subtitle="Berdasarkan Job Family">
          <DistribusiKaryawanChart data={detail.distribusiKaryawan} />
        </PanelCard>
      </div>

      <PanelCard
        title="Riwayat Pengajuan Pelatihan"
        subtitle="Pengajuan yang pernah dikirim oleh unit ini"
      >
        <PengajuanPelatihanList rows={detail.riwayatPengajuan} />
      </PanelCard>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
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
import { ApiError } from "@/lib/http-client";
import { getUnit } from "../../api/unit";
import type { UnitListResource } from "@/types/api/unit";
import { getUnitDetailDummy } from "./unitDetailDummyData";
import { UnitPositionTable } from "./UnitPositionTable";
import { EntityEmployeeTable } from "../shared/EntityEmployeeTable";
import { getJenisDisplay } from "./jenisUnit";

interface DetailUnitProps {
  id: number;
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; code: number | null; message: string }
  | { status: "ready"; unit: UnitListResource };

export function DetailUnit({ id }: DetailUnitProps) {
  // Hasil disimpan bersama id-nya; kalau id berubah, otomatis dianggap loading
  const [loaded, setLoaded] = useState<{ id: number; state: LoadState } | null>(
    null,
  );
  const state: LoadState =
    loaded?.id === id ? loaded.state : { status: "loading" };

  useEffect(() => {
    const controller = new AbortController();
    getUnit(id, controller.signal)
      .then((unit) => setLoaded({ id, state: { status: "ready", unit } }))
      .catch((e: Error) => {
        if (controller.signal.aborted) return;
        setLoaded({
          id,
          state: {
            status: "error",
            code: e instanceof ApiError ? e.status : null,
            message: e.message,
          },
        });
      });
    return () => controller.abort();
  }, [id]);

  if (state.status === "loading") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
        Memuat data unit...
      </div>
    );
  }

  if (state.status === "error") {
    const message =
      state.code === 404
        ? "Unit tidak ditemukan."
        : state.code === 403
          ? "Anda tidak memiliki akses ke unit ini."
          : `Gagal memuat data unit: ${state.message}`;

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">{message}</p>
        <Link
          href="/organisasi/unit"
          className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:underline"
        >
          Kembali ke daftar Unit
        </Link>
      </div>
    );
  }

  const { unit } = state;
  // DUMMY — struktur posisi, anggaran, distribusi & pengajuan belum dari API
  const detail = getUnitDetailDummy();

  const jenisLabel = unit.jenis.map((j) => getJenisDisplay(j).label).join(", ");
  const komoditasLabel = unit.komoditas.map((k) => k.name).join(", ");
  const description = [
    unit.code,
    unit.regional?.name,
    jenisLabel,
    komoditasLabel && `Komoditas ${komoditasLabel}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Unit", href: "/organisasi/unit" },
          { label: unit.name },
        ]}
      />

      <PageHeader title={unit.name} description={description} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Karyawan"
          value={unit.jumlah_karyawan.toLocaleString("id-ID")}
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
              (r) => r.status === "diajukan" || r.status === "menunggu_approval",
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
            indukOrganisasiValue={unit.regional?.name ?? "-"}
          />
        </div>
        <div className="lg:col-span-3">
          <UnitPositionTable rows={detail.strukturPosisi} />
        </div>
      </div>

      <EntityEmployeeTable
        entityId={unit.id}
        title="Karyawan Unit"
        subtitle={`${unit.jumlah_karyawan.toLocaleString(
          "id-ID",
        )} pegawai ditempatkan di unit ini`}
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

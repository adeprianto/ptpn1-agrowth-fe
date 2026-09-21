"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ListChecks, Network, User, Wallet } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { PanelCard } from "@/components/shared/PanelCard";
import { ApiError } from "@/lib/api-client";
import { getRegional, type Regional } from "../../api/regional";
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

type LoadState =
  | { status: "loading" }
  | { status: "error"; code: number | null; message: string }
  | { status: "ready"; regional: Regional };

export function DetailRegional({ id }: DetailRegionalProps) {
  // Hasil disimpan bersama id-nya; kalau id berubah, otomatis dianggap loading
  const [loaded, setLoaded] = useState<{ id: string; state: LoadState } | null>(
    null,
  );
  const state: LoadState =
    loaded?.id === id ? loaded.state : { status: "loading" };

  useEffect(() => {
    const controller = new AbortController();
    getRegional(id, controller.signal)
      .then((regional) =>
        setLoaded({ id, state: { status: "ready", regional } }),
      )
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
        Memuat data regional...
      </div>
    );
  }

  if (state.status === "error") {
    const message =
      state.code === 404
        ? "Regional tidak ditemukan."
        : state.code === 403
          ? "Anda tidak memiliki akses ke regional ini."
          : `Gagal memuat data regional: ${state.message}`;

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">{message}</p>
        <Link
          href="/organisasi/regional"
          className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:underline"
        >
          Kembali ke daftar Regional
        </Link>
      </div>
    );
  }

  const { regional } = state;

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
        title={regional.nama}
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
          value={regional.jumlahKaryawan.toLocaleString("id-ID")}
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
        subtitle={`${regional.jumlahKaryawanKantor.toLocaleString(
          "id-ID",
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flag, Network, Users } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { EntityInfoCard } from "@/components/shared/EntityInforCard";
import { ApiError } from "@/lib/api-client";
import { getHeadOffice, type HeadOffice } from "../../api/headOffice";
import { EntityEmployeeTable } from "../shared/EntityEmployeeTable";

type LoadState =
  | { status: "loading" }
  | { status: "error"; code: number | null; message: string }
  | { status: "ready"; headOffice: HeadOffice };

export function DetailHeadOffice() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    getHeadOffice(controller.signal)
      .then((headOffice) => setState({ status: "ready", headOffice }))
      .catch((e: Error) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          code: e instanceof ApiError ? e.status : null,
          message: e.message,
        });
      });
    return () => controller.abort();
  }, []);

  if (state.status === "loading") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
        Memuat data Head Office...
      </div>
    );
  }

  if (state.status === "error") {
    const message =
      state.code === 403
        ? "Anda tidak memiliki akses ke data Head Office."
        : state.code === 404
          ? "Data Head Office belum ada."
          : `Gagal memuat data Head Office: ${state.message}`;

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">{message}</p>
        <Link
          href="/organisasi"
          className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:underline"
        >
          Kembali ke Organisasi
        </Link>
      </div>
    );
  }

  const { headOffice } = state;

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/organisasi" },
          { label: "Head Office" },
        ]}
      />

      <PageHeader
        title={headOffice.nama}
        description={`${headOffice.kode} · Kantor pusat PTPN 1, membawahi seluruh regional dan unit.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Karyawan Head Office"
          value={headOffice.jumlahKaryawan.toLocaleString("id-ID")}
          icon={Users}
          variant="featured"
        />
        <MetricCard
          label="Jumlah Regional"
          value={headOffice.jumlahRegional}
          icon={Flag}
        />
        <MetricCard
          label="Jumlah Unit"
          value={headOffice.jumlahUnit.toLocaleString("id-ID")}
          icon={Network}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <EntityInfoCard
          title="Informasi Head Office"
          indukOrganisasiLabel="Tingkat"
          indukOrganisasiValue="Kantor Pusat (tertinggi)"
        />
        <div className="lg:col-span-2">
          <EntityEmployeeTable
            entityId={headOffice.id}
            title="Karyawan Head Office"
            subtitle="Pegawai yang ditempatkan langsung di kantor pusat"
          />
        </div>
      </div>
    </div>
  );
}

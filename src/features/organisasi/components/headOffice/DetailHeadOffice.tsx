"use client";

import { Flag, Network, Users } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { DetailPageState } from "@/components/shared/DetailPageState";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { EntityInfoCard } from "@/components/shared/EntityInforCard";
import { useAsyncData } from "@/hooks/useAsyncData";
import { formatNumber } from "@/lib/format";
import { getHeadOffice } from "../../api/headOffice";
import { EntityEmployeeTable } from "../shared/EntityEmployeeTable";

export function DetailHeadOffice() {
  const query = useAsyncData(getHeadOffice);
  const headOffice = query.data;

  if (!headOffice) {
    return (
      <DetailPageState
        query={query}
        resource="Head Office"
        backHref="/organisasi"
        backLabel="Kembali ke Organisasi"
      />
    );
  }

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
          value={formatNumber(headOffice.jumlahKaryawan)}
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
          value={formatNumber(headOffice.jumlahUnit)}
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

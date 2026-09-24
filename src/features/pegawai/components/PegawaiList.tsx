"use client";

import { Boxes, Building2, Factory, Landmark, Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import {
  filterList,
  filterText,
  useServerDataTable,
} from "@/components/shared/data-table";
import { Alert, ButtonLink } from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { formatNumber } from "@/lib/format";
import { PegawaiTable } from "./PegawaiTable";
import {
  getEmployeeFilterOptions,
  getEmployeeList,
  getEmployeeSummary,
  type PegawaiSortKey,
} from "../api/pegawai";
import type { Pegawai } from "../model/pegawai";

export function PegawaiList() {
  const { tableState, rows, total, loading, error } = useServerDataTable<Pegawai>({
    fetcher: ({ filters, sort, direction, page, perPage }, signal) =>
      // id kolom di tabel = nama parameter sort/filter di backend
      getEmployeeList(
        {
          nik: filterText(filters.nik),
          name: filterText(filters.name),
          posisi: filterText(filters.posisi),
          regionalIds: filterList(filters.regional),
          entityIds: filterList(filters.entity),
          operasional: filterList(filters.operasional),
          jobGroupIds: filterList(filters.job_group),
          jobFunctionIds: filterList(filters.job_function),
          levelBod: filterList(filters.level),
          golonganPhdp: filterList(filters.golongan_phdp),
          personGrade: filterList(filters.person_grade),
          sort: sort as PegawaiSortKey | undefined,
          direction,
          page,
          perPage,
        },
        signal,
      ).then((res) => ({
        rows: res.rows,
        total: res.meta?.total ?? res.rows.length,
      })),
  });

  // Ringkasan + isi checklist filter cukup diambil sekali
  const { data: summary } = useAsyncData(getEmployeeSummary);
  const { data: options } = useAsyncData(getEmployeeFilterOptions);

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Pegawai" }]}
      />

      <PageHeader
        title="Pegawai"
        description="Seluruh data pegawai karyawan PTPN 1 di semua regional dan unit"
        action={
          <ButtonLink href="/dashboard/pegawai/create" size="lg" icon={Plus}>
            Tambah Pegawai
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <SummaryStatCard
          label="Total Karyawan"
          value={formatNumber(summary?.totalKaryawan)}
          icon={Boxes}
        />
        <SummaryStatCard
          label="Karyawan HO"
          value={formatNumber(summary?.totalHo)}
          icon={Landmark}
        />
        <SummaryStatCard
          label="Karyawan REG"
          value={formatNumber(summary?.totalRegional)}
          icon={Building2}
        />
        <SummaryStatCard
          label="Karyawan UNIT"
          value={formatNumber(summary?.totalUnit)}
          icon={Factory}
        />
      </div>

      {error && <Alert tone="error">Gagal memuat data pegawai: {error}</Alert>}

      <PegawaiTable
        rows={rows}
        rowCount={total}
        tableState={tableState}
        loading={loading}
        options={options}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Boxes, Building2, Factory, Landmark, Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import {
  columnFiltersToRecord,
  useDataTableState,
} from "@/components/shared/data-table";
import { PegawaiTable } from "./PegawaiTable";
import {
  getPegawaiFilterOptions,
  getPegawaiList,
  getPegawaiSummary,
  type Pegawai,
  type PegawaiFilterOptions,
  type PegawaiQuery,
  type PegawaiSortKey,
  type PegawaiSummary,
} from "../api/pegawai";

// helper kecil untuk membaca nilai filter dari state tabel
const asList = (value: unknown) => (Array.isArray(value) ? (value as string[]) : undefined);
const asText = (value: unknown) => (typeof value === "string" ? value : undefined);

export function PegawaiList() {
  const [summary, setSummary] = useState<PegawaiSummary | null>(null);
  const [options, setOptions] = useState<PegawaiFilterOptions | null>(null);

  const tableState = useDataTableState({
    defaultSorting: [{ id: "name", desc: false }],
    defaultPageSize: 10,
  });
  const { sorting, columnFilters, pagination } = tableState;

  // Hasil fetch disimpan bersama key query-nya; loading = key belum cocok.
  // Baris lama tetap tampil (redup) selama halaman/filter baru dimuat.
  const queryKey = JSON.stringify({ sorting, columnFilters, pagination });
  const [result, setResult] = useState<{
    key: string;
    rows: Pegawai[];
    total: number;
    error: string | null;
  } | null>(null);
  const loading = result?.key !== queryKey;
  const rows = result?.rows ?? [];
  const error = result?.key === queryKey ? result.error : null;

  // Ringkasan + isi checklist filter cukup diambil sekali
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getPegawaiSummary(signal)
      .then(setSummary)
      .catch((e) => {
        if (!signal.aborted) console.error(e);
      });

    getPegawaiFilterOptions(signal)
      .then(setOptions)
      .catch((e) => {
        if (!signal.aborted) console.error(e);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const key = JSON.stringify({ sorting, columnFilters, pagination });

    // id kolom di tabel = nama parameter sort di backend
    const f = columnFiltersToRecord(columnFilters);
    const query: PegawaiQuery = {
      nik: asText(f.nik),
      name: asText(f.name),
      posisi: asText(f.posisi),
      entityIds: asList(f.entity),
      operasional: asList(f.operasional),
      jobGroupIds: asList(f.job_group),
      jobFunctionIds: asList(f.job_function),
      levelBod: asList(f.level),
      golonganPhdp: asList(f.golongan_phdp),
      personGrade: asList(f.person_grade),
      sort: sorting[0]?.id as PegawaiSortKey | undefined,
      direction: sorting[0]?.desc ? "desc" : "asc",
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    };

    getPegawaiList(query, controller.signal)
      .then((res) =>
        setResult({
          key,
          rows: res.rows,
          total: res.meta?.total ?? res.rows.length,
          error: null,
        }),
      )
      .catch((e: Error) => {
        if (controller.signal.aborted) return;
        setResult({ key, rows: [], total: 0, error: e.message });
      });

    return () => controller.abort();
  }, [sorting, columnFilters, pagination]);

  const formatNumber = (n?: number) =>
    n === undefined ? "-" : n.toLocaleString("id-ID");

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pegawai" },
        ]}
      />

      <PageHeader
        title="Pegawai"
        description="Seluruh data pegawai karyawan PTPN 1 di semua regional dan unit"
        action={
          <Link
            href="/pegawai/create"
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Tambah Pegawai
          </Link>
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

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Gagal memuat data pegawai: {error}
        </div>
      )}

      <PegawaiTable
        rows={rows}
        // selama halaman baru dimuat, total lama tetap dipakai supaya pagination tidak loncat
        rowCount={result?.total ?? 0}
        tableState={tableState}
        loading={loading}
        options={options}
      />
    </div>
  );
}

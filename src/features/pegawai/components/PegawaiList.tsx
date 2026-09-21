"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Boxes, Building2, Factory, Landmark, Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import { Pagination } from "@/components/shared/Pagination";
import type { PaginationMeta } from "@/lib/http-client";
import { PegawaiFilterBar } from "./PegawaiFilterBar";
import { PegawaiTable } from "./PegawaiTable";
import { getPegawaiList, getPegawaiSummary } from "../api/pegawai";
import {
  getEntityOptions,
  type EntityOption,
} from "@/features/organisasi/api/entityOptions";
import type { EmployeeResource, EmployeeSummary } from "@/types/api/employee";

const PAGE_SIZE = 20;

export function PegawaiList() {
  const [summary, setSummary] = useState<EmployeeSummary | null>(null);
  const [penempatanOptions, setPenempatanOptions] = useState<EntityOption[]>([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [penempatan, setPenempatan] = useState("all");
  const [level, setLevel] = useState("all");
  const [page, setPage] = useState(1);

  // Hasil fetch disimpan bersama key query-nya; loading = key belum cocok.
  // Baris lama tetap tampil (redup) selama halaman/filter baru dimuat.
  const queryKey = [debouncedSearch, penempatan, level, page].join("|");
  const [result, setResult] = useState<{
    key: string;
    rows: EmployeeResource[];
    meta: PaginationMeta | null;
    error: string | null;
  } | null>(null);
  const loading = result?.key !== queryKey;
  const rows = result?.rows ?? [];
  const meta = result?.meta ?? null;
  const error = result?.key === queryKey ? result.error : null;

  // Tunda pencarian 400ms supaya tidak hit API di setiap ketikan
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Ringkasan + opsi penempatan cukup diambil sekali
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getPegawaiSummary(signal)
      .then(setSummary)
      .catch((e: unknown) => {
        if (!signal.aborted) console.error(e);
      });

    getEntityOptions(signal)
      .then(setPenempatanOptions)
      .catch((e: unknown) => {
        if (!signal.aborted) console.error(e);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const key = [debouncedSearch, penempatan, level, page].join("|");
    const pick = (v: string) => (v === "all" ? undefined : v);

    getPegawaiList(
      {
        search: debouncedSearch,
        entity_id: pick(penempatan),
        level_bod: pick(level),
        page,
        per_page: PAGE_SIZE,
      },
      controller.signal,
    )
      .then((res) =>
        setResult({ key, rows: res.rows, meta: res.meta ?? null, error: null }),
      )
      .catch((e: Error) => {
        if (controller.signal.aborted) return;
        setResult({ key, rows: [], meta: null, error: e.message });
      });

    return () => controller.abort();
  }, [debouncedSearch, penempatan, level, page]);

  // Ganti filter selalu balik ke halaman 1
  const withPageReset = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

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
          value={formatNumber(summary?.total_karyawan)}
          icon={Boxes}
        />
        <SummaryStatCard
          label="Karyawan HO"
          value={formatNumber(summary?.total_head_office)}
          icon={Landmark}
        />
        <SummaryStatCard
          label="Karyawan REG"
          value={formatNumber(summary?.total_regional)}
          icon={Building2}
        />
        <SummaryStatCard
          label="Karyawan UNIT"
          value={formatNumber(summary?.total_unit)}
          icon={Factory}
        />
      </div>

      <PegawaiFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        penempatanOptions={penempatanOptions}
        penempatanValue={penempatan}
        onPenempatanChange={withPageReset(setPenempatan)}
        levelValue={level}
        onLevelChange={withPageReset(setLevel)}
      />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Gagal memuat data pegawai: {error}
        </div>
      )}

      <PegawaiTable rows={rows} startIndex={meta?.from ?? 1} loading={loading} />

      {meta && meta.total > 0 && (
        <Pagination
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          onPageChange={setPage}
          totalItems={meta.total}
          pageSize={meta.per_page}
        />
      )}
    </div>
  );
}

"use client";

import { Factory, LandPlot, Plus, Sprout, User } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import { Pagination } from "@/components/shared/Pagination";
import type { PaginationMeta } from "@/lib/api-client";
import { UnitFilterBar, type FilterOption } from "./UnitFilterBar";
import { UnitTable } from "./UnitTable";
import { getJenisDisplay } from "./jenisUnit";
import {
  deleteUnit,
  getUnits,
  getUnitSummary,
  type Unit,
  type UnitSummary,
} from "../../api/unit";
import { getRegionals } from "../../api/regional";
import {
  getBusinessTypes,
  getOperationalCategories,
} from "../../api/masterData";

const PAGE_SIZE = 10;

interface FilterOptions {
  regional: FilterOption[];
  jenis: FilterOption[];
  komoditas: FilterOption[];
}

export function UnitList() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<UnitSummary | null>(null);
  const [options, setOptions] = useState<FilterOptions>({
    regional: [],
    jenis: [],
    komoditas: [],
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [regional, setRegional] = useState("all");
  const [jenis, setJenis] = useState("all");
  const [komoditas, setKomoditas] = useState("all");
  const [page, setPage] = useState(1);
  // dinaikkan setelah hapus supaya list & summary di-fetch ulang
  const [refreshKey, setRefreshKey] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState<Unit | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Hasil fetch disimpan bersama key query-nya; loading = key belum cocok.
  // Baris lama tetap tampil (redup) selama halaman/filter baru dimuat.
  const queryKey = [
    debouncedSearch,
    regional,
    jenis,
    komoditas,
    page,
    refreshKey,
  ].join("|");
  const [result, setResult] = useState<{
    key: string;
    rows: Unit[];
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

  // Ringkasan + opsi filter cukup diambil sekali
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    getUnitSummary(signal)
      .then(setSummary)
      .catch((e) => {
        if (!signal.aborted) console.error(e);
      });

    Promise.all([
      getRegionals({ perPage: 100 }, signal),
      getOperationalCategories(signal),
      getBusinessTypes(signal),
    ])
      .then(([regionals, categories, businessTypes]) => {
        // Nama komoditas bisa kembar di master (mis. "Kelapa Sawit" KELAPA & SAWIT),
        // jadi yang kembar diberi kode supaya bisa dibedakan
        const nameCount = new Map<string, number>();
        businessTypes.forEach((b) =>
          nameCount.set(b.name, (nameCount.get(b.name) ?? 0) + 1),
        );

        setOptions({
          regional: regionals.rows.map((r) => ({ value: r.id, label: r.nama })),
          jenis: categories.map((c) => ({
            value: String(c.id),
            label: getJenisDisplay(c).label,
          })),
          komoditas: businessTypes.map((b) => ({
            value: String(b.id),
            label: nameCount.get(b.name)! > 1 ? `${b.name} (${b.code})` : b.name,
          })),
        });
      })
      .catch((e) => {
        if (!signal.aborted) console.error(e);
      });

    return () => controller.abort();
  }, [refreshKey]);

  useEffect(() => {
    const controller = new AbortController();
    const key = [
      debouncedSearch,
      regional,
      jenis,
      komoditas,
      page,
      refreshKey,
    ].join("|");
    const pick = (v: string) => (v === "all" ? undefined : v);

    getUnits(
      {
        search: debouncedSearch,
        regionalId: pick(regional),
        operationalCategoryId: pick(jenis),
        businessTypeId: pick(komoditas),
        page,
        perPage: PAGE_SIZE,
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
  }, [debouncedSearch, regional, jenis, komoditas, page, refreshKey]);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteUnit(deleteTarget.id);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      // mis. 409 karena unit masih punya pegawai
      setDeleteError((e as Error).message);
      setDeleteTarget(null);
    }
  }

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
          { label: "Organisasi", href: "/organisasi" },
          { label: "Unit" },
        ]}
      />

      <PageHeader
        title="Unit"
        description="Kebun dan Pabrik di seluruh wilayah PTPN 1"
        action={
          // akun Unit tidak bisa membuat unit baru (regional induknya di luar cakupannya)
          user.role === "UNIT" ? null : (
            <Link
              href="/organisasi/unit/create"
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4" />
              Tambah Unit
            </Link>
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryStatCard
          label="Total Unit"
          value={formatNumber(summary?.totalUnit)}
          icon={LandPlot}
        />
        <SummaryStatCard
          label="Kebun"
          value={formatNumber(summary?.totalKebun)}
          icon={Sprout}
        />
        <SummaryStatCard
          label="Pabrik"
          value={formatNumber(summary?.totalPabrik)}
          icon={Factory}
        />
        <SummaryStatCard
          label="Total Karyawan"
          value={formatNumber(summary?.totalKaryawan)}
          icon={User}
        />
      </div>

      <UnitFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        regionalOptions={options.regional}
        regionalValue={regional}
        onRegionalChange={withPageReset(setRegional)}
        jenisOptions={options.jenis}
        jenisValue={jenis}
        onJenisChange={withPageReset(setJenis)}
        komoditasOptions={options.komoditas}
        komoditasValue={komoditas}
        onKomoditasChange={withPageReset(setKomoditas)}
      />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Gagal memuat data unit: {error}
        </div>
      )}

      {deleteError && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span>{deleteError}</span>
          <button
            type="button"
            onClick={() => setDeleteError(null)}
            className="font-medium hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      <UnitTable
        rows={rows}
        startIndex={meta?.from ?? 1}
        loading={loading}
        onDeleteClick={(row) => {
          setDeleteError(null);
          setDeleteTarget(row);
        }}
      />

      {meta && meta.total > 0 && (
        <Pagination
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          onPageChange={setPage}
          totalItems={meta.total}
          pageSize={meta.per_page}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Hapus ${deleteTarget?.nama}?`}
        description="Unit hanya bisa dihapus kalau sudah tidak punya pegawai maupun user. Data jenis & komoditasnya ikut terhapus."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

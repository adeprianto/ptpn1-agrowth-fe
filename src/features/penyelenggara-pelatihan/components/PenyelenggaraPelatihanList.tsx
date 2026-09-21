"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { PaginationMeta } from "@/lib/api-client";
import { PenyelenggaraTable } from "./PenyelenggaraTable";
import {
  deleteOrganizer,
  getOrganizers,
  ORGANIZER_TYPE_LABEL,
  type Organizer,
  type OrganizerStatus,
  type OrganizerType,
} from "../api/organizer";

const PAGE_SIZE = 10;

const selectClass =
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export default function PenyelenggaraPelatihanList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tipe, setTipe] = useState<"all" | OrganizerType>("all");
  const [status, setStatus] = useState<"all" | OrganizerStatus>("all");
  const [page, setPage] = useState(1);
  // dinaikkan setelah hapus supaya list di-fetch ulang
  const [refreshKey, setRefreshKey] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState<Organizer | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Hasil fetch disimpan bersama key query-nya; loading = key belum cocok
  const queryKey = [debouncedSearch, tipe, status, page, refreshKey].join("|");
  const [result, setResult] = useState<{
    key: string;
    rows: Organizer[];
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

  useEffect(() => {
    const controller = new AbortController();
    const key = [debouncedSearch, tipe, status, page, refreshKey].join("|");

    getOrganizers(
      {
        search: debouncedSearch,
        type: tipe === "all" ? undefined : tipe,
        status: status === "all" ? undefined : status,
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
  }, [debouncedSearch, tipe, status, page, refreshKey]);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteOrganizer(deleteTarget.id);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      // mis. 409 karena sudah dipakai di data pelatihan
      setDeleteError((e as Error).message);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Penyelenggara" },
        ]}
      />

      <PageHeader
        title="Penyelenggara"
        description="Seluruh data penyelenggara pelatihan PTPN 1 di semua regional dan unit"
        action={
          <Link
            href="/penyelenggara-pelatihan/create"
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Tambah Penyelenggara
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, kota, atau email..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <select
          value={tipe}
          onChange={(e) => {
            setTipe(e.target.value as "all" | OrganizerType);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="all">Semua Jenis</option>
          {(
            Object.keys(ORGANIZER_TYPE_LABEL) as OrganizerType[]
          ).map((key) => (
            <option key={key} value={key}>
              {ORGANIZER_TYPE_LABEL[key]}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as "all" | OrganizerStatus);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="all">Semua Status</option>
          <option value="ACTIVE">Aktif</option>
          <option value="INACTIVE">Non-aktif</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Gagal memuat data penyelenggara: {error}
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

      <PenyelenggaraTable
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
        description="Penyelenggara yang sudah dipakai di data pelatihan tidak bisa dihapus — nonaktifkan saja lewat Edit."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

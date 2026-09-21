"use client";

import { useEffect, useState } from "react";
import { Flag, Network, Plus, User } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import { Pagination } from "@/components/shared/Pagination";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import { RegionalFilterBar } from "./RegionalFilterBar";
import { RegionalTable } from "./RegionalTable";
import {
  RegionalFormModal,
  type RegionalFormValues,
} from "./RegionalFormModal";
import {
  createRegional,
  deleteRegional,
  getRegionals,
  getRegionalSummary,
  updateRegional,
  type Regional,
  type RegionalSummary,
} from "../../api/regional";
import type { PaginationMeta } from "@/lib/api-client";

const PAGE_SIZE = 10;

export function RegionalList() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<RegionalSummary | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  // dinaikkan tiap selesai simpan/hapus supaya list & summary di-fetch ulang
  const [refreshKey, setRefreshKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Regional | null>(null);
  // dipakai sebagai `key` modal supaya state form fresh tiap dibuka
  const [formKey, setFormKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Regional | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Hasil fetch disimpan bersama key query-nya; loading = key belum cocok.
  // Baris lama tetap tampil (redup) selama halaman/pencarian baru dimuat.
  const queryKey = `${debouncedSearch}|${page}|${refreshKey}`;
  const [result, setResult] = useState<{
    key: string;
    rows: Regional[];
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
    getRegionalSummary(controller.signal)
      .then(setSummary)
      .catch((e) => {
        if (!controller.signal.aborted) console.error(e);
      });
    return () => controller.abort();
  }, [refreshKey]);

  useEffect(() => {
    const controller = new AbortController();
    const key = `${debouncedSearch}|${page}|${refreshKey}`;

    getRegionals(
      { search: debouncedSearch, page, perPage: PAGE_SIZE },
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
  }, [debouncedSearch, page, refreshKey]);

  const formatNumber = (n?: number) =>
    n === undefined ? "-" : n.toLocaleString("id-ID");

  function openForm(row: Regional | null) {
    setEditingRow(row);
    setFormOpen(true);
    setFormKey((k) => k + 1);
  }

  // Error dibiarkan naik ke modal supaya pesan validasi tampil di field-nya
  async function handleFormSubmit(values: RegionalFormValues) {
    const payload = { code: values.kode.trim(), name: values.nama.trim() };

    if (editingRow) {
      await updateRegional(editingRow.id, payload);
    } else {
      await createRegional(payload);
    }

    setFormOpen(false);
    setRefreshKey((k) => k + 1);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteRegional(deleteTarget.id);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      // mis. 409 karena masih punya unit atau pegawai
      setDeleteError((e as Error).message);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/organisasi" },
          { label: "Regional" },
        ]}
      />

      <PageHeader
        title="Regional"
        description="Struktur wilayah kerja PTPN 1 di bawah Head Office"
        action={
          // hanya akun Head Office yang boleh menambah regional
          user.role === "HO" ? (
            <button
              type="button"
              onClick={() => openForm(null)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4" />
              Tambah Regional
            </button>
          ) : null
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryStatCard
          label="Total Regional"
          value={formatNumber(summary?.totalRegional)}
          icon={Flag}
        />
        <SummaryStatCard
          label="Total Unit"
          value={formatNumber(summary?.totalUnit)}
          icon={Network}
        />
        <SummaryStatCard
          label="Total Karyawan"
          value={formatNumber(summary?.totalKaryawan)}
          icon={User}
        />
      </div>

      <RegionalFilterBar searchValue={search} onSearchChange={setSearch} />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Gagal memuat data regional: {error}
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

      <RegionalTable
        rows={rows}
        startIndex={meta?.from ?? 1}
        loading={loading}
        onEditClick={openForm}
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

      <RegionalFormModal
        key={formKey}
        open={formOpen}
        mode={editingRow ? "edit" : "create"}
        initialValues={
          editingRow
            ? { nama: editingRow.nama, kode: editingRow.kode }
            : undefined
        }
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Hapus ${deleteTarget?.nama}?`}
        description="Regional hanya bisa dihapus kalau sudah tidak punya unit, pegawai, maupun user."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

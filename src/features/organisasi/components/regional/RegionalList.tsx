"use client";

import { useCallback, useState } from "react";
import { Flag, Network, Plus, User } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { filterText, useServerDataTable } from "@/components/shared/data-table";
import { Alert, Button } from "@/components/ui";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useAuth } from "@/hooks/useAuth";
import { formatNumber } from "@/lib/format";
import { RegionalTable } from "./RegionalTable";
import { RegionalFormModal, type RegionalFormValues } from "./RegionalFormModal";
import {
  createRegional,
  deleteRegional,
  getRegionals,
  getRegionalSummary,
  updateRegional,
} from "../../api/regional";
import type { Regional } from "../../model/regional";

export function RegionalList() {
  const { user } = useAuth();
  // hanya akun Head Office yang boleh menambah, mengubah, atau menghapus regional
  const canManage = user.role === "HO";

  const [editing, setEditing] = useState<Regional | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  // dipakai sebagai `key` modal supaya isian form fresh tiap dibuka
  const [formKey, setFormKey] = useState(0);
  // dinaikkan tiap selesai simpan/hapus supaya ringkasan ikut diambil ulang
  const [dataVersion, setDataVersion] = useState(0);

  const { tableState, rows, total, loading, error, refresh, startIndex } =
    useServerDataTable<Regional>({
      fetcher: ({ filters, sort, direction, page, perPage }, signal) =>
        // id kolom di tabel = nama parameter sort/filter di backend
        getRegionals(
          { nama: filterText(filters.name), sort, direction, page, perPage },
          signal,
        ).then((res) => ({
          rows: res.rows,
          total: res.meta?.total ?? res.rows.length,
        })),
    });

  const { data: summary } = useAsyncData(getRegionalSummary, {
    deps: [dataVersion],
  });

  function reloadAll() {
    refresh();
    setDataVersion((version) => version + 1);
  }

  const openForm = useCallback((row: Regional | null) => {
    setEditing(row);
    setFormOpen(true);
    setFormKey((key) => key + 1);
  }, []);

  // Error dibiarkan naik ke modal supaya pesan validasi tampil di field-nya
  async function handleFormSubmit(values: RegionalFormValues) {
    if (editing) {
      await updateRegional(editing.id, values);
    } else {
      await createRegional(values);
    }

    setFormOpen(false);
    reloadAll();
  }

  // Gagal menghapus (mis. 409 karena masih punya unit atau pegawai) tidak
  // menyegarkan tabel maupun ringkasan — pesannya muncul di Alert di bawah.
  const hapus = useDeleteConfirm<Regional>({
    onDelete: (row) => deleteRegional(row.id),
    onSuccess: reloadAll,
  });

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
          canManage ? (
            <Button size="lg" icon={Plus} onClick={() => openForm(null)}>
              Tambah Regional
            </Button>
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

      {error && <Alert tone="error">Gagal memuat data regional: {error}</Alert>}

      {hapus.error && (
        <Alert tone="error" onDismiss={hapus.dismissError}>
          {hapus.error}
        </Alert>
      )}

      <RegionalTable
        rows={rows}
        rowCount={total}
        tableState={tableState}
        loading={loading}
        startIndex={startIndex}
        onEdit={canManage ? openForm : undefined}
        onDelete={canManage ? hapus.ask : undefined}
      />

      <RegionalFormModal
        key={formKey}
        open={formOpen}
        mode={editing ? "edit" : "create"}
        initialValues={
          editing ? { nama: editing.nama, kode: editing.kode } : undefined
        }
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={hapus.target !== null}
        title={`Hapus ${hapus.target?.nama}?`}
        description="Regional hanya bisa dihapus kalau sudah tidak punya unit, pegawai, maupun user."
        confirmLabel="Hapus"
        variant="danger"
        loading={hapus.deleting}
        onConfirm={hapus.confirm}
        onCancel={hapus.cancel}
      />
    </div>
  );
}

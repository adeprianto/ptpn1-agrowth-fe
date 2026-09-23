"use client";

import { Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  filterList,
  filterText,
  useServerDataTable,
} from "@/components/shared/data-table";
import { Alert, ButtonLink } from "@/components/ui";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { PenyelenggaraTable } from "./PenyelenggaraTable";
import { deleteVendor, getVendorList } from "../api/vendor";
import type { Penyelenggara, PenyelenggaraTipe } from "../model/penyelenggara";

export default function PenyelenggaraPelatihanList() {
  const { tableState, rows, total, loading, error, refresh, startIndex } =
    useServerDataTable<Penyelenggara>({
      fetcher: ({ filters, sort, direction, page, perPage }, signal) =>
        getVendorList(
          {
            // id kolom di tabel = nama parameter sort/filter di backend
            nama: filterText(filters.name),
            kota: filterText(filters.city),
            telepon: filterText(filters.phone),
            tipe: filterList(filters.classification) as
              | PenyelenggaraTipe[]
              | undefined,
            status: filterList(filters.status),
            sort,
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

  // Gagal menghapus (mis. 409 karena masih dipakai program pelatihan) tidak
  // menyegarkan tabel — pesannya muncul di Alert di bawah.
  const hapus = useDeleteConfirm<Penyelenggara>({
    onDelete: (row) => deleteVendor(row.id),
    onSuccess: refresh,
  });

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
          <ButtonLink href="/penyelenggara-pelatihan/create" size="lg" icon={Plus}>
            Tambah Penyelenggara
          </ButtonLink>
        }
      />

      {error && <Alert tone="error">Gagal memuat data penyelenggara: {error}</Alert>}

      {hapus.error && (
        <Alert tone="error" onDismiss={hapus.dismissError}>
          {hapus.error}
        </Alert>
      )}

      <PenyelenggaraTable
        rows={rows}
        rowCount={total}
        tableState={tableState}
        loading={loading}
        startIndex={startIndex}
        onDelete={hapus.ask}
      />

      <ConfirmDialog
        open={hapus.target !== null}
        title={`Hapus ${hapus.target?.nama}?`}
        description="Penyelenggara yang masih dipakai program pelatihan tidak bisa dihapus."
        confirmLabel="Hapus"
        variant="danger"
        loading={hapus.deleting}
        onConfirm={hapus.confirm}
        onCancel={hapus.cancel}
      />
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
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
import { PenyelenggaraTable } from "./PenyelenggaraTable";
import { deletePenyelenggara, getPenyelenggaraList } from "../api/vendor";
import type { Penyelenggara, PenyelenggaraTipe } from "../model/penyelenggara";

export default function PenyelenggaraPelatihanList() {
  const [deleteTarget, setDeleteTarget] = useState<Penyelenggara | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { tableState, rows, total, loading, error, refresh, startIndex } =
    useServerDataTable<Penyelenggara>({
      defaultSorting: [{ id: "search", desc: false }],
      fetcher: ({ filters, page, perPage }, signal) =>
        getPenyelenggaraList(
          {
            search: filterText(filters.search),
            tipe: filterList(filters.classification)?.[0] as
              | PenyelenggaraTipe
              | undefined,
            page,
            perPage,
          },
          signal,
        ).then((res) => ({
          rows: res.rows,
          total: res.meta?.total ?? res.rows.length,
        })),
    });

  const askDelete = useCallback((row: Penyelenggara) => {
    setDeleteError(null);
    setDeleteTarget(row);
  }, []);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    try {
      await deletePenyelenggara(deleteTarget.id);
      setDeleteTarget(null);
      refresh();
    } catch (caught) {
      // mis. 409 karena masih dipakai program pelatihan
      setDeleteError((caught as Error).message);
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
          <ButtonLink href="/penyelenggara-pelatihan/create" size="lg" icon={Plus}>
            Tambah Penyelenggara
          </ButtonLink>
        }
      />

      {error && <Alert tone="error">Gagal memuat data penyelenggara: {error}</Alert>}

      {deleteError && (
        <Alert tone="error" onDismiss={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}

      <PenyelenggaraTable
        rows={rows}
        rowCount={total}
        tableState={tableState}
        loading={loading}
        startIndex={startIndex}
        onDelete={askDelete}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Hapus ${deleteTarget?.nama}?`}
        description="Penyelenggara yang masih dipakai program pelatihan tidak bisa dihapus."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

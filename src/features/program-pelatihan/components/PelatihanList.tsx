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
import { useAsyncData } from "@/hooks/useAsyncData";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import type {
  TrainingCompetencyType,
  TrainingHrDevelopmentType,
  TrainingLearningSector,
} from "@/types/api/training";
import { PelatihanTable } from "./PelatihanTable";
import {
  deleteTraining,
  getTrainingList,
  getTrainingTags,
} from "../api/pelatihan";
import type { Pelatihan } from "../model/pelatihan";

export default function PelatihanList() {
  const { tableState, rows, total, loading, error, refresh, startIndex } =
    useServerDataTable<Pelatihan>({
      fetcher: ({ filters, sort, direction, page, perPage }, signal) =>
        getTrainingList(
          {
            // id kolom di tabel = nama parameter cari/filter/sort di backend
            nama: filterText(filters.name),
            penyelenggara: filterText(filters.vendor),
            tag: filterText(filters.tags),
            tags: filterList(filters.tags),
            jenisPsdm: filterList(filters.hr_development_type) as
              | TrainingHrDevelopmentType[]
              | undefined,
            jenisKompetensi: filterList(filters.competency_type) as
              | TrainingCompetencyType[]
              | undefined,
            bidang: filterList(filters.learning_sector) as
              | TrainingLearningSector[]
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

  // Isi checklist kolom Tag. Cukup diambil sekali: tag baru dari form pasti
  // ikut terbawa karena halaman ini dimuat ulang sepulang dari form.
  const tags = useAsyncData(getTrainingTags);

  // Gagal menghapus (mis. 409 karena pelatihan sudah punya data realisasi)
  // tidak menyegarkan tabel — pesannya muncul di Alert di bawah.
  const hapus = useDeleteConfirm<Pelatihan>({
    onDelete: (row) => deleteTraining(row.id),
    onSuccess: () => {
      refresh();
      // tag milik pelatihan itu ikut terhapus, jadi pilihannya ikut disegarkan
      tags.refresh();
    },
  });

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Program Pelatihan" },
        ]}
      />

      <PageHeader
        title="Program Pelatihan"
        description="Seluruh data program pelatihan PTPN 1 di semua regional dan unit"
        action={
          <ButtonLink href="/program-pelatihan/create" size="lg" icon={Plus}>
            Program Pelatihan
          </ButtonLink>
        }
      />

      {error && <Alert tone="error">Gagal memuat data pelatihan: {error}</Alert>}

      {hapus.error && (
        <Alert tone="error" onDismiss={hapus.dismissError}>
          {hapus.error}
        </Alert>
      )}

      <PelatihanTable
        rows={rows}
        rowCount={total}
        tableState={tableState}
        loading={loading}
        startIndex={startIndex}
        tagOptions={tags.data ?? []}
        onDelete={hapus.ask}
      />

      <ConfirmDialog
        open={hapus.target !== null}
        title={`Hapus ${hapus.target?.nama}?`}
        description="Pelatihan yang sudah punya data realisasi tidak bisa dihapus."
        confirmLabel="Hapus"
        variant="danger"
        loading={hapus.deleting}
        onConfirm={hapus.confirm}
        onCancel={hapus.cancel}
      />
    </div>
  );
}

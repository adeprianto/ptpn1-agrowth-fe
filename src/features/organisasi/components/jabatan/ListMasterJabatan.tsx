"use client";

import { useMemo, useState } from "react";
import { Layers, ListTree, Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import { ButtonLink } from "@/components/ui";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { MasterJabatanTable, positionEntityCode } from "./MasterJabatanTable";
import {
  jabatanMasterRows as initialJabatanRows,
  getEntityLabel,
  type JabatanMasterRow,
} from "@/features/organisasi/components/departemen/masterJabatanDummyData";

export function ListMasterJabatan() {
  // DUMMY — master jabatan belum ada endpoint-nya, jadi datanya di state lokal
  const [rows, setRows] = useState<JabatanMasterRow[]>(initialJabatanRows);

  // Isi checklist filter kolom diturunkan dari data yang ada
  const levelOptions = useMemo(
    () => Array.from(new Set(rows.map((row) => row.level))).sort(),
    [rows],
  );

  const entityOptions = useMemo(() => {
    const codes = new Set(rows.map(positionEntityCode).filter(Boolean));
    return Array.from(codes).map((code) => ({ code, label: getEntityLabel(code) }));
  }, [rows]);

  const totalJobFamily = new Set(rows.map((row) => row.jobFamilyCode)).size;

  // Alurnya disamakan dengan modul lain lewat `useDeleteConfirm`, walau di
  // sini penghapusannya masih di state lokal — begitu endpoint-nya ada, cukup
  // ganti isi `onDelete` dengan panggilan API-nya.
  const hapus = useDeleteConfirm<JabatanMasterRow>({
    onDelete: async (target) => {
      setRows((prev) => prev.filter((row) => row.id !== target.id));
    },
  });

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/organisasi" },
          { label: "Master Jabatan" },
        ]}
      />

      <PageHeader
        title="Master Jabatan"
        description="Daftar jabatan beserta Job Family dan posisinya di struktur organisasi"
        action={
          <ButtonLink href="/organisasi/jabatan/create" size="lg" icon={Plus}>
            Tambah Jabatan
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryStatCard label="Total Jabatan" value={rows.length} icon={ListTree} />
        <SummaryStatCard
          label="Total Job Family"
          value={totalJobFamily}
          icon={Layers}
        />
        <SummaryStatCard
          label="Total Level Terpakai"
          value={levelOptions.length}
          icon={ListTree}
        />
      </div>

      <MasterJabatanTable
        rows={rows}
        levelOptions={levelOptions}
        entityOptions={entityOptions}
        onDelete={hapus.ask}
      />

      <ConfirmDialog
        open={hapus.target !== null}
        title={`Hapus ${hapus.target?.namaJabatanLengkap}?`}
        description="Jabatan yang sudah dipakai pegawai tidak disarankan dihapus."
        confirmLabel="Hapus"
        variant="danger"
        loading={hapus.deleting}
        onConfirm={hapus.confirm}
        onCancel={hapus.cancel}
      />
    </div>
  );
}

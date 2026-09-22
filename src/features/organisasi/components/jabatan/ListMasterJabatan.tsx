"use client";

import { useCallback, useMemo, useState } from "react";
import { Layers, ListTree, Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import { ButtonLink } from "@/components/ui";
import { MasterJabatanTable, jabatanEntityCode } from "./MasterJabatanTable";
import {
  jabatanMasterRows as initialJabatanRows,
  getEntityLabel,
  type JabatanMasterRow,
} from "@/features/organisasi/components/departemen/masterJabatanDummyData";

export function ListMasterJabatan() {
  // DUMMY — master jabatan belum ada endpoint-nya, jadi datanya di state lokal
  const [rows, setRows] = useState<JabatanMasterRow[]>(initialJabatanRows);
  const [deleteTarget, setDeleteTarget] = useState<JabatanMasterRow | null>(null);

  // Isi checklist filter kolom diturunkan dari data yang ada
  const levelOptions = useMemo(
    () => Array.from(new Set(rows.map((row) => row.level))).sort(),
    [rows],
  );

  const entityOptions = useMemo(() => {
    const codes = new Set(rows.map(jabatanEntityCode).filter(Boolean));
    return Array.from(codes).map((code) => ({ code, label: getEntityLabel(code) }));
  }, [rows]);

  const totalJobFamily = new Set(rows.map((row) => row.jobFamilyCode)).size;

  const askDelete = useCallback(
    (row: JabatanMasterRow) => setDeleteTarget(row),
    [],
  );

  function handleConfirmDelete() {
    if (deleteTarget) {
      setRows((prev) => prev.filter((row) => row.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  }

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
        onDelete={askDelete}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Hapus ${deleteTarget?.namaJabatanLengkap}?`}
        description="Jabatan yang sudah dipakai pegawai tidak disarankan dihapus."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

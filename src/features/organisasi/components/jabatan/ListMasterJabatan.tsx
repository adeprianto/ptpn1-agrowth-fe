"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Layers, ListTree, Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { MasterJabatanFilterBar } from "./MasterJabatanFilterBar";
import { MasterJabatanTable } from "./MasterJabatanTable";
import {
  jabatanMasterRows as initialJabatanRows,
  getEntityLabel,
  getOrganisasiNode,
  type JabatanMasterRow,
} from "@/features/organisasi/components/departemen/masterJabatanDummyData";

export function ListMasterJabatan() {
  const [rows, setRows] = useState<JabatanMasterRow[]>(initialJabatanRows);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [entity, setEntity] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<JabatanMasterRow | null>(
    null,
  );

  const levelOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.level))).sort(),
    [rows],
  );

  const entityOptions = useMemo(() => {
    const codes = new Set(
      rows
        .map((r) => getOrganisasiNode(r.organisasiCode)?.entityCode)
        .filter((code): code is string => !!code),
    );
    return Array.from(codes).map((code) => ({
      code,
      label: getEntityLabel(code),
      isHo: code === "HO",
    }));
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const keyword = search.trim().toLowerCase();
      const matchSearch =
        keyword === "" ||
        row.namaJabatanLengkap.toLowerCase().includes(keyword) ||
        row.code.toLowerCase().includes(keyword);

      const matchLevel = level === "all" || row.level === level;

      const rowEntity = getOrganisasiNode(row.organisasiCode)?.entityCode;
      const matchEntity = entity === "all" || rowEntity === entity;

      return matchSearch && matchLevel && matchEntity;
    });
  }, [rows, search, level, entity]);

  const totalJobFamily = new Set(rows.map((r) => r.jobFamilyCode)).size;

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
          <Link
            href="/organisasi/jabatan/create"
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Tambah Jabatan
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryStatCard
          label="Total Jabatan"
          value={rows.length}
          icon={ListTree}
        />
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

      <MasterJabatanFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        levelOptions={levelOptions}
        levelValue={level}
        onLevelChange={setLevel}
        entityOptions={entityOptions}
        entityValue={entity}
        onEntityChange={setEntity}
      />

      <MasterJabatanTable rows={filteredRows} onDeleteClick={setDeleteTarget} />

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

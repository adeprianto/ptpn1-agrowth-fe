"use client";

import { useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  actionsColumn,
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  rowNumberColumn,
  toValueOptions,
  type DataTableColumnMeta,
  type TableConfig,
} from "@/components/shared/data-table";
import { Badge } from "@/components/ui";
import {
  getEntityLabel,
  getJobFamilyName,
  getOrganizationNode,
  type JabatanMasterRow,
} from "@/features/organisasi/components/departemen/masterJabatanDummyData";

const col = createDataTableColumnHelper<JabatanMasterRow>();

/** Kode entity tempat jabatan berada, lewat organisasi induknya. */
export function positionEntityCode(row: JabatanMasterRow): string {
  return getOrganizationNode(row.organisasiCode)?.entityCode ?? "";
}

interface MasterJabatanTableOptions {
  /** Isi checklist filter Level & Entity, diturunkan dari data yang ada */
  levelOptions: string[];
  entityOptions: { code: string; label: string }[];
  onDelete: (row: JabatanMasterRow) => void;
}

/**
 * Konfigurasi tabel master jabatan.
 *
 * Datanya masih dummy dan sudah lengkap di browser, jadi tabel ini dipakai
 * dalam mode client: sort, filter, dan pagination diproses TanStack Table.
 */
export function createMasterPositionTableConfig({
  levelOptions,
  entityOptions,
  onDelete,
}: MasterJabatanTableOptions): TableConfig<JabatanMasterRow> {
  const codeMeta: DataTableColumnMeta = {
    nowrap: true,
    cellClassName: "font-mono text-xs text-slate-500",
  };

  return defineTableConfig<JabatanMasterRow>({
    getRowId: (row) => String(row.id),
    tableClassName: "min-w-190",
    emptyMessage: "Tidak ada jabatan yang cocok dengan pencarian atau filter.",
    columns: col.columns([
      rowNumberColumn<JabatanMasterRow>(),
      col.accessor("code", {
        header: "Code",
        meta: { search: { placeholder: "Cari kode..." }, ...codeMeta },
      }),
      col.accessor("namaJabatanLengkap", {
        header: "Nama Jabatan",
        meta: {
          search: { placeholder: "Cari nama jabatan..." },
          cellClassName: "font-medium text-slate-800",
        },
      }),
      col.accessor("level", {
        header: "Level",
        meta: {
          filter: { options: toValueOptions(levelOptions) },
          nowrap: true,
        },
        cell: ({ getValue }) => <Badge tone="emerald">{getValue()}</Badge>,
      }),
      col.accessor((row) => getJobFamilyName(row.jobFamilyCode), {
        id: "jobFamily",
        header: "Job Family",
        meta: {
          search: { placeholder: "Cari job family..." },
          cellClassName: "text-slate-600",
        },
      }),
      col.accessor(positionEntityCode, {
        id: "entity",
        header: "Organisasi",
        meta: {
          label: "Organisasi",
          filter: {
            options: entityOptions.map((entity) => ({
              value: entity.code,
              label: entity.label,
            })),
          },
        },
        cell: ({ row }) => {
          const organisasi = getOrganizationNode(row.original.organisasiCode);

          return (
            <>
              <p className="text-slate-700">{organisasi?.name ?? "-" }</p>
              <p className="text-xs text-slate-400">
                {organisasi ? getEntityLabel(organisasi.entityCode) : "" }
              </p>
            </>
          );
        },
      }),
      actionsColumn<JabatanMasterRow>({
        ariaLabel: (row) => `Aksi untuk ${row.namaJabatanLengkap}`,
        actions: (row) => [
          {
            label: "Edit",
            icon: Pencil,
            href: `/dashboard/organisasi/jabatan/${row.id}/edit`,
          },
          {
            label: "Hapus",
            icon: Trash2,
            variant: "danger",
            onClick: () => onDelete(row),
          },
        ],
      }),
    ]),
  });
}

interface MasterJabatanTableProps extends MasterJabatanTableOptions {
  rows: JabatanMasterRow[];
}

export function MasterJabatanTable({
  rows,
  levelOptions,
  entityOptions,
  onDelete,
}: MasterJabatanTableProps) {
  const config = useMemo(
    () => createMasterPositionTableConfig({ levelOptions, entityOptions, onDelete }),
    [levelOptions, entityOptions, onDelete],
  );

  // mode client: data jabatan sudah lengkap di browser
  return <DataTable config={config} data={rows} />;
}

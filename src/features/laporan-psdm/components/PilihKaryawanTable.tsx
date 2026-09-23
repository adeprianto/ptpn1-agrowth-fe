"use client";

import { useMemo } from "react";
import {
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  filterList,
  filterText,
  rowNumberColumn,
  selectColumn,
  useServerDataTable,
} from "@/components/shared/data-table";
import { Alert } from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useAuth } from "@/hooks/useAuth";
import { orDash } from "@/lib/format";
import type { Role } from "@/types/auth";
import { ENTITY_TIPE_LABEL } from "@/features/organisasi/model/entity";
import {
  getEmployeeFilterOptions,
  getEmployeeList,
  type PegawaiSortKey,
} from "@/features/pegawai/api/pegawai";
import { levelBodLabel, type Pegawai } from "@/features/pegawai/model/pegawai";
import { participantFromEmployee, type Peserta } from "../model/laporan";

const col = createDataTableColumnHelper<Pegawai>();

/**
 * Kolom mana yang punya filter, sesuai tingkat admin yang sedang login.
 *
 * Karyawan yang tampil sudah dibatasi backend sesuai cakupan akun:
 * - Head Office -> semua karyawan, jadi Regional & Entity bisa difilter
 * - Regional    -> hanya karyawan di regionalnya, jadi Regional sudah pasti
 *                  (tanpa filter), Entity/Unit masih bisa difilter
 * - Unit        -> hanya karyawan di unitnya, jadi tidak ada yang perlu difilter
 */
const FILTER_PER_ROLE: Record<Role, { regional: boolean; entity: boolean }> = {
  HO: { regional: true, entity: true },
  REGIONAL: { regional: false, entity: true },
  UNIT: { regional: false, entity: false },
};

/** Keterangan di atas tabel untuk admin yang datanya sudah dibatasi. */
function scopeDescription(role: Role, namaKantor: string): string | null {
  if (role === "REGIONAL") return `Menampilkan karyawan di ${namaKantor}.`;
  if (role === "UNIT") return `Menampilkan karyawan di unit ${namaKantor}.`;
  return null;
}

interface PilihKaryawanTableProps {
  /** Karyawan yang sudah dicentang (dipegang oleh form) */
  peserta: Peserta[];
  /** Dipanggil dengan daftar peserta yang baru setiap kali centang berubah */
  onChange: (peserta: Peserta[]) => void;
  disabled?: boolean;
}

/**
 * Tabel direktori karyawan untuk memilih peserta pelatihan.
 *
 * Data karyawan diambil per halaman dari API, sedangkan daftar yang
 * dicentang disimpan di form — jadi pilihan tidak hilang saat pindah halaman
 * atau mengganti pencarian.
 */
export function PilihKaryawanTable({ peserta, onChange, disabled = false }: PilihKaryawanTableProps) {
  const { user } = useAuth();
  const bolehFilter = FILTER_PER_ROLE[user.role];

  const { tableState, rows, total, loading, error, startIndex } =
    useServerDataTable<Pegawai>({
      defaultSorting: [{ id: "name", desc: false }],
      // id kolom di tabel = nama parameter cari/filter/sort di backend
      fetcher: ({ filters, sort, direction, page, perPage }, signal) =>
        getEmployeeList(
          {
            nik: filterText(filters.nik),
            name: filterText(filters.name),
            posisi: filterText(filters.posisi),
            regionalIds: filterList(filters.regional),
            entityIds: filterList(filters.entity),
            sort: sort as PegawaiSortKey | undefined,
            direction,
            page,
            perPage,
          },
          signal,
        ).then((res) => ({ rows: res.rows, total: res.meta?.total ?? res.rows.length })),
    });

  // isi checklist filter kolom Regional & Entity (sudah dibatasi backend sesuai akun)
  const { data: options } = useAsyncData(getEmployeeFilterOptions);

  const config = useMemo(() => {
    const regionalOptions =
      options?.regionals.map((regional) => ({ value: regional.id, label: regional.nama })) ?? [];

    // dikelompokkan per jenis: Head Office / Regional / Unit
    const entityOptions =
      options?.entities.map((entity) => ({
        value: entity.id,
        label: entity.nama,
        group: ENTITY_TIPE_LABEL[entity.tipe],
      })) ?? [];

    const terpilih = new Set(peserta.map((item) => item.pegawaiId));

    /** Centang atau lepas satu karyawan. */
    function toggleOne(pegawai: Pegawai, checked: boolean) {
      onChange(
        checked
          ? [...peserta, participantFromEmployee(pegawai)]
          : peserta.filter((item) => item.pegawaiId !== pegawai.id),
      );
    }

    /** Centang atau lepas semua karyawan yang tampil di halaman ini. */
    function toggleCurrentPage(checked: boolean) {
      const idHalamanIni = new Set(rows.map((pegawai) => pegawai.id));

      onChange(
        checked
          ? [
              ...peserta,
              ...rows
                .filter((pegawai) => !terpilih.has(pegawai.id))
                .map(participantFromEmployee),
            ]
          : peserta.filter((item) => !idHalamanIni.has(item.pegawaiId)),
      );
    }

    return defineTableConfig<Pegawai>({
      getRowId: (row) => row.id,
      tableClassName: "min-w-280",
      density: "compact",
      emptyMessage: "Tidak ada karyawan yang cocok dengan pencarian atau filter.",
      columns: col.columns([
        selectColumn<Pegawai>({
          isSelected: (row) => terpilih.has(row.id),
          onToggle: toggleOne,
          allSelected: rows.length > 0 && rows.every((row) => terpilih.has(row.id)),
          onToggleAll: toggleCurrentPage,
          ariaLabel: (row) => `Pilih ${row.nama}`,
          disabled,
        }),
        rowNumberColumn<Pegawai>(startIndex),
        col.accessor("nik", {
          id: "nik",
          header: "NIK",
          meta: {
            search: { placeholder: "Cari NIK..." },
            nowrap: true,
            cellClassName: "font-mono text-xs text-slate-700",
          },
        }),
        col.accessor("nama", {
          id: "name",
          header: "Nama Karyawan",
          meta: {
            search: { placeholder: "Cari nama..." },
            cellClassName: "font-medium text-slate-800",
          },
        }),
        col.accessor("regional", {
          id: "regional",
          header: "Regional",
          meta: {
            filter: bolehFilter.regional ? { options: regionalOptions } : undefined,
            nowrap: true,
            cellClassName: "text-slate-700",
          },
        }),
        col.accessor("penempatanNama", {
          id: "entity",
          header: "Entity / Unit Penempatan",
          enableSorting: false,
          meta: {
            filter: bolehFilter.entity ? { options: entityOptions } : undefined,
            cellClassName: "text-slate-700",
          },
        }),
        col.accessor((row) => row.jabatan ?? "", {
          id: "posisi",
          header: "Jabatan",
          meta: {
            search: { placeholder: "Cari jabatan..." },
            cellClassName: "text-slate-700",
          },
          cell: ({ getValue }) => orDash(getValue() as string),
        }),
        col.accessor("levelBod", {
          id: "level",
          header: "BOD Level",
          meta: { nowrap: true, cellClassName: "text-slate-700" },
          cell: ({ getValue }) => levelBodLabel(getValue()),
        }),
        col.accessor((row) => row.personGrade ?? "", {
          id: "person_grade",
          header: "Person Grade",
          meta: { nowrap: true, cellClassName: "text-slate-700" },
          cell: ({ getValue }) => orDash(getValue() as string),
        }),
      ]),
    });
  }, [peserta, onChange, rows, startIndex, bolehFilter, options, disabled]);

  const keterangan = scopeDescription(user.role, user.officeName);

  return (
    <div className="space-y-3">
      {keterangan && <p className="text-sm text-slate-500">{keterangan}</p>}
      {error && <Alert tone="error">Gagal memuat data karyawan: {error}</Alert>}

      <DataTable
        config={config}
        data={rows}
        rowCount={total}
        tableState={tableState}
        loading={loading}
      />
    </div>
  );
}

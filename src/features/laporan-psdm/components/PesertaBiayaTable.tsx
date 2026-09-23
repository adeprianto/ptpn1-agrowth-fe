"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import {
  createDataTableColumnHelper,
  DataTable,
  defineTableConfig,
  rowNumberColumn,
} from "@/components/shared/data-table";
import { Input } from "@/components/ui";
import { formatRupiah, orDash } from "@/lib/format";
import {
  participantTotalCost,
  totalTransportCost,
  type BiayaPesertaField,
  type Peserta,
} from "../model/laporan";

const col = createDataTableColumnHelper<Peserta>();

interface PesertaBiayaTableProps {
  peserta: Peserta[];
  /** Biaya pelatihan per peserta dari form — sama untuk semua peserta */
  biayaPelatihan: number;
  /** Ubah satu kolom biaya milik satu peserta */
  onCostChange: (pegawaiId: string, field: BiayaPesertaField, nilai: number) => void;
  /** Keluarkan peserta dari daftar (sama dengan melepas centangnya) */
  onRemove: (pegawaiId: string) => void;
  disabled?: boolean;
}

/**
 * Tabel peserta terpilih beserta rincian biayanya. Biaya perjalanan dinas
 * (transport, per diem, penginapan) diisi langsung di tabel, per peserta.
 *
 * Catatan: `onCostChange` dan `onRemove` harus beridentitas tetap (useCallback).
 * Kalau berubah tiap render, kolom ikut dibuat ulang dan kotak isian
 * kehilangan fokus setiap kali satu angka diketik.
 */
export function PesertaBiayaTable({
  peserta,
  biayaPelatihan,
  onCostChange,
  onRemove,
  disabled = false,
}: PesertaBiayaTableProps) {
  const config = useMemo(() => {
    /** Kolom kotak isian rupiah untuk satu jenis biaya perjalanan dinas. */
    const costColumn = (field: BiayaPesertaField, header: string) =>
      col.accessor(field, {
        id: field,
        header,
        enableSorting: false,
        meta: { width: "min-w-36" },
        cell: ({ row }) => (
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            aria-label={`${header} ${row.original.nama}`}
            // 0 ditampilkan sebagai kotak kosong supaya ketikan tidak jadi "05"
            value={row.original[field] || ""}
            placeholder="0"
            disabled={disabled}
            onChange={(event) =>
              onCostChange(row.original.pegawaiId, field, Number(event.target.value) || 0)
            }
          />
        ),
      });

    return defineTableConfig<Peserta>({
      getRowId: (row) => row.pegawaiId,
      tableClassName: "min-w-360",
      density: "compact",
      showToolbar: false,
      emptyMessage: "Belum ada peserta. Centang karyawan di tabel di atas.",
      columns: col.columns([
        rowNumberColumn<Peserta>(1),
        col.accessor("nik", {
          header: "NIK",
          meta: { nowrap: true, cellClassName: "font-mono text-xs text-slate-700" },
        }),
        col.accessor("nama", {
          header: "Nama Peserta",
          meta: { cellClassName: "font-medium text-slate-800" },
        }),
        col.accessor("regional", {
          header: "Regional",
          meta: { nowrap: true, cellClassName: "text-slate-700" },
        }),
        col.accessor("penempatan", {
          header: "Entity / Unit",
          meta: { cellClassName: "text-slate-700" },
        }),
        col.accessor((row) => row.jabatan ?? "", {
          id: "jabatan",
          header: "Jabatan",
          meta: { cellClassName: "text-slate-700" },
          cell: ({ getValue }) => orDash(getValue() as string),
        }),
        col.display({
          id: "biayaPelatihan",
          header: "Biaya Pelatihan",
          meta: { align: "right", nowrap: true, cellClassName: "text-slate-700" },
          cell: () => formatRupiah(biayaPelatihan),
        }),
        costColumn("biayaTransport", "Transport"),
        costColumn("biayaPerDiem", "Per Diem"),
        costColumn("biayaPenginapan", "Penginapan"),
        // Kolom hasil hitungan sengaja memakai `col.display` (bukan `col.accessor`):
        // nilai accessor disimpan tabel per baris dan tidak dihitung ulang saat
        // `biayaPelatihan` dari form berubah, sedangkan display selalu dihitung
        // ulang setiap kali tabel tampil.
        col.display({
          id: "totalTransport",
          header: "Total Biaya Transport",
          meta: { align: "right", nowrap: true, cellClassName: "text-slate-700" },
          cell: ({ row }) => formatRupiah(totalTransportCost(row.original)),
        }),
        col.display({
          id: "total",
          header: "Total Biaya",
          meta: { align: "right", nowrap: true, cellClassName: "font-semibold text-slate-800" },
          cell: ({ row }) => formatRupiah(participantTotalCost(row.original, biayaPelatihan)),
        }),
        col.display({
          id: "hapus",
          header: "",
          meta: { align: "right", width: "w-12" },
          cell: ({ row }) => (
            <button
              type="button"
              aria-label={`Keluarkan ${row.original.nama} dari peserta`}
              disabled={disabled}
              onClick={() => onRemove(row.original.pegawaiId)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          ),
        }),
      ]),
    });
  }, [biayaPelatihan, onCostChange, onRemove, disabled]);

  const totalSemua = peserta.reduce(
    (jumlah, item) => jumlah + participantTotalCost(item, biayaPelatihan),
    0,
  );

  return (
    <div className="space-y-3">
      <DataTable config={config} data={peserta} />

      <div className="flex items-center justify-end gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm">
        <span className="text-slate-600">Total biaya seluruh peserta</span>
        <span className="text-base font-bold text-emerald-800">{formatRupiah(totalSemua)}</span>
      </div>
    </div>
  );
}

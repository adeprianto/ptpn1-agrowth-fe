"use client";

import { Eye, MapPin, Pencil, Trash2, Users } from "lucide-react";
import { RowActionMenu } from "@/components/shared/RowActionMenu";
import type { UnitListResource } from "@/types/api/unit";
import { getJenisDisplay } from "./jenisUnit";

interface UnitTableProps {
  rows: UnitListResource[];
  /** Nomor urut baris pertama (untuk kolom No di halaman > 1) */
  startIndex: number;
  loading?: boolean;
  onDeleteClick: (row: UnitListResource) => void;
}

// Warna badge per komoditas (business_types.code) — tinggal tambah baris kalau perlu
const KOMODITAS_COLOR: Record<string, string> = {
  TEH: "bg-teal-100 text-teal-700",
  KOPI: "bg-orange-100 text-orange-700",
  KAKAO: "bg-stone-100 text-stone-700",
  TEMBAKAU: "bg-lime-100 text-lime-700",
  SAWIT: "bg-yellow-100 text-yellow-700",
  KELAPA: "bg-yellow-100 text-yellow-700",
  KARET: "bg-sky-100 text-sky-700",
  TEBU: "bg-green-100 text-green-700",
};

const DEFAULT_KOMODITAS_COLOR = "bg-slate-100 text-slate-600";

export function UnitTable({
  rows,
  startIndex,
  loading = false,
  onDeleteClick,
}: UnitTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white">
      <table className="w-full min-w-200 text-left text-sm">
        <thead>
          <tr className="border-b border-slate-300 text-xs font-medium uppercase tracking-wide text-slate-400">
            <th className="px-6 py-4">No</th>
            <th className="px-6 py-4">Unit</th>
            <th className="px-6 py-4">Regional</th>
            <th className="px-6 py-4">Kategori</th>
            <th className="px-6 py-4">Komoditas</th>
            <th className="px-6 py-4">Karyawan</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className={loading ? "opacity-50" : undefined}>
          {rows.map((row, index) => {
            // Icon unit mengikuti kategori operasional pertamanya
            const primary = getJenisDisplay(row.jenis[0]);
            const PrimaryIcon = primary.icon;

            return (
              <tr
                key={row.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-800">
                    {startIndex + index}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${primary.iconBg}`}
                    >
                      <PrimaryIcon className={`h-4 w-4 ${primary.iconColor}`} />
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">{row.name}</p>
                      <p className="text-xs text-slate-400">{row.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="h-4 w-4 text-slate-300" />
                    {row.regional?.name ?? "-"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {row.jenis.length === 0 && (
                      <span className="text-slate-300">-</span>
                    )}
                    {row.jenis.map((j) => {
                      const display = getJenisDisplay(j);
                      return (
                        <span
                          key={j.id}
                          className={`rounded-full px-3 py-1 text-xs font-medium ${display.badgeClass}`}
                        >
                          {display.label}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {row.komoditas.length === 0 && (
                      <span className="text-slate-300">-</span>
                    )}
                    {row.komoditas.map((k) => (
                      <span
                        key={k.id}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          KOMODITAS_COLOR[k.code] ?? DEFAULT_KOMODITAS_COLOR
                        }`}
                      >
                        {k.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Users className="h-4 w-4 text-slate-300" />
                    {row.jumlah_karyawan.toLocaleString("id-ID")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <RowActionMenu
                      label={`Aksi untuk ${row.name}`}
                      actions={[
                        {
                          label: "Lihat Detail",
                          icon: Eye,
                          href: `/organisasi/unit/${row.id}`,
                        },
                        {
                          label: "Edit",
                          icon: Pencil,
                          href: `/organisasi/unit/${row.id}/edit`,
                        },
                        {
                          label: "Hapus",
                          icon: Trash2,
                          variant: "danger",
                          onClick: () => onDeleteClick(row),
                        },
                      ]}
                    />
                  </div>
                </td>
              </tr>
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-10 text-center text-sm text-slate-400"
              >
                {loading
                  ? "Memuat data unit..."
                  : "Tidak ada unit yang cocok dengan pencarian/filter."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

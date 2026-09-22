"use client";

import { Globe, Pencil, Trash2 } from "lucide-react";
import { RowActionMenu } from "@/components/shared/RowActionMenu";
import {
  ORGANIZER_TYPE_SHORT,
  type Organizer,
  type OrganizerType,
} from "../api/organizer";

interface PenyelenggaraTableProps {
  rows: Organizer[];
  /** Nomor urut baris pertama (untuk kolom No di halaman > 1) */
  startIndex: number;
  loading?: boolean;
  onDeleteClick: (row: Organizer) => void;
}

const typeBadgeClass: Record<OrganizerType, string> = {
  LPP: "bg-emerald-100 text-emerald-700",
  INTERNAL_PTPN: "bg-blue-100 text-blue-700",
  EKSTERNAL: "bg-amber-100 text-amber-700",
  KEMENTERIAN: "bg-violet-100 text-violet-700",
};

export function PenyelenggaraTable({
  rows,
  startIndex,
  loading = false,
  onDeleteClick,
}: PenyelenggaraTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white">
      <table className="w-full min-w-200 text-left text-sm">
        <thead>
          <tr className="border-b border-slate-300 text-xs font-medium uppercase tracking-wide text-slate-400">
            <th className="px-6 py-4">No</th>
            <th className="px-6 py-4">Nama</th>
            <th className="px-6 py-4">Jenis</th>
            <th className="px-6 py-4">Kontak</th>
            <th className="px-6 py-4">Kota</th>

            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className={loading ? "opacity-50" : undefined}>
          {rows.map((row, index) => (
            <tr key={row.id} className="border-b border-slate-50 last:border-0">
              <td className="px-6 py-4 text-slate-500">{startIndex + index}</td>
              <td className="px-6 py-4">
                <p className="font-medium text-slate-800">{row.nama}</p>
                {row.picNama && (
                  <p className="text-xs text-slate-400">
                    PIC: {row.picNama}
                    {row.picJabatan ? ` · ${row.picJabatan}` : ""}
                  </p>
                )}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-full whitespace-nowrap px-3 py-1 text-xs font-medium ${typeBadgeClass[row.tipe]}`}
                >
                  {ORGANIZER_TYPE_SHORT[row.tipe]}
                </span>
              </td>
              <td className="px-6 py-4">
                <p className="whitespace-nowrap text-slate-700">
                  {row.telepon ?? "-"}
                </p>
                <p className="text-xs text-slate-400">{row.email ?? "-"}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-slate-700">{row.kota ?? "-"}</p>
                {row.website && (
                  <a
                    href={row.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-emerald-600 hover:underline"
                  >
                    <Globe className="h-3 w-3" />
                    Website
                  </a>
                )}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`rounded-full whitespace-nowrap px-3 py-1 text-xs font-medium ${
                    row.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {row.status === "ACTIVE" ? "Aktif" : "Non-aktif"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end">
                  <RowActionMenu
                    label={`Aksi untuk ${row.nama}`}
                    actions={[
                      {
                        label: "Edit",
                        icon: Pencil,
                        href: `/penyelenggara-pelatihan/${row.id}/edit`,
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
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-10 text-center text-sm text-slate-400"
              >
                {loading
                  ? "Memuat data penyelenggara..."
                  : "Belum ada penyelenggara yang cocok dengan pencarian/filter."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

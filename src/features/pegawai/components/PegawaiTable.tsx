"use client";

import Link from "next/link";
import type { EmployeeResource } from "@/types/api/employee";

interface PegawaiTableProps {
  rows: EmployeeResource[];
  /** Nomor urut baris pertama (untuk kolom No di halaman > 1) */
  startIndex: number;
  loading?: boolean;
}

// Status dari SAP tidak cuma Aktif/Non-aktif (ada Penugasan KSO, MBT, CDT, dst),
// jadi ditampilkan apa adanya dengan warna per kelompok.
function statusBadgeClass(status: string | null) {
  const s = status?.toLowerCase() ?? "";
  if (s === "aktif" || s === "active") return "bg-emerald-100 text-emerald-700";
  if (s === "inactive" || s === "non-aktif") return "bg-rose-100 text-rose-700";
  if (s === "") return "bg-slate-100 text-slate-500";
  return "bg-amber-100 text-amber-700";
}

export function PegawaiTable({ rows, startIndex, loading = false }: PegawaiTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white">
      <table className="w-full min-w-200 text-left text-sm">
        <thead>
          <tr className="border-b border-slate-300 text-xs font-medium uppercase tracking-wide text-slate-400">
            <th className="px-6 py-4">No</th>
            <th className="px-6 py-4">Pegawai</th>
            <th className="px-6 py-4">Penempatan</th>
            <th className="px-6 py-4">Posisi</th>
            <th className="px-6 py-4">Level</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className={loading ? "opacity-50" : undefined}>
          {rows.map((row, index) => (
            <tr key={row.id} className="border-b border-slate-50 last:border-0">
              <td className="px-6 py-4">
                <p className="font-medium text-slate-800">{startIndex + index}</p>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-slate-800">{row.nama_lengkap || row.name}</p>
                  <p className="text-xs text-slate-400">{row.nik}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-slate-800">
                    {row.entity?.name ?? "-"}
                  </p>
                  {row.entity?.parent?.name && (
                    <p className="text-xs text-slate-400">
                      {row.entity.parent.name}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-slate-800">
                    {row.jabatan?.name ?? "-"}
                  </p>
                  <p className="text-xs text-slate-400">{row.jabatan?.job_group?.name ?? "-"}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="whitespace-nowrap font-medium text-slate-800">
                  {row.jabatan?.level_bod ? `BOD-${row.jabatan.level_bod}` : "-"}
                </p>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-full whitespace-nowrap px-3 py-1 text-xs font-medium ${statusBadgeClass(row.status)}`}
                >
                  {row.status ?? "-"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/pegawai/${row.id}`}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-200"
                  >
                    Detail
                  </Link>
                </div>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-10 text-center text-sm text-slate-400"
              >
                {loading
                  ? "Memuat data pegawai..."
                  : "Tidak ada pegawai yang cocok dengan pencarian/filter."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

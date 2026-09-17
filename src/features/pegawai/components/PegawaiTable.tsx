"use client";

import Link from "next/link";
import type { PegawaiRow } from "./pegawaiDummyData";

interface PegawaiTableProps {
  rows: PegawaiRow[];
}

const statusBadgeClass: Record<PegawaiRow["status"], string> = {
  Aktif: "bg-emerald-100 text-emerald-700",
  "Non-aktif": "bg-rose-100 text-rose-700",
};

export function PegawaiTable({ rows }: PegawaiTableProps) {
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
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className="border-b border-slate-50 last:border-0">
              <td className="px-6 py-4">
                <p className="font-medium text-slate-800">{index + 1}</p>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-slate-800">{row.nama}</p>
                  <p className="text-xs text-slate-400">{row.nik}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-slate-800">
                    {row.penempatanNama}
                  </p>
                  <p className="text-xs text-slate-400">
                    {row.penempatanInduk}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-slate-800">{row.jabatan}</p>
                  <p className="text-xs text-slate-400">{row.departemen}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="font-medium text-slate-800">{row.level}</p>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-full whitespace-nowrap px-3 py-1 text-xs font-medium ${statusBadgeClass[row.status]}`}
                >
                  {row.status}
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
                  <button
                    type="button"
                    className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-600"
                  >
                    Delete
                  </button>
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
                Tidak ada pegawai yang cocok dengan pencarian/filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

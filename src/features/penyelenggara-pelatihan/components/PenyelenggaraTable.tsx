"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { deleteVendor } from "@/features/penyelenggara-pelatihan/api/vendor";
import { ApiError } from "@/lib/http-client";
import type { VendorResource } from "@/types/api/vendor";

interface PenyelenggaraTableProps {
  rows: VendorResource[];
  /** Dipanggil setelah baris terhapus supaya daftar di-refetch. */
  onChanged?: () => void;
}

export function PenyelenggaraTable({ rows, onChanged }: PenyelenggaraTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus penyelenggara ini?",
    );
    if (!confirmed) return;

    setError(null);
    setDeletingId(id);

    try {
      await deleteVendor(id);
      onChanged?.();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Gagal menghapus penyelenggara. Silakan coba lagi.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
            {error}
          </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
          <tr className="border-b border-slate-300 text-xs font-medium uppercase tracking-wide text-slate-400">
            <th className="px-6 py-4">No</th>
            <th className="px-6 py-4">Nama</th>
            <th className="px-6 py-4">No. Telp</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Alamat</th>
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
                    <p className="font-medium text-slate-800">{row.name}</p>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-800">
                      {row.phone || '-'}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-800">{row.email || '-'}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-800">{row.address || '-'}</p>
                  <p className="text-xs text-slate-400">{row.city || '-'}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                      className={`rounded-full whitespace-nowrap px-3 py-1 text-xs font-medium ${
                          row.is_lpp
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-700"
                      }`}
                  >
                  {row.is_lpp ? "LPP" : "Non LPP"}
                </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                        href={`/penyelenggara-pelatihan/${row.id}`}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-200"
                    >
                      Detail
                    </Link>
                    <Link
                        href={`/penyelenggara-pelatihan/${row.id}/edit`}
                        className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
                    >
                      Edit
                    </Link>

                    {/* Updated Delete Button */}
                    <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        disabled={deletingId === row.id}
                        className="flex min-w-[70px] items-center justify-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {deletingId === row.id ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                          </>
                      ) : (
                          "Delete"
                      )}
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
                  Tidak ada penyelenggara pelatihan yang cocok dengan pencarian/filter.
                </td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pagination } from "@/components/shared/Pagination";
import type { PaginationMeta } from "@/lib/http-client";
import { getRegionalUnits } from "../../api/regional";
import type { UnitListResource } from "@/types/api/unit";
import { getJenisDisplay } from "../unit/jenisUnit";

const PAGE_SIZE = 6;

interface RegionalUnitStructureTableProps {
  regionalId: number;
}

export function RegionalUnitStructureTable({
  regionalId,
}: RegionalUnitStructureTableProps) {
  const [page, setPage] = useState(1);

  // Hasil disimpan bersama key query-nya; loading = key belum cocok
  const queryKey = `${regionalId}|${page}`;
  const [result, setResult] = useState<{
    key: string;
    rows: UnitListResource[];
    meta: PaginationMeta | null;
    error: string | null;
  } | null>(null);
  const loading = result?.key !== queryKey;
  const rows = result?.rows ?? [];
  const meta = result?.meta ?? null;
  const error = result?.key === queryKey ? result.error : null;

  useEffect(() => {
    const controller = new AbortController();
    const key = `${regionalId}|${page}`;

    getRegionalUnits(regionalId, { page, per_page: PAGE_SIZE }, controller.signal)
      .then((res) =>
        setResult({ key, rows: res.rows, meta: res.meta ?? null, error: null }),
      )
      .catch((e: Error) => {
        if (controller.signal.aborted) return;
        setResult({ key, rows: [], meta: null, error: e.message });
      });

    return () => controller.abort();
  }, [regionalId, page]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-300 bg-white p-5">
      <h3 className="text-base font-bold text-slate-900">Struktur Unit</h3>
      <p className="mt-1 text-sm text-slate-400">
        Unit kerja (kebun/pabrik) di bawah region ini.
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Gagal memuat unit: {error}
        </div>
      )}

      <div className="mt-4 flex-1 overflow-x-auto">
        <table className="w-full min-w-130 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
              <th className="py-3 pr-4">Nama Unit</th>
              <th className="py-3 pr-4">Jenis</th>
              <th className="py-3 pr-4">Karyawan</th>
              <th className="py-3 pr-4">Komoditas</th>
              <th className="py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={loading ? "opacity-50" : undefined}>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="py-3 pr-4">
                  <p className="font-medium text-slate-700">{row.name}</p>
                  <p className="text-xs text-slate-400">{row.code}</p>
                </td>
                <td className="py-3 pr-4">
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
                <td className="py-3 pr-4 text-slate-500">
                  {row.jumlah_karyawan.toLocaleString("id-ID")}
                </td>
                <td className="py-3 pr-4 text-slate-600">
                  {row.komoditas.length > 0
                    ? row.komoditas.map((k) => k.name).join(", ")
                    : "-"}
                </td>
                <td className="py-3 text-right">
                  <Link
                    href={`/organisasi/unit/${row.id}`}
                    className="text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
                  >
                    Lihat
                  </Link>
                </td>
              </tr>
            ))}

            {rows.length === 0 && !error && (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-sm text-slate-400"
                >
                  {loading
                    ? "Memuat data unit..."
                    : "Belum ada unit di bawah regional ini."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {meta && (
        <Pagination
          className="mt-4"
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          onPageChange={setPage}
          totalItems={meta.total}
          pageSize={meta.per_page}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Pagination } from "@/components/shared/Pagination";
import type { PaginationMeta } from "@/lib/http-client";
import { getPegawaiList } from "@/features/pegawai/api/pegawai";
import type { EmployeeResource } from "@/types/api/employee";

const PAGE_SIZE = 10;

// Status dari SAP tidak cuma Aktif/Non-aktif (ada Penugasan KSO, MBT, CDT, dst)
function statusBadgeClass(status: string | null) {
  const s = status?.toLowerCase() ?? "";
  if (s === "aktif" || s === "active") return "bg-emerald-100 text-emerald-700";
  if (s === "inactive" || s === "non-aktif") return "bg-rose-100 text-rose-700";
  if (s === "") return "bg-slate-100 text-slate-500";
  return "bg-amber-100 text-amber-700";
}

interface EntityEmployeeTableProps {
  /** Entity (HO/Regional/Unit) yang karyawannya ditampilkan */
  entityId: number;
  title?: string;
  subtitle?: string;
}

/** Daftar karyawan pada satu entity — dipakai di halaman detail entity */
export function EntityEmployeeTable({
  entityId,
  title = "Daftar Karyawan",
  subtitle,
}: EntityEmployeeTableProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Hasil fetch disimpan bersama key query-nya; loading = key belum cocok
  const queryKey = `${entityId}|${debouncedSearch}|${page}`;
  const [result, setResult] = useState<{
    key: string;
    rows: EmployeeResource[];
    meta: PaginationMeta | null;
    error: string | null;
  } | null>(null);
  const loading = result?.key !== queryKey;
  const rows = result?.rows ?? [];
  const meta = result?.meta ?? null;
  const error = result?.key === queryKey ? result.error : null;

  // Tunda pencarian 400ms supaya tidak hit API di setiap ketikan
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const key = `${entityId}|${debouncedSearch}|${page}`;

    getPegawaiList(
      { entity_id: entityId, search: debouncedSearch, page, per_page: PAGE_SIZE },
      controller.signal,
    )
      .then((res) =>
        setResult({ key, rows: res.rows, meta: res.meta ?? null, error: null }),
      )
      .catch((e: Error) => {
        if (controller.signal.aborted) return;
        setResult({ key, rows: [], meta: null, error: e.message });
      });

    return () => controller.abort();
  }, [entityId, debouncedSearch, page]);

  const startIndex = meta?.from ?? 1;

  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau kode SAP..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Gagal memuat daftar karyawan: {error}
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-160 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
              <th className="py-3 pr-4">No</th>
              <th className="py-3 pr-4">Pegawai</th>
              <th className="py-3 pr-4">Posisi</th>
              <th className="py-3 pr-4">Level</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={loading ? "opacity-50" : undefined}>
            {rows.map((row, index) => (
              <tr
                key={row.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="py-3 pr-4 text-slate-500">
                  {startIndex + index}
                </td>
                <td className="py-3 pr-4">
                  <p className="font-medium text-slate-700">{row.nama_lengkap || row.name}</p>
                  <p className="text-xs text-slate-400">{row.nik}</p>
                </td>
                <td className="py-3 pr-4">
                  <p className="text-slate-700">{row.jabatan?.name ?? "-"}</p>
                  <p className="text-xs text-slate-400">{row.jabatan?.job_group?.name ?? "-"}</p>
                </td>
                <td className="py-3 pr-4 whitespace-nowrap text-slate-500">
                  {row.jabatan?.level_bod ? `BOD-${row.jabatan.level_bod}` : "-"}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full whitespace-nowrap px-3 py-1 text-xs font-medium ${statusBadgeClass(row.status)}`}
                  >
                    {row.status ?? "-"}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <Link
                    href={`/pegawai/${row.id}`}
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
                  colSpan={6}
                  className="py-8 text-center text-sm text-slate-400"
                >
                  {loading
                    ? "Memuat daftar karyawan..."
                    : "Tidak ada karyawan yang cocok dengan pencarian."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.total > 0 && (
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

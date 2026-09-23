import Link from "next/link";
import type { UseAsyncDataReturn } from "@/hooks/useAsyncData";

interface DetailPageStateProps {
  /** Hasil `useAsyncData` untuk data utama halaman */
  query: Pick<UseAsyncDataReturn<unknown>, "loading" | "error" | "errorStatus">;
  /** Kata benda data yang dimuat, mis. "regional" atau "unit" */
  resource: string;
  /** Tautan kembali ke daftarnya */
  backHref: string;
  backLabel: string;
}

/**
 * Tampilan memuat dan error untuk halaman detail: membedakan 404 dan 403
 * supaya pesannya jelas, dan selalu menyediakan jalan kembali ke daftar.
 *
 * @example
 * const query = useAsyncData((signal) => getRegional(id, signal), { deps: [id] });
 *
 * if (!query.data) {
 *   return (
 *     <DetailPageState
 *       query={query}
 *       resource="regional"
 *       backHref="/organisasi/regional"
 *       backLabel="Kembali ke daftar Regional"
 *     />
 *   );
 * }
 */
export function DetailPageState({
  query,
  resource,
  backHref,
  backLabel,
}: DetailPageStateProps) {
  if (query.loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-400 sm:p-10">
        Memuat data {resource}...
      </div>
    );
  }

  const message =
    query.errorStatus === 404
      ? `Data ${resource} tidak ditemukan.`
      : query.errorStatus === 403
        ? `Anda tidak memiliki akses ke ${resource} ini.`
        : `Gagal memuat data ${resource}: ${query.error ?? "penyebab tidak diketahui"}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10">
      <p className="text-sm text-slate-500">{message}</p>
      <Link
        href={backHref}
        className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:underline"
      >
        {backLabel}
      </Link>
    </div>
  );
}

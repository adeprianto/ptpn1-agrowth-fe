"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/http-client";

interface UseAsyncDataOptions {
  /** Nilai luar yang memicu pengambilan ulang, mis. id entity terpilih */
  deps?: readonly unknown[];
  /** Tunda pengambilan selama false — untuk data yang butuh id dari fetch lain */
  enabled?: boolean;
}

export interface UseAsyncDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Status HTTP kalau errornya dari backend — untuk membedakan 403 dan 404 */
  errorStatus: number | null;
  /** Ambil ulang dengan parameter yang sama, mis. setelah simpan atau hapus */
  refresh: () => void;
}

const IDLE = {
  data: null,
  loading: false,
  error: null,
  errorStatus: null,
} as const;

/**
 * Ambil satu potong data sekali (atau tiap `deps` berubah), lengkap dengan
 * status memuat, pesan error, dan pembatalan request lewat `AbortController`.
 *
 * Untuk data tabel yang ikut sort/filter/halaman, pakai `useServerDataTable`.
 *
 * @example
 * const { data: summary } = useAsyncData(getRegionalSummary, { deps: [versi] });
 *
 * @example Menunggu id dari fetch lain
 * const { data } = useAsyncData((signal) => getDepartemenTree(entityId, signal), {
 *   deps: [entityId],
 *   enabled: Boolean(entityId),
 * });
 */
export function useAsyncData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  { deps = [], enabled = true }: UseAsyncDataOptions = {},
): UseAsyncDataReturn<T> {
  // fungsi fetch biasanya ditulis inline; identitasnya tidak boleh memicu ulang
  const fetcherRef = useRef(fetcher);
  // efek ini sengaja dideklarasikan lebih dulu supaya ref sudah berisi versi
  // terbaru sebelum efek pengambilan data di bawah dijalankan
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  // Hasil disimpan bersama key permintaannya. Selama key belum cocok, data
  // dianggap masih dimuat — jadi `loading` tidak perlu state sendiri dan
  // tidak ada setState yang dipanggil langsung di dalam efek.
  const queryKey = JSON.stringify([deps, reloadToken]);

  const [result, setResult] = useState<{
    key: string;
    data: T | null;
    error: string | null;
    errorStatus: number | null;
  } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const key = queryKey;

    fetcherRef
      .current(controller.signal)
      .then((data) => setResult({ key, data, error: null, errorStatus: null }))
      .catch((caught: Error) => {
        if (controller.signal.aborted) return;
        setResult({
          key,
          data: null,
          error: caught.message,
          errorStatus: caught instanceof ApiError ? caught.status : null,
        });
      });

    return () => controller.abort();
    // `queryKey` sudah merangkum deps dan reloadToken
  }, [queryKey, enabled]);

  // saat dimatikan, hasil lama tidak boleh ikut terbaca
  if (!enabled) return { ...IDLE, refresh };

  const matched = result?.key === queryKey;

  return {
    data: matched ? result.data : null,
    loading: !matched,
    error: matched ? result.error : null,
    errorStatus: matched ? result.errorStatus : null,
    refresh,
  };
}

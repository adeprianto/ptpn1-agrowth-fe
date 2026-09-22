"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import type { ColumnFilterValue } from "./dataTableFeatures";
import {
  columnFiltersToRecord,
  useDataTableState,
  type DataTableState,
} from "./useDataTableState";

/** Parameter yang diterima `fetcher`, sudah dalam bentuk siap kirim ke API. */
export interface ServerTableParams {
  /** Urutan aktif; biasanya hanya elemen pertama yang dipakai backend */
  sorting: SortingState;
  /** Id kolom yang di-sort, atau undefined kalau sedang tanpa urutan */
  sort?: string;
  direction: "asc" | "desc";
  /** Filter kolom sebagai objek `{ [idKolom]: nilai }` */
  filters: Record<string, unknown>;
  /** 1-indexed, sesuai parameter `page` backend */
  page: number;
  perPage: number;
}

export interface ServerTableResult<TRow> {
  rows: TRow[];
  /** Total baris setelah filter — dari `meta.total` backend */
  total: number;
}

interface UseServerDataTableOptions<TRow> {
  /**
   * Pengambil data. Identitas fungsinya tidak ikut memicu fetch ulang, jadi
   * aman ditulis inline; daftarkan pemicu tambahan lewat `deps`.
   */
  fetcher: (
    params: ServerTableParams,
    signal: AbortSignal,
  ) => Promise<ServerTableResult<TRow>>;
  defaultSorting?: SortingState;
  defaultPageSize?: number;
  /** Nilai luar yang ikut memicu fetch, mis. teks pencarian atau id entity */
  deps?: readonly unknown[];
}

export interface UseServerDataTableReturn<TRow> {
  /** Diteruskan ke `<DataTable tableState={...}>` */
  tableState: DataTableState;
  rows: TRow[];
  total: number;
  /** true selama hasil yang tampil belum sesuai dengan filter/halaman terkini */
  loading: boolean;
  error: string | null;
  /** Ambil ulang data dengan parameter yang sama — dipanggil setelah simpan/hapus */
  refresh: () => void;
  /** Nomor baris pertama di halaman ini, untuk kolom "No" */
  startIndex: number;
}

/**
 * Menyambungkan state tabel (sort, filter, halaman) ke sebuah endpoint.
 *
 * Baris lama tetap tampil redup selama halaman atau filter baru dimuat, dan
 * request yang sudah tidak relevan otomatis dibatalkan lewat `AbortController`.
 *
 * @example
 * const { tableState, rows, total, loading, error, refresh } =
 *   useServerDataTable<Unit>({
 *     defaultSorting: [{ id: "nama", desc: false }],
 *     deps: [regionalId],
 *     fetcher: ({ filters, sort, direction, page, perPage }, signal) =>
 *       getUnits(
 *         { regionalId, nama: filters.nama as string, sort, direction, page, perPage },
 *         signal,
 *       ).then((res) => ({ rows: res.rows, total: res.meta?.total ?? res.rows.length })),
 *   });
 *
 * return <DataTable config={unitTableConfig} data={rows} rowCount={total}
 *                   tableState={tableState} loading={loading} />;
 */
export function useServerDataTable<TRow>({
  fetcher,
  defaultSorting,
  defaultPageSize,
  deps = [],
}: UseServerDataTableOptions<TRow>): UseServerDataTableReturn<TRow> {
  const tableState = useDataTableState({ defaultSorting, defaultPageSize });
  const { sorting, columnFilters, pagination } = tableState;

  // Fungsi fetch biasanya ditulis inline, jadi identitasnya berubah tiap
  // render. Disimpan di ref supaya tidak ikut memicu fetch ulang.
  const fetcherRef = useRef(fetcher);
  // efek ini sengaja dideklarasikan lebih dulu supaya ref sudah berisi versi
  // terbaru sebelum efek pengambilan data di bawah dijalankan
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  // Hasil disimpan bersama key query-nya; selama key belum cocok, tabel
  // dianggap masih memuat dan baris lama tetap tampil.
  const queryKey = JSON.stringify({
    sorting,
    columnFilters,
    pagination,
    deps,
    reloadToken,
  });

  const [result, setResult] = useState<{
    key: string;
    rows: TRow[];
    total: number;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const key = queryKey;

    const params: ServerTableParams = {
      sorting,
      sort: sorting[0]?.id,
      direction: sorting[0]?.desc ? "desc" : "asc",
      filters: columnFiltersToRecord(columnFilters),
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    };

    fetcherRef
      .current(params, controller.signal)
      .then(({ rows, total }) => setResult({ key, rows, total, error: null }))
      .catch((caught: Error) => {
        if (controller.signal.aborted) return;
        setResult({ key, rows: [], total: 0, error: caught.message });
      });

    return () => controller.abort();
    // `queryKey` sudah merangkum sorting, filter, halaman, deps, dan reloadToken
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  const matched = result?.key === queryKey;

  return {
    tableState,
    rows: result?.rows ?? [],
    // total lama dipertahankan selama memuat supaya pagination tidak meloncat
    total: result?.total ?? 0,
    loading: !matched,
    error: matched ? result.error : null,
    refresh,
    startIndex: pagination.pageIndex * pagination.pageSize + 1,
  };
}

/**
 * Baca teks dari kotak cari sebuah kolom.
 *
 * @example
 * fetcher: ({ filters }, signal) =>
 *   getUnits({ search: filterText(filters.name) }, signal)
 */
export const filterText = (value: unknown): string | undefined => {
  const keyword = (value as ColumnFilterValue | undefined)?.search?.trim();
  return keyword ? keyword : undefined;
};

/**
 * Baca nilai yang dicentang di modal filter sebuah kolom.
 * Hasilnya array — kirim apa adanya, `http-client` merakitnya jadi `key[]=`.
 *
 * @example
 * fetcher: ({ filters }, signal) =>
 *   getUnits({ regionalIds: filterList(filters.regional_id) }, signal)
 */
export const filterList = (value: unknown): string[] | undefined => {
  const values = (value as ColumnFilterValue | undefined)?.values;
  return values?.length ? values : undefined;
};

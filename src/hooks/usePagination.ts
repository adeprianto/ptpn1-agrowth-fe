"use client";

import { useMemo, useState } from "react";

interface UsePaginationOptions<T> {
  data: T[];
  pageSize?: number;
}

/**
 * Buat paginate array yang SUDAH ada di client (cocok untuk Regional/Unit,
 * atau list apapun yang datanya sudah selesai di-fetch sekaligus).
 *
 * Untuk data besar yang paginate-nya harus dari API (mis. Data Pegawai
 * 4.500+ baris), JANGAN pakai hook ini — kelola `currentPage` sendiri di
 * halaman itu dan pakai komponen `<Pagination>` langsung, karena
 * `totalPages` di kasus itu datang dari response API, bukan dari array
 * lengkap di client.
 */
export function usePagination<T>({
  data,
  pageSize = 5,
}: UsePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  // Kalau data berkurang (mis. abis difilter) dan currentPage jadi kelebihan,
  // otomatis dianggap balik ke halaman terakhir yang masih valid.
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safePage, pageSize]);

  return {
    currentPage: safePage,
    totalPages,
    paginatedData,
    setCurrentPage,
    pageSize,
  };
}

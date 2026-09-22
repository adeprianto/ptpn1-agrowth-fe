"use client";

import { useCallback, useState } from "react";
import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50];

interface UseDataTableStateOptions {
  defaultSorting?: SortingState;
  defaultPageSize?: number;
}

export interface DataTableState {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  /** Kembalikan sort, filter, dan halaman ke nilai awal */
  reset: () => void;
  /** true kalau sort/filter sudah berubah dari nilai awal */
  isDirty: boolean;
}

/**
 * State tabel (sort, filter kolom, pagination) yang dipakai `DataTable`.
 *
 * Pegang state ini di halaman kalau datanya diambil dari server, supaya nilai
 * sort/filter/halaman bisa diteruskan ke API. Mengubah sort atau filter selalu
 * mengembalikan tabel ke halaman pertama.
 */
export function useDataTableState({
  defaultSorting = [],
  defaultPageSize = 10,
}: UseDataTableStateOptions = {}): DataTableState {
  const [initialSorting] = useState(defaultSorting);
  const [sorting, setSortingState] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFiltersState] = useState<ColumnFiltersState>([]);
  const [pagination, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const toFirstPage = useCallback(() => {
    setPaginationState((prev) =>
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 },
    );
  }, []);

  const setSorting = useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      setSortingState(updater);
      toFirstPage();
    },
    [toFirstPage],
  );

  const setColumnFilters = useCallback<OnChangeFn<ColumnFiltersState>>(
    (updater) => {
      setColumnFiltersState(updater);
      toFirstPage();
    },
    [toFirstPage],
  );

  const setPagination = useCallback<OnChangeFn<PaginationState>>((updater) => {
    setPaginationState(updater);
  }, []);

  const reset = useCallback(() => {
    setSortingState(initialSorting);
    setColumnFiltersState([]);
    toFirstPage();
  }, [initialSorting, toFirstPage]);

  const isDirty =
    columnFilters.length > 0 ||
    JSON.stringify(sorting) !== JSON.stringify(initialSorting);

  return {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    reset,
    isDirty,
  };
}

/** Ubah `columnFilters` jadi objek `{ [columnId]: nilai }` — praktis untuk parameter API */
export function columnFiltersToRecord(
  filters: ColumnFiltersState,
): Record<string, unknown> {
  return Object.fromEntries(filters.map((f) => [f.id, f.value]));
}

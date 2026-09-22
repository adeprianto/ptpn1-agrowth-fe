import { apiGet } from "@/lib/http-client";
import type {
  EmployeeFilterOptions,
  EmployeeResource,
  EmployeeSortKey,
  EmployeeSummary,
} from "@/types/api/employee";
import {
  toPegawai,
  toPegawaiDetail,
  toPegawaiFilterOptions,
  toPegawaiSummary,
  type PegawaiDetail,
  type PegawaiFilterOptions,
} from "../model/pegawai";

export type PegawaiSortKey = EmployeeSortKey;

/** Filter per kolom; list boleh berisi banyak nilai, teks = pencarian "mengandung". */
export interface PegawaiFilters {
  nik?: string;
  name?: string;
  posisi?: string;
  entityIds?: string[];
  operasional?: string[];
  jobGroupIds?: string[];
  jobFunctionIds?: string[];
  levelBod?: string[];
  golonganPhdp?: string[];
  personGrade?: string[];
}

export interface PegawaiQuery extends PegawaiFilters {
  /** Pencarian nama & NIK sekaligus — dipakai tabel karyawan di detail entity */
  search?: string;
  /** Satu entity saja — dipakai tabel karyawan di detail entity */
  entityId?: string;
  sort?: PegawaiSortKey;
  direction?: "asc" | "desc";
  page?: number;
  perPage?: number;
}

/** GET /api/employees */
export async function getPegawaiList(query: PegawaiQuery = {}, signal?: AbortSignal) {
  const { data, meta } = await apiGet<EmployeeResource[]>(
    "/api/employees",
    {
      search: query.search,
      nik: query.nik,
      name: query.name,
      posisi: query.posisi,
      // entityId tunggal dan entityIds (filter kolom) sama-sama jadi entity_id
      entity_id: query.entityIds?.length
        ? query.entityIds.join(",")
        : query.entityId,
      operasional: query.operasional?.join(","),
      job_group_id: query.jobGroupIds?.join(","),
      job_function_id: query.jobFunctionIds?.join(","),
      level_bod: query.levelBod?.join(","),
      golongan_phdp: query.golonganPhdp?.join(","),
      person_grade: query.personGrade?.join(","),
      sort: query.sort,
      direction: query.direction,
      page: query.page,
      per_page: query.perPage,
    },
    signal,
  );

  return { rows: data.map(toPegawai), meta };
}

/** GET /api/employees/summary */
export async function getPegawaiSummary(signal?: AbortSignal) {
  const { data } = await apiGet<EmployeeSummary>(
    "/api/employees/summary",
    undefined,
    signal,
  );

  return toPegawaiSummary(data);
}

/** GET /api/employees/filter-options — isi checklist di header kolom */
export async function getPegawaiFilterOptions(
  signal?: AbortSignal,
): Promise<PegawaiFilterOptions> {
  const { data } = await apiGet<EmployeeFilterOptions>(
    "/api/employees/filter-options",
    undefined,
    signal,
  );

  return toPegawaiFilterOptions(data);
}

/** GET /api/employees/{id} — versi lengkap, termasuk riwayat pelatihan */
export async function getPegawaiDetail(
  id: string,
  signal?: AbortSignal,
): Promise<PegawaiDetail> {
  const { data } = await apiGet<EmployeeResource>(
    `/api/employees/${id}`,
    undefined,
    signal,
  );

  return toPegawaiDetail(data);
}

import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api-client";
import type { MasterRef } from "./masterData";

// Bentuk mentah dari backend (UnitListResource)
export interface UnitApi {
  id: number;
  code: string;
  name: string;
  status: string;
  jenis: MasterRef[];
  komoditas: MasterRef[];
  regional?: { id: number; code: string; name: string } | null;
  operasional?: {
    id: number;
    code: string;
    operational_category_id: number | null;
    business_type_id: number | null;
  }[];
  jumlah_karyawan: number;
}

interface UnitSummaryApi {
  total_unit: number;
  total_kebun: number;
  total_pabrik: number;
  total_karyawan: number;
}

// Bentuk yang dipakai komponen FE
export interface Unit {
  id: string;
  kode: string;
  nama: string;
  /** Kategori operasional, mis. EST (Kebun) / FAC (Pabrik) — bisa lebih dari satu */
  jenis: MasterRef[];
  /** Business type, mis. Teh / Kopi / Karet — bisa lebih dari satu */
  komoditas: MasterRef[];
  regionalId: string | null;
  regionalNama: string | null;
  /** Pasangan jenis + komoditas per baris entity_operationals (untuk form edit) */
  operasional: { jenisId: string; komoditasId: string }[];
  jumlahKaryawan: number;
}

export interface UnitSummary {
  totalUnit: number;
  totalKebun: number;
  totalPabrik: number;
  totalKaryawan: number;
}

export function toUnit(u: UnitApi): Unit {
  return {
    id: String(u.id),
    kode: u.code,
    nama: u.name,
    jenis: u.jenis,
    komoditas: u.komoditas,
    regionalId: u.regional ? String(u.regional.id) : null,
    regionalNama: u.regional?.name ?? null,
    operasional: (u.operasional ?? []).map((o) => ({
      jenisId: o.operational_category_id ? String(o.operational_category_id) : "",
      komoditasId: o.business_type_id ? String(o.business_type_id) : "",
    })),
    jumlahKaryawan: u.jumlah_karyawan,
  };
}

export interface UnitQuery {
  search?: string;
  regionalId?: string;
  operationalCategoryId?: string;
  businessTypeId?: string;
  page?: number;
  perPage?: number;
}

// GET /api/v1/units
export async function getUnits(params: UnitQuery, signal?: AbortSignal) {
  const res = await apiGet<UnitApi[]>(
    "/units",
    {
      search: params.search,
      regional_id: params.regionalId,
      operational_category_id: params.operationalCategoryId,
      business_type_id: params.businessTypeId,
      page: params.page,
      per_page: params.perPage,
    },
    signal,
  );
  return { rows: res.data.map(toUnit), meta: res.meta };
}

// GET /api/v1/units/summary
export async function getUnitSummary(signal?: AbortSignal): Promise<UnitSummary> {
  const { data } = await apiGet<UnitSummaryApi>("/units/summary", undefined, signal);
  return {
    totalUnit: data.total_unit,
    totalKebun: data.total_kebun,
    totalPabrik: data.total_pabrik,
    totalKaryawan: data.total_karyawan,
  };
}

export interface UnitPayload {
  code: string;
  name: string;
  parent_id: string;
  operationals: {
    operational_category_id: number;
    business_type_id: number | null;
  }[];
}

// POST /api/v1/units
export async function createUnit(payload: UnitPayload) {
  const { data } = await apiPost<UnitApi>("/units", payload);
  return toUnit(data);
}

// PUT /api/v1/units/{id}
export async function updateUnit(id: string, payload: UnitPayload) {
  const { data } = await apiPut<UnitApi>(
    `/units/${encodeURIComponent(id)}`,
    payload,
  );
  return toUnit(data);
}

// DELETE /api/v1/units/{id}
export async function deleteUnit(id: string) {
  await apiDelete(`/units/${encodeURIComponent(id)}`);
}

// GET /api/v1/units/{id}
export async function getUnit(id: string, signal?: AbortSignal) {
  const { data } = await apiGet<UnitApi>(
    `/units/${encodeURIComponent(id)}`,
    undefined,
    signal,
  );
  return toUnit(data);
}

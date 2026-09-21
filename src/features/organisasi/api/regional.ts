import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api-client";
import { toUnit, type UnitApi } from "./unit";

// Bentuk mentah dari backend (RegionalResource)
interface RegionalApi {
  id: number;
  code: string;
  name: string;
  status: string;
  jumlah_unit: number;
  jumlah_karyawan: number;
  jumlah_karyawan_kantor: number;
  kepala_regional: string | null;
  parent?: { id: number; code: string; name: string; type: string } | null;
}

interface RegionalSummaryApi {
  total_regional: number;
  total_unit: number;
  total_karyawan: number;
}

// Bentuk yang dipakai komponen FE
export interface Regional {
  id: string;
  kode: string;
  nama: string;
  status: string;
  jumlahUnit: number;
  /** Regional + seluruh unit di bawahnya */
  jumlahKaryawan: number;
  /** Hanya yang ditempatkan di kantor regional */
  jumlahKaryawanKantor: number;
  kepalaRegional: string | null;
  induk: string | null;
}

export interface RegionalSummary {
  totalRegional: number;
  totalUnit: number;
  totalKaryawan: number;
}

function toRegional(r: RegionalApi): Regional {
  return {
    id: String(r.id),
    kode: r.code,
    nama: r.name,
    status: r.status,
    jumlahUnit: r.jumlah_unit,
    jumlahKaryawan: r.jumlah_karyawan,
    jumlahKaryawanKantor: r.jumlah_karyawan_kantor,
    kepalaRegional: r.kepala_regional,
    induk: r.parent?.name ?? null,
  };
}

// GET /api/v1/regionals
export async function getRegionals(
  params: { search?: string; page?: number; perPage?: number },
  signal?: AbortSignal,
) {
  const res = await apiGet<RegionalApi[]>(
    "/regionals",
    { search: params.search, page: params.page, per_page: params.perPage },
    signal,
  );
  return { rows: res.data.map(toRegional), meta: res.meta };
}

// GET /api/v1/regionals/summary
export async function getRegionalSummary(
  signal?: AbortSignal,
): Promise<RegionalSummary> {
  const { data } = await apiGet<RegionalSummaryApi>(
    "/regionals/summary",
    undefined,
    signal,
  );
  return {
    totalRegional: data.total_regional,
    totalUnit: data.total_unit,
    totalKaryawan: data.total_karyawan,
  };
}

// GET /api/v1/regionals/{id}/units — bentuk item sama dengan /units
export async function getRegionalUnits(
  regionalId: string,
  params: { page?: number; perPage?: number; search?: string },
  signal?: AbortSignal,
) {
  const res = await apiGet<UnitApi[]>(
    `/regionals/${encodeURIComponent(regionalId)}/units`,
    { page: params.page, per_page: params.perPage, search: params.search },
    signal,
  );
  return { rows: res.data.map(toUnit), meta: res.meta };
}

export interface RegionalPayload {
  code: string;
  name: string;
}

// POST /api/v1/regionals
export async function createRegional(payload: RegionalPayload) {
  const { data } = await apiPost<RegionalApi>("/regionals", payload);
  return toRegional(data);
}

// PUT /api/v1/regionals/{id}
export async function updateRegional(id: string, payload: RegionalPayload) {
  const { data } = await apiPut<RegionalApi>(
    `/regionals/${encodeURIComponent(id)}`,
    payload,
  );
  return toRegional(data);
}

// DELETE /api/v1/regionals/{id}
export async function deleteRegional(id: string) {
  await apiDelete(`/regionals/${encodeURIComponent(id)}`);
}

// GET /api/v1/regionals/{id}
export async function getRegional(id: string, signal?: AbortSignal) {
  const { data } = await apiGet<RegionalApi>(
    `/regionals/${encodeURIComponent(id)}`,
    undefined,
    signal,
  );
  return toRegional(data);
}

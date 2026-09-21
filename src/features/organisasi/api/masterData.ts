import { apiGet } from "@/lib/api-client";

/** Referensi ringkas ke baris master data (id + code + name) */
export interface MasterRef {
  id: number;
  code: string;
  name: string;
}

// Master data jumlahnya kecil, jadi diambil sekaligus untuk dropdown/filter
const ALL = { per_page: 100 };

// GET /api/v1/operational-categories
export async function getOperationalCategories(signal?: AbortSignal) {
  const { data } = await apiGet<MasterRef[]>(
    "/operational-categories",
    ALL,
    signal,
  );
  return data;
}

// GET /api/v1/business-types
export async function getBusinessTypes(signal?: AbortSignal) {
  const { data } = await apiGet<MasterRef[]>("/business-types", ALL, signal);
  return data;
}

// GET /api/v1/organization-types — tipe departemen (Direktorat, Divisi, dst)
export async function getOrganizationTypes(signal?: AbortSignal) {
  const { data } = await apiGet<MasterRef[]>("/organization-types", ALL, signal);
  return data;
}

// GET /api/v1/job-functions
export async function getJobFunctions(signal?: AbortSignal) {
  const { data } = await apiGet<MasterRef[]>("/job-functions", ALL, signal);
  return data;
}

// GET /api/v1/position-titles — hanya butuh total, jadi ambil 1 baris saja
export async function getPositionTitleCount(signal?: AbortSignal) {
  const { meta } = await apiGet<unknown[]>(
    "/position-titles",
    { per_page: 1 },
    signal,
  );
  return meta?.total ?? 0;
}

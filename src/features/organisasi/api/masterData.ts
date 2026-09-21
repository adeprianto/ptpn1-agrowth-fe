import { apiGet } from "@/lib/http-client";
import type { MasterRef } from "@/types/api/master-data";

// Master data jumlahnya kecil, jadi diambil sekaligus untuk dropdown/filter.
const ALL = { per_page: 100 };

/** GET /api/operational-categories — jenis unit (Kebun, Pabrik, dst) */
export async function getOperationalCategories(signal?: AbortSignal) {
  const { data } = await apiGet<MasterRef[]>("/api/operational-categories", ALL, signal);
  return data;
}

/** GET /api/business-types — komoditas (Teh, Kopi, Karet, dst) */
export async function getBusinessTypes(signal?: AbortSignal) {
  const { data } = await apiGet<MasterRef[]>("/api/business-types", ALL, signal);
  return data;
}

/** GET /api/organization-types — tipe departemen (Direktorat, Divisi, dst) */
export async function getOrganizationTypes(signal?: AbortSignal) {
  const { data } = await apiGet<MasterRef[]>("/api/organization-types", ALL, signal);
  return data;
}

/** GET /api/job-functions */
export async function getJobFunctions(signal?: AbortSignal) {
  const { data } = await apiGet<MasterRef[]>("/api/job-functions", ALL, signal);
  return data;
}

/** GET /api/position-titles — hanya butuh totalnya, jadi ambil 1 baris saja */
export async function getPositionTitleCount(signal?: AbortSignal) {
  const { meta } = await apiGet<unknown[]>("/api/position-titles", { per_page: 1 }, signal);
  return meta?.total ?? 0;
}

import { apiGet } from "@/lib/http-client";
import type { MasterRef } from "@/types/api/master-data";
import { toMasterItems, type MasterItem } from "../model/masterData";

// Master data jumlahnya kecil, jadi diambil sekaligus untuk dropdown/filter.
const ALL = { per_page: 100 };

async function getMasterList(path: string, signal?: AbortSignal): Promise<MasterItem[]> {
  const { data } = await apiGet<MasterRef[]>(path, ALL, signal);
  return toMasterItems(data);
}

/** GET /api/operational-categories — jenis unit (Kebun, Pabrik, dst) */
export const getOperationalCategories = (signal?: AbortSignal) =>
  getMasterList("/api/operational-categories", signal);

/** GET /api/business-types — komoditas (Teh, Kopi, Karet, dst) */
export const getBusinessTypes = (signal?: AbortSignal) =>
  getMasterList("/api/business-types", signal);

/** GET /api/organization-types — tipe departemen (Direktorat, Divisi, dst) */
export const getOrganizationTypes = (signal?: AbortSignal) =>
  getMasterList("/api/organization-types", signal);

/** GET /api/job-functions */
export const getJobFunctions = (signal?: AbortSignal) =>
  getMasterList("/api/job-functions", signal);

/** GET /api/position-titles — hanya butuh totalnya, jadi ambil 1 baris saja */
export async function getPositionTitleCount(signal?: AbortSignal) {
  const { meta } = await apiGet<unknown[]>("/api/position-titles", { per_page: 1 }, signal);
  return meta?.total ?? 0;
}

import { apiGet } from "@/lib/http-client";
import type { EmployeeResource, EmployeeSummary } from "@/types/api/employee";

export type PegawaiQuery = {
  search?: string;
  entity_id?: number | string;
  job_group_id?: number | string;
  job_function_id?: number | string;
  level_bod?: number | string;
  status?: string;
  page?: number;
  per_page?: number;
};

/** GET /api/employees */
export async function getPegawaiList(query: PegawaiQuery = {}, signal?: AbortSignal) {
  const { data, meta } = await apiGet<EmployeeResource[]>("/api/employees", query, signal);
  return { rows: data, meta };
}

/** GET /api/employees/summary */
export async function getPegawaiSummary(signal?: AbortSignal) {
  const { data } = await apiGet<EmployeeSummary>("/api/employees/summary", undefined, signal);
  return data;
}

/** GET /api/employees/{id} — versi lengkap, termasuk riwayat pelatihan */
export async function getPegawaiDetail(id: number, signal?: AbortSignal) {
  const { data } = await apiGet<EmployeeResource>(`/api/employees/${id}`, undefined, signal);
  return data;
}

import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";
import type { UnitListResource, UnitPayload, UnitSummary } from "@/types/api/unit";

export type UnitQuery = {
  search?: string;
  regional_id?: number | string;
  operational_category_id?: number | string;
  business_type_id?: number | string;
  page?: number;
  per_page?: number;
};

/** GET /api/units */
export async function getUnits(query: UnitQuery = {}, signal?: AbortSignal) {
  const { data, meta } = await apiGet<UnitListResource[]>("/api/units", query, signal);
  return { rows: data, meta };
}

/** GET /api/units/summary */
export async function getUnitSummary(signal?: AbortSignal) {
  const { data } = await apiGet<UnitSummary>("/api/units/summary", undefined, signal);
  return data;
}

/** GET /api/units/{id} */
export async function getUnit(id: number, signal?: AbortSignal) {
  const { data } = await apiGet<UnitListResource>(`/api/units/${id}`, undefined, signal);
  return data;
}

/** POST /api/units */
export async function createUnit(payload: UnitPayload) {
  const { data } = await apiPost<UnitListResource>("/api/units", payload);
  return data;
}

/** PUT /api/units/{id} */
export async function updateUnit(id: number, payload: UnitPayload) {
  const { data } = await apiPut<UnitListResource>(`/api/units/${id}`, payload);
  return data;
}

/** DELETE /api/units/{id} */
export async function deleteUnit(id: number) {
  await apiDelete(`/api/units/${id}`);
}

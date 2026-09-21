import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";
import type {
  RegionalPayload,
  RegionalResource,
  RegionalSummary,
} from "@/types/api/regional";
import type { UnitListResource } from "@/types/api/unit";

export type RegionalQuery = {
  search?: string;
  page?: number;
  per_page?: number;
};

/** GET /api/regionals */
export async function getRegionals(query: RegionalQuery = {}, signal?: AbortSignal) {
  const { data, meta } = await apiGet<RegionalResource[]>("/api/regionals", query, signal);
  return { rows: data, meta };
}

/** GET /api/regionals/summary */
export async function getRegionalSummary(signal?: AbortSignal) {
  const { data } = await apiGet<RegionalSummary>("/api/regionals/summary", undefined, signal);
  return data;
}

/** GET /api/regionals/{id} */
export async function getRegional(id: number, signal?: AbortSignal) {
  const { data } = await apiGet<RegionalResource>(`/api/regionals/${id}`, undefined, signal);
  return data;
}

/** GET /api/regionals/{id}/units — bentuk itemnya sama dengan /api/units */
export async function getRegionalUnits(
  regionalId: number,
  query: { search?: string; page?: number; per_page?: number } = {},
  signal?: AbortSignal,
) {
  const { data, meta } = await apiGet<UnitListResource[]>(
    `/api/regionals/${regionalId}/units`,
    query,
    signal,
  );
  return { rows: data, meta };
}

/** POST /api/regionals */
export async function createRegional(payload: RegionalPayload) {
  const { data } = await apiPost<RegionalResource>("/api/regionals", payload);
  return data;
}

/** PUT /api/regionals/{id} */
export async function updateRegional(id: number, payload: RegionalPayload) {
  const { data } = await apiPut<RegionalResource>(`/api/regionals/${id}`, payload);
  return data;
}

/** DELETE /api/regionals/{id} */
export async function deleteRegional(id: number) {
  await apiDelete(`/api/regionals/${id}`);
}

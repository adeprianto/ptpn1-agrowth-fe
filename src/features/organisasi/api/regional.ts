import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";
import type { RegionalResource, RegionalSummary } from "@/types/api/regional";
import type { UnitListResource } from "@/types/api/unit";
import {
  toRegional,
  toRegionalPayload,
  toRegionalSummary,
  type Regional,
  type RegionalInput,
} from "../model/regional";
import { toUnit, type Unit } from "../model/unit";

export interface RegionalQuery {
  search?: string;
  page?: number;
  perPage?: number;
}

/** GET /api/regionals */
export async function getRegionals(query: RegionalQuery = {}, signal?: AbortSignal) {
  const { data, meta } = await apiGet<RegionalResource[]>(
    "/api/regionals",
    { search: query.search, page: query.page, per_page: query.perPage },
    signal,
  );

  return { rows: data.map(toRegional), meta };
}

/** GET /api/regionals/summary */
export async function getRegionalSummary(signal?: AbortSignal) {
  const { data } = await apiGet<RegionalSummary>(
    "/api/regionals/summary",
    undefined,
    signal,
  );

  return toRegionalSummary(data);
}

/** GET /api/regionals/{id} */
export async function getRegional(id: string, signal?: AbortSignal): Promise<Regional> {
  const { data } = await apiGet<RegionalResource>(
    `/api/regionals/${id}`,
    undefined,
    signal,
  );

  return toRegional(data);
}

/** GET /api/regionals/{id}/units — bentuk itemnya sama dengan /api/units */
export async function getRegionalUnits(
  regionalId: string,
  query: { search?: string; page?: number; perPage?: number } = {},
  signal?: AbortSignal,
) {
  const { data, meta } = await apiGet<UnitListResource[]>(
    `/api/regionals/${regionalId}/units`,
    { search: query.search, page: query.page, per_page: query.perPage },
    signal,
  );

  return { rows: data.map(toUnit) as Unit[], meta };
}

/** POST /api/regionals */
export async function createRegional(input: RegionalInput) {
  const { data } = await apiPost<RegionalResource>(
    "/api/regionals",
    toRegionalPayload(input),
  );

  return toRegional(data);
}

/** PUT /api/regionals/{id} */
export async function updateRegional(id: string, input: RegionalInput) {
  const { data } = await apiPut<RegionalResource>(
    `/api/regionals/${id}`,
    toRegionalPayload(input),
  );

  return toRegional(data);
}

/** DELETE /api/regionals/{id} */
export async function deleteRegional(id: string) {
  await apiDelete(`/api/regionals/${id}`);
}

import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";
import type { UnitListResource, UnitSummary } from "@/types/api/unit";
import {
  toUnit,
  toUnitPayload,
  toUnitSummary,
  type Unit,
  type UnitInput,
} from "../model/unit";

export interface UnitQuery {
  /** Pencarian gabungan nama + kode */
  search?: string;
  /** Kotak cari per kolom */
  nama?: string;
  kode?: string;
  regional?: string;
  /** Daftar centang — boleh lebih dari satu nilai */
  regionalIds?: string[];
  jenisIds?: string[];
  komoditasIds?: string[];
  sort?: string;
  direction?: "asc" | "desc";
  page?: number;
  perPage?: number;
}

/** GET /api/units */
export async function getUnits(query: UnitQuery = {}, signal?: AbortSignal) {
  const { data, meta } = await apiGet<UnitListResource[]>(
    "/api/units",
    {
      search: query.search,
      name: query.nama,
      code: query.kode,
      regional: query.regional,
      regional_id: query.regionalIds,
      operational_category_id: query.jenisIds,
      business_type_id: query.komoditasIds,
      sort: query.sort,
      direction: query.direction,
      page: query.page,
      per_page: query.perPage,
    },
    signal,
  );

  return { rows: data.map(toUnit), meta };
}

/** GET /api/units/summary */
export async function getUnitSummary(signal?: AbortSignal) {
  const { data } = await apiGet<UnitSummary>("/api/units/summary", undefined, signal);
  return toUnitSummary(data);
}

/** GET /api/units/{id} */
export async function getUnit(id: string, signal?: AbortSignal): Promise<Unit> {
  const { data } = await apiGet<UnitListResource>(`/api/units/${id}`, undefined, signal);
  return toUnit(data);
}

/** POST /api/units */
export async function createUnit(input: UnitInput) {
  const { data } = await apiPost<UnitListResource>("/api/units", toUnitPayload(input));
  return toUnit(data);
}

/** PUT /api/units/{id} */
export async function updateUnit(id: string, input: UnitInput) {
  const { data } = await apiPut<UnitListResource>(
    `/api/units/${id}`,
    toUnitPayload(input),
  );

  return toUnit(data);
}

/** DELETE /api/units/{id} */
export async function deleteUnit(id: string) {
  await apiDelete(`/api/units/${id}`);
}

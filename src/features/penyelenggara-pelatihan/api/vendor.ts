import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";
import type { VendorResource, VendorType } from "@/types/api/vendor";
import {
  toPenyelenggara,
  toPenyelenggaraPayload,
  type Penyelenggara,
  type PenyelenggaraInput,
} from "../model/penyelenggara";

export interface PenyelenggaraQuery {
  search?: string;
  tipe?: VendorType;
  isLpp?: boolean;
  page?: number;
  perPage?: number;
}

/** GET /api/vendors */
export async function getPenyelenggaraList(
  query: PenyelenggaraQuery = {},
  signal?: AbortSignal,
) {
  const { data, meta } = await apiGet<VendorResource[]>(
    "/api/vendors",
    {
      search: query.search,
      classification: query.tipe,
      is_lpp: query.isLpp,
      page: query.page,
      per_page: query.perPage,
    },
    signal,
  );

  return { rows: data.map(toPenyelenggara), meta };
}

/** GET /api/vendors/{id} */
export async function getPenyelenggara(
  id: string,
  signal?: AbortSignal,
): Promise<Penyelenggara> {
  const { data } = await apiGet<VendorResource>(`/api/vendors/${id}`, undefined, signal);
  return toPenyelenggara(data);
}

/** POST /api/vendors */
export async function createPenyelenggara(input: PenyelenggaraInput) {
  const { data } = await apiPost<VendorResource>(
    "/api/vendors",
    toPenyelenggaraPayload(input),
  );

  return toPenyelenggara(data);
}

/** PUT /api/vendors/{id} */
export async function updatePenyelenggara(id: string, input: PenyelenggaraInput) {
  const { data } = await apiPut<VendorResource>(
    `/api/vendors/${id}`,
    toPenyelenggaraPayload(input),
  );

  return toPenyelenggara(data);
}

/** DELETE /api/vendors/{id} */
export async function deletePenyelenggara(id: string) {
  await apiDelete(`/api/vendors/${id}`);
}

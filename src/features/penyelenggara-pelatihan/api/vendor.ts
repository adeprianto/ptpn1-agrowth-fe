import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";
import type { VendorResource, VendorType } from "@/types/api/vendor";
import {
  toVendor,
  toVendorPayload,
  type Penyelenggara,
  type PenyelenggaraInput,
} from "../model/penyelenggara";

export interface PenyelenggaraQuery {
  /** Pencarian gabungan nama + kota + email */
  search?: string;
  /** Kotak cari per kolom */
  nama?: string;
  kota?: string;
  telepon?: string;
  /** Daftar centang — boleh lebih dari satu nilai */
  tipe?: VendorType[];
  status?: string[];
  isLpp?: boolean;
  sort?: string;
  direction?: "asc" | "desc";
  page?: number;
  perPage?: number;
}

/** GET /api/vendors */
export async function getVendorList(
  query: PenyelenggaraQuery = {},
  signal?: AbortSignal,
) {
  const { data, meta } = await apiGet<VendorResource[]>(
    "/api/vendors",
    {
      search: query.search,
      name: query.nama,
      city: query.kota,
      phone: query.telepon,
      classification: query.tipe,
      status: query.status,
      is_lpp: query.isLpp,
      sort: query.sort,
      direction: query.direction,
      page: query.page,
      per_page: query.perPage,
    },
    signal,
  );

  return { rows: data.map(toVendor), meta };
}

/** GET /api/vendors/{id} */
export async function getVendor(
  id: string,
  signal?: AbortSignal,
): Promise<Penyelenggara> {
  const { data } = await apiGet<VendorResource>(`/api/vendors/${id}`, undefined, signal);
  return toVendor(data);
}

/** POST /api/vendors */
export async function createVendor(input: PenyelenggaraInput) {
  const { data } = await apiPost<VendorResource>(
    "/api/vendors",
    toVendorPayload(input),
  );

  return toVendor(data);
}

/** PUT /api/vendors/{id} */
export async function updateVendor(id: string, input: PenyelenggaraInput) {
  const { data } = await apiPut<VendorResource>(
    `/api/vendors/${id}`,
    toVendorPayload(input),
  );

  return toVendor(data);
}

/** DELETE /api/vendors/{id} */
export async function deleteVendor(id: string) {
  await apiDelete(`/api/vendors/${id}`);
}

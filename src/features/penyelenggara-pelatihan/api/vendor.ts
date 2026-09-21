import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";
import type { VendorPayload, VendorResource, VendorType } from "@/types/api/vendor";

export type VendorQuery = {
  search?: string;
  classification?: VendorType;
  is_lpp?: boolean;
  page?: number;
  per_page?: number;
};

/** GET /api/vendors */
export async function getVendors(query: VendorQuery = {}, signal?: AbortSignal) {
  const { data, meta } = await apiGet<VendorResource[]>("/api/vendors", query, signal);
  return { rows: data, meta };
}

/** GET /api/vendors/{id} */
export async function getVendor(id: number, signal?: AbortSignal) {
  const { data } = await apiGet<VendorResource>(`/api/vendors/${id}`, undefined, signal);
  return data;
}

/** POST /api/vendors */
export async function createVendor(payload: VendorPayload) {
  const { data } = await apiPost<VendorResource>("/api/vendors", payload);
  return data;
}

/** PUT /api/vendors/{id} */
export async function updateVendor(id: number, payload: VendorPayload) {
  const { data } = await apiPut<VendorResource>(`/api/vendors/${id}`, payload);
  return data;
}

/** DELETE /api/vendors/{id} */
export async function deleteVendor(id: number) {
  await apiDelete(`/api/vendors/${id}`);
}

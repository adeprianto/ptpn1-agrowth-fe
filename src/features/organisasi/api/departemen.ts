import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";
import type {
  OrganizationPayload,
  OrganizationResource,
  OrganizationTreeNode,
} from "@/types/api/organization";

/** GET /api/organizations/tree?entity_id= */
export async function getDepartemenTree(entityId: number, signal?: AbortSignal) {
  const { data } = await apiGet<OrganizationTreeNode[]>(
    "/api/organizations/tree",
    { entity_id: entityId },
    signal,
  );
  return data;
}

/** GET /api/organizations/{id} */
export async function getDepartemen(id: number, signal?: AbortSignal) {
  const { data } = await apiGet<OrganizationResource>(
    `/api/organizations/${id}`,
    undefined,
    signal,
  );
  return data;
}

/** Daftar datar departemen dalam satu entity — untuk dropdown induk */
export async function getDepartemenOptions(entityId: number, signal?: AbortSignal) {
  const { data } = await apiGet<OrganizationResource[]>(
    "/api/organizations",
    { entity_id: entityId, per_page: 300 },
    signal,
  );
  return data;
}

/** Total departemen sesuai cakupan akun — untuk kartu di hub Organisasi */
export async function getDepartemenCount(signal?: AbortSignal) {
  const { meta } = await apiGet<unknown[]>("/api/organizations", { per_page: 1 }, signal);
  return meta?.total ?? 0;
}

/** POST /api/organizations */
export async function createDepartemen(payload: OrganizationPayload) {
  const { data } = await apiPost<OrganizationResource>("/api/organizations", payload);
  return data;
}

/** PUT /api/organizations/{id} */
export async function updateDepartemen(id: number, payload: OrganizationPayload) {
  const { data } = await apiPut<OrganizationResource>(`/api/organizations/${id}`, payload);
  return data;
}

/** DELETE /api/organizations/{id} */
export async function deleteDepartemen(id: number) {
  await apiDelete(`/api/organizations/${id}`);
}

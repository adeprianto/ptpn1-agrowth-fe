import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";
import type {
  OrganizationResource,
  OrganizationTreeNode,
} from "@/types/api/organization";
import {
  toDepartemen,
  toDepartemenNode,
  toDepartemenPayload,
  type Departemen,
  type DepartemenInput,
  type DepartemenNode,
} from "../model/departemen";

/** GET /api/organizations/tree?entity_id= */
export async function getDepartemenTree(
  entityId: string,
  signal?: AbortSignal,
): Promise<DepartemenNode[]> {
  const { data } = await apiGet<OrganizationTreeNode[]>(
    "/api/organizations/tree",
    { entity_id: entityId },
    signal,
  );

  return data.map(toDepartemenNode);
}

/** GET /api/organizations/{id} */
export async function getDepartemen(
  id: string,
  signal?: AbortSignal,
): Promise<Departemen> {
  const { data } = await apiGet<OrganizationResource>(
    `/api/organizations/${id}`,
    undefined,
    signal,
  );

  return toDepartemen(data);
}

/** Daftar datar departemen dalam satu entity — untuk dropdown induk */
export async function getDepartemenOptions(entityId: string, signal?: AbortSignal) {
  const { data } = await apiGet<OrganizationResource[]>(
    "/api/organizations",
    { entity_id: entityId, per_page: 300 },
    signal,
  );

  return data.map(toDepartemen);
}

/** Total departemen sesuai cakupan akun — untuk kartu di hub Organisasi */
export async function getDepartemenCount(signal?: AbortSignal) {
  const { meta } = await apiGet<unknown[]>("/api/organizations", { per_page: 1 }, signal);
  return meta?.total ?? 0;
}

/** POST /api/organizations */
export async function createDepartemen(input: DepartemenInput) {
  const { data } = await apiPost<OrganizationResource>(
    "/api/organizations",
    toDepartemenPayload(input),
  );

  return toDepartemen(data);
}

/** PUT /api/organizations/{id} */
export async function updateDepartemen(id: string, input: DepartemenInput) {
  const { data } = await apiPut<OrganizationResource>(
    `/api/organizations/${id}`,
    toDepartemenPayload(input),
  );

  return toDepartemen(data);
}

/** DELETE /api/organizations/{id} */
export async function deleteDepartemen(id: string) {
  await apiDelete(`/api/organizations/${id}`);
}

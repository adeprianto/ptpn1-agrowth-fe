import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http-client";
import type {
  OrganizationResource,
  OrganizationTreeNode,
} from "@/types/api/organization";
import {
  toDepartment,
  toDepartmentNode,
  toDepartmentPayload,
  type Departemen,
  type DepartemenInput,
  type DepartemenNode,
} from "../model/departemen";

/** GET /api/organizations/tree?entity_id= */
export async function getDepartmentTree(
  entityId: string,
  signal?: AbortSignal,
): Promise<DepartemenNode[]> {
  const { data } = await apiGet<OrganizationTreeNode[]>(
    "/api/organizations/tree",
    { entity_id: entityId },
    signal,
  );

  return data.map(toDepartmentNode);
}

/** GET /api/organizations/{id} */
export async function getDepartment(
  id: string,
  signal?: AbortSignal,
): Promise<Departemen> {
  const { data } = await apiGet<OrganizationResource>(
    `/api/organizations/${id}`,
    undefined,
    signal,
  );

  return toDepartment(data);
}

/** Daftar datar departemen dalam satu entity — untuk dropdown induk */
export async function getDepartmentOptions(entityId: string, signal?: AbortSignal) {
  const { data } = await apiGet<OrganizationResource[]>(
    "/api/organizations",
    { entity_id: entityId, per_page: 300 },
    signal,
  );

  return data.map(toDepartment);
}

/** Total departemen sesuai cakupan akun — untuk kartu di hub Organisasi */
export async function getDepartmentCount(signal?: AbortSignal) {
  const { meta } = await apiGet<unknown[]>("/api/organizations", { per_page: 1 }, signal);
  return meta?.total ?? 0;
}

/** POST /api/organizations */
export async function createDepartment(input: DepartemenInput) {
  const { data } = await apiPost<OrganizationResource>(
    "/api/organizations",
    toDepartmentPayload(input),
  );

  return toDepartment(data);
}

/** PUT /api/organizations/{id} */
export async function updateDepartment(id: string, input: DepartemenInput) {
  const { data } = await apiPut<OrganizationResource>(
    `/api/organizations/${id}`,
    toDepartmentPayload(input),
  );

  return toDepartment(data);
}

/** DELETE /api/organizations/{id} */
export async function deleteDepartment(id: string) {
  await apiDelete(`/api/organizations/${id}`);
}

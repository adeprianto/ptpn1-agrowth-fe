import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api-client";
import type { MasterRef } from "./masterData";

// Bentuk mentah dari backend (OrganizationController@tree)
interface DepartemenTreeApi {
  id: number;
  code: string;
  name: string;
  level: number;
  organization_type: MasterRef | null;
  job_function: MasterRef | null;
  children: DepartemenTreeApi[];
}

// Bentuk mentah dari backend (OrganizationResource)
interface DepartemenApi {
  id: number;
  code: string;
  name: string;
  level?: number;
  organization_type?: MasterRef | null;
  entity?: MasterRef | null;
  job_function?: MasterRef | null;
  parent?: MasterRef | null;
}

export interface DepartemenNode {
  id: string;
  kode: string;
  nama: string;
  level: number;
  tipe: string | null;
  jobFunction: string | null;
  children: DepartemenNode[];
}

export interface Departemen {
  id: string;
  kode: string;
  nama: string;
  level: number;
  tipeId: string;
  entityId: string;
  jobFunctionId: string;
  parentId: string;
}

function toNode(d: DepartemenTreeApi): DepartemenNode {
  return {
    id: String(d.id),
    kode: d.code,
    nama: d.name,
    level: d.level,
    tipe: d.organization_type?.name ?? null,
    jobFunction: d.job_function?.name ?? null,
    children: d.children.map(toNode),
  };
}

// GET /api/v1/organizations/tree?entity_id=
export async function getDepartemenTree(
  entityId: string,
  signal?: AbortSignal,
): Promise<DepartemenNode[]> {
  const { data } = await apiGet<DepartemenTreeApi[]>(
    "/organizations/tree",
    { entity_id: entityId },
    signal,
  );
  return data.map(toNode);
}

// GET /api/v1/organizations/{id}
export async function getDepartemen(
  id: string,
  signal?: AbortSignal,
): Promise<Departemen> {
  const { data } = await apiGet<DepartemenApi>(
    `/organizations/${encodeURIComponent(id)}`,
    undefined,
    signal,
  );

  return {
    id: String(data.id),
    kode: data.code,
    nama: data.name,
    level: data.level ?? 1,
    tipeId: data.organization_type ? String(data.organization_type.id) : "",
    entityId: data.entity ? String(data.entity.id) : "",
    jobFunctionId: data.job_function ? String(data.job_function.id) : "",
    parentId: data.parent ? String(data.parent.id) : "",
  };
}

/** Daftar datar departemen dalam satu entity — dipakai untuk dropdown induk */
export async function getDepartemenOptions(
  entityId: string,
  signal?: AbortSignal,
) {
  const { data } = await apiGet<DepartemenApi[]>(
    "/organizations",
    { entity_id: entityId, per_page: 300 },
    signal,
  );
  return data.map((d) => ({ id: String(d.id), nama: d.name, kode: d.code }));
}

/** Total departemen sesuai cakupan akun — untuk kartu di hub Organisasi */
export async function getDepartemenCount(signal?: AbortSignal) {
  const { meta } = await apiGet<unknown[]>(
    "/organizations",
    { per_page: 1 },
    signal,
  );
  return meta?.total ?? 0;
}

export interface DepartemenPayload {
  code: string;
  name: string;
  level: number;
  organization_type_id: number;
  entity_id: number;
  job_function_id: number | null;
  parent_id: number | null;
}

// POST /api/v1/organizations
export async function createDepartemen(payload: DepartemenPayload) {
  await apiPost<DepartemenApi>("/organizations", payload);
}

// PUT /api/v1/organizations/{id}
export async function updateDepartemen(id: string, payload: DepartemenPayload) {
  await apiPut<DepartemenApi>(
    `/organizations/${encodeURIComponent(id)}`,
    payload,
  );
}

// DELETE /api/v1/organizations/{id}
export async function deleteDepartemen(id: string) {
  await apiDelete(`/organizations/${encodeURIComponent(id)}`);
}

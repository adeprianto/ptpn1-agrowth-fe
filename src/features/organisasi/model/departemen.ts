import type {
  OrganizationPayload,
  OrganizationResource,
  OrganizationTreeNode,
} from "@/types/api/organization";
import { toMasterItem, type MasterItem } from "./masterData";

/** Satu departemen (direktorat, divisi, bagian, dan seterusnya). */
export interface Departemen {
  id: string;
  kode: string;
  nama: string;
  level: number;
  tipe: MasterItem | null;
  jobFunction: MasterItem | null;
  entityId: string | null;
  entityNama: string | null;
  indukId: string | null;
  indukNama: string | null;
  jumlahAnak: number;
}

/** Simpul pohon departemen di dalam satu entity. */
export interface DepartemenNode {
  id: string;
  kode: string;
  nama: string;
  level: number;
  tipe: MasterItem | null;
  jobFunction: MasterItem | null;
  children: DepartemenNode[];
}

/** Isian form departemen; dipetakan ke `OrganizationPayload` sebelum dikirim. */
export interface DepartemenInput {
  kode: string;
  nama: string;
  level: number;
  tipeId: string;
  entityId: string;
  jobFunctionId: string | null;
  indukId: string | null;
}

export function toDepartemen(resource: OrganizationResource): Departemen {
  return {
    id: String(resource.id),
    kode: resource.code,
    nama: resource.name,
    level: resource.level,
    tipe: resource.organization_type ? toMasterItem(resource.organization_type) : null,
    jobFunction: resource.job_function ? toMasterItem(resource.job_function) : null,
    entityId: resource.entity ? String(resource.entity.id) : null,
    entityNama: resource.entity?.name ?? null,
    indukId: resource.parent ? String(resource.parent.id) : null,
    indukNama: resource.parent?.name ?? null,
    jumlahAnak: resource.children_count ?? 0,
  };
}

export function toDepartemenNode(node: OrganizationTreeNode): DepartemenNode {
  return {
    id: String(node.id),
    kode: node.code,
    nama: node.name,
    level: node.level,
    tipe: node.organization_type ? toMasterItem(node.organization_type) : null,
    jobFunction: node.job_function ? toMasterItem(node.job_function) : null,
    children: node.children.map(toDepartemenNode),
  };
}

export function toDepartemenPayload(input: DepartemenInput): OrganizationPayload {
  return {
    code: input.kode.trim(),
    name: input.nama.trim(),
    level: input.level,
    organization_type_id: Number(input.tipeId),
    entity_id: Number(input.entityId),
    job_function_id: input.jobFunctionId ? Number(input.jobFunctionId) : null,
    parent_id: input.indukId ? Number(input.indukId) : null,
  };
}

/** Id semua simpul yang punya anak — untuk tombol "Perluas Semua". */
export function collectExpandableIds(node: DepartemenNode): string[] {
  const ownId = node.children.length > 0 ? [node.id] : [];
  return [...ownId, ...node.children.flatMap(collectExpandableIds)];
}

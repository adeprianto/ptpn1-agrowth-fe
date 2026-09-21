import { apiGet } from "@/lib/api-client";
import type { MasterRef } from "./masterData";

export type EntityType = "HEAD_OFFICE" | "REGIONAL" | "UNIT";

// Bentuk mentah dari backend (EntityController@tree)
interface EntityTreeApi {
  id: number;
  type: EntityType;
  code: string;
  name: string;
  jenis: MasterRef[];
  jumlah_karyawan: number;
  total_karyawan: number;
  children: EntityTreeApi[];
}

// Bentuk yang dipakai komponen FE
export interface OrgNode {
  id: string;
  kode: string;
  nama: string;
  type: EntityType;
  /** Kategori operasional (untuk Unit: Kebun/Pabrik/dst) */
  jenis: MasterRef[];
  /** Karyawan di entity ini + semua entity di bawahnya */
  totalKaryawan: number;
  children: OrgNode[];
}

function toOrgNode(e: EntityTreeApi): OrgNode {
  return {
    id: String(e.id),
    kode: e.code,
    nama: e.name,
    type: e.type,
    jenis: e.jenis,
    totalKaryawan: e.total_karyawan,
    children: e.children.map(toOrgNode),
  };
}

// GET /api/v1/entities/tree — sudah di-scope backend (akun Regional dapat pohon regionalnya saja)
export async function getStrukturOrganisasi(signal?: AbortSignal) {
  const { data } = await apiGet<EntityTreeApi[]>("/entities/tree", undefined, signal);
  return data.map(toOrgNode);
}

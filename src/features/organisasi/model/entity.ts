import type {
  EntityStatus,
  EntityTreeNode,
  EntityType,
  HeadOffice,
} from "@/types/api/entity";
import { toMasterItems, type MasterItem } from "./masterData";

/** Tier organisasi sebagaimana ditampilkan di UI. */
export type EntityTipe = "HO" | "Regional" | "Unit";

export const ENTITY_TIPE_BY_TYPE: Record<EntityType, EntityTipe> = {
  HEAD_OFFICE: "HO",
  REGIONAL: "Regional",
  UNIT: "Unit",
};

export const ENTITY_TIPE_LABEL: Record<EntityTipe, string> = {
  HO: "Head Office",
  Regional: "Regional",
  Unit: "Unit",
};

/** Satu opsi dropdown penempatan: Head Office, Regional, atau Unit. */
export interface EntityOption {
  id: string;
  nama: string;
  tipe: EntityTipe;
}

/** Simpul pohon Head Office -> Regional -> Unit. */
export interface StrukturNode {
  id: string;
  parentId: string | null;
  tipe: EntityTipe;
  tipeLabel: string | null;
  kode: string;
  nama: string;
  status: EntityStatus;
  /** Kategori operasional unit (Kebun / Pabrik / dst) */
  jenis: MasterItem[];
  /** Karyawan di entity ini saja */
  jumlahKaryawan: number;
  /** Karyawan di entity ini + seluruh entity di bawahnya */
  totalKaryawan: number;
  children: StrukturNode[];
}

export interface HeadOfficeDetail {
  id: string;
  kode: string;
  nama: string;
  status: EntityStatus;
  jumlahKaryawan: number;
  jumlahRegional: number;
  jumlahUnit: number;
}

export function toStrukturNode(node: EntityTreeNode): StrukturNode {
  return {
    id: String(node.id),
    parentId: node.parent_id === null ? null : String(node.parent_id),
    tipe: ENTITY_TIPE_BY_TYPE[node.type],
    tipeLabel: node.type_label,
    kode: node.code,
    nama: node.name,
    status: node.status,
    jenis: toMasterItems(node.jenis),
    jumlahKaryawan: node.jumlah_karyawan,
    totalKaryawan: node.total_karyawan,
    children: node.children.map(toStrukturNode),
  };
}

export function toHeadOfficeDetail(resource: HeadOffice): HeadOfficeDetail {
  return {
    id: String(resource.id),
    kode: resource.code,
    nama: resource.name,
    status: resource.status,
    jumlahKaryawan: resource.jumlah_karyawan,
    jumlahRegional: resource.jumlah_regional,
    jumlahUnit: resource.jumlah_unit,
  };
}

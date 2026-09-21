import type { MasterRef } from "./master-data";

/** app/Enums/EntityType.php */
export type EntityType = "HEAD_OFFICE" | "REGIONAL" | "UNIT";

/** app/Enums/EntityStatus.php */
export type EntityStatus = "ACTIVE" | "INACTIVE";

/** Bentuk ringkas entity yang dipakai sebagai relasi (parent, entity, dst). */
export interface EntityRef {
  id: number;
  code: string;
  name: string;
  type: EntityType;
}

/** app/Http/Resources/EntityResource.php */
export interface EntityResource {
  id: number;
  parent_id: number | null;
  /** Kolom `level` di tabel entities bertipe string, mis. "1" */
  level: string;
  type: EntityType;
  type_label: string | null;
  code: string;
  name: string;
  status: EntityStatus;
  parent?: EntityRef | null;
  children_count?: number;
  children?: EntityResource[];
  created_at: string;
  updated_at: string;
}

/** EntityController@tree — simpul pohon Head Office -> Regional -> Unit. */
export interface EntityTreeNode {
  id: number;
  parent_id: number | null;
  /** Kolom `level` di tabel entities bertipe string, mis. "1" */
  level: string;
  type: EntityType;
  type_label: string | null;
  code: string;
  name: string;
  status: EntityStatus;
  /** Kategori operasional unit (Kebun / Pabrik / dst) */
  jenis: MasterRef[];
  /** Karyawan di entity ini saja */
  jumlah_karyawan: number;
  /** Karyawan di entity ini + seluruh entity di bawahnya */
  total_karyawan: number;
  children: EntityTreeNode[];
}

/** HeadOfficeController@show */
export interface HeadOffice {
  id: number;
  code: string;
  name: string;
  status: EntityStatus;
  jumlah_karyawan: number;
  jumlah_regional: number;
  jumlah_unit: number;
}

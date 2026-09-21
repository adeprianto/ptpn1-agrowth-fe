import type { EntityStatus } from "./entity";
import type { MasterRef } from "./master-data";

/** Satu baris entity_operationals: pasangan jenis + komoditas. */
export interface UnitOperational {
  id: number;
  code: string;
  operational_category_id: number | null;
  business_type_id: number | null;
}

/** app/Http/Resources/UnitListResource.php */
export interface UnitListResource {
  id: number;
  code: string;
  name: string;
  status: EntityStatus;
  /** Kategori operasional (Kebun / Pabrik), sudah tanpa duplikat */
  jenis: MasterRef[];
  /** Business type (Teh / Kopi / Karet), sudah tanpa duplikat */
  komoditas: MasterRef[];
  /** Pasangan asli per baris — dipakai form edit unit */
  operasional: UnitOperational[];
  regional?: { id: number; code: string; name: string } | null;
  jumlah_karyawan: number;
}

/** UnitController@summary */
export interface UnitSummary {
  total_unit: number;
  total_kebun: number;
  total_pabrik: number;
  total_karyawan: number;
}

/** app/Http/Requests/Unit/StoreUnitRequest.php */
export interface UnitPayload {
  code: string;
  name: string;
  parent_id: number;
  status?: EntityStatus;
  operationals: {
    operational_category_id: number;
    business_type_id: number | null;
  }[];
}

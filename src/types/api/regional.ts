import type { EntityRef, EntityStatus } from "./entity";

/** app/Http/Resources/RegionalResource.php */
export interface RegionalResource {
  id: number;
  code: string;
  name: string;
  status: EntityStatus;
  jumlah_unit: number;
  /** Regional + seluruh unit di bawahnya */
  jumlah_karyawan: number;
  /** Hanya yang ditempatkan di kantor regional */
  jumlah_karyawan_kantor: number;
  kepala_regional: string | null;
  parent?: EntityRef | null;
}

/** RegionalController@summary */
export interface RegionalSummary {
  total_regional: number;
  total_unit: number;
  total_karyawan: number;
}

/** app/Http/Requests/Regional/StoreRegionalRequest.php */
export interface RegionalPayload {
  code: string;
  name: string;
  status?: EntityStatus;
}

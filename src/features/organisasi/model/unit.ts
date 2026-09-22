import type { EntityStatus } from "@/types/api/entity";
import type {
  UnitListResource,
  UnitPayload,
  UnitSummary as UnitSummaryResource,
} from "@/types/api/unit";
import { toMasterItems, type MasterItem } from "./masterData";

/** Satu baris operasional unit: pasangan jenis + komoditas. */
export interface UnitOperasional {
  id: string;
  kode: string;
  jenisId: string | null;
  komoditasId: string | null;
}

/** Satu unit dalam bentuk yang dipakai komponen. */
export interface Unit {
  id: string;
  kode: string;
  nama: string;
  status: EntityStatus;
  /** Kategori operasional (Kebun / Pabrik), sudah tanpa duplikat */
  jenis: MasterItem[];
  /** Komoditas (Teh / Kopi / Karet), sudah tanpa duplikat */
  komoditas: MasterItem[];
  /** Pasangan asli per baris — dipakai form edit unit */
  operasional: UnitOperasional[];
  regionalId: string | null;
  regionalNama: string | null;
  jumlahKaryawan: number;
}

export interface UnitSummary {
  totalUnit: number;
  totalKebun: number;
  totalPabrik: number;
  totalKaryawan: number;
}

/** Isian form unit; dipetakan ke `UnitPayload` sebelum dikirim. */
export interface UnitInput {
  kode: string;
  nama: string;
  regionalId: string;
  operasional: { jenisId: string; komoditasId: string | null }[];
}

export function toUnit(resource: UnitListResource): Unit {
  return {
    id: String(resource.id),
    kode: resource.code,
    nama: resource.name,
    status: resource.status,
    jenis: toMasterItems(resource.jenis),
    komoditas: toMasterItems(resource.komoditas),
    operasional: resource.operasional.map((row) => ({
      id: String(row.id),
      kode: row.code,
      jenisId:
        row.operational_category_id === null
          ? null
          : String(row.operational_category_id),
      komoditasId:
        row.business_type_id === null ? null : String(row.business_type_id),
    })),
    regionalId: resource.regional ? String(resource.regional.id) : null,
    regionalNama: resource.regional?.name ?? null,
    jumlahKaryawan: resource.jumlah_karyawan,
  };
}

export function toUnitSummary(resource: UnitSummaryResource): UnitSummary {
  return {
    totalUnit: resource.total_unit,
    totalKebun: resource.total_kebun,
    totalPabrik: resource.total_pabrik,
    totalKaryawan: resource.total_karyawan,
  };
}

export function toUnitPayload(input: UnitInput): UnitPayload {
  return {
    code: input.kode.trim(),
    name: input.nama.trim(),
    parent_id: Number(input.regionalId),
    operationals: input.operasional.map((row) => ({
      operational_category_id: Number(row.jenisId),
      business_type_id: row.komoditasId ? Number(row.komoditasId) : null,
    })),
  };
}

/** Daftar nama komoditas unit sebagai satu baris teks. */
export function komoditasLabel(unit: Unit): string {
  return unit.komoditas.length > 0
    ? unit.komoditas.map((item) => item.nama).join(", ")
    : "-";
}

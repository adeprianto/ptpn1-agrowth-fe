import type { EntityStatus } from "@/types/api/entity";
import type {
  RegionalPayload,
  RegionalResource,
  RegionalSummary as RegionalSummaryResource,
} from "@/types/api/regional";

/** Satu regional dalam bentuk yang dipakai komponen. */
export interface Regional {
  id: string;
  kode: string;
  nama: string;
  status: EntityStatus;
  jumlahUnit: number;
  /** Regional + seluruh unit di bawahnya */
  jumlahKaryawan: number;
  /** Hanya yang ditempatkan di kantor regional */
  jumlahKaryawanKantor: number;
  kepalaRegional: string | null;
  /** Nama entity induk, biasanya Head Office */
  induk: string | null;
}

export interface RegionalSummary {
  totalRegional: number;
  totalUnit: number;
  totalKaryawan: number;
}

/** Isian form regional; dipetakan ke `RegionalPayload` sebelum dikirim. */
export interface RegionalInput {
  kode: string;
  nama: string;
}

export function toRegional(resource: RegionalResource): Regional {
  return {
    id: String(resource.id),
    kode: resource.code,
    nama: resource.name,
    status: resource.status,
    jumlahUnit: resource.jumlah_unit,
    jumlahKaryawan: resource.jumlah_karyawan,
    jumlahKaryawanKantor: resource.jumlah_karyawan_kantor,
    kepalaRegional: resource.kepala_regional,
    induk: resource.parent?.name ?? null,
  };
}

export function toRegionalSummary(
  resource: RegionalSummaryResource,
): RegionalSummary {
  return {
    totalRegional: resource.total_regional,
    totalUnit: resource.total_unit,
    totalKaryawan: resource.total_karyawan,
  };
}

export function toRegionalPayload(input: RegionalInput): RegionalPayload {
  return { code: input.kode.trim(), name: input.nama.trim() };
}

import type { BadgeTone } from "@/components/ui";
import type {
  EmployeeFilterOptions,
  EmployeeResource,
  EmployeeSummary,
  EmployeeTrainingHistory,
} from "@/types/api/employee";
import {
  ENTITY_TIPE_BY_TYPE,
  type EntityTipe,
} from "@/features/organisasi/model/entity";
import {
  toMasterItem,
  type MasterItem,
} from "@/features/organisasi/model/masterData";

export type { EntityTipe };

/** Satu pegawai dalam bentuk yang dipakai komponen daftar. */
export interface Pegawai {
  id: string;
  nama: string;
  /** Kode SAP pegawai (kolom nik di backend) */
  nik: string;
  penempatanNama: string;
  /** Konteks induk, mis. "Regional 3" untuk Unit, "Head Office" untuk Regional */
  penempatanInduk: string | null;
  penempatanTipe: EntityTipe | null;
  jabatan: string | null;
  jobGroup: string | null;
  jobFunction: string | null;
  /** 1–6, diformat "BOD-{n}" di layer tampilan */
  levelBod: number | null;
  /** Baris operasional unit tempat pegawai bekerja */
  operasionalJenis: MasterItem | null;
  operasionalKomoditas: string | null;
  golonganPhdp: string | null;
  personGrade: string | null;
  status: string | null;
}

export interface PegawaiSummary {
  totalKaryawan: number;
  totalHo: number;
  totalRegional: number;
  totalUnit: number;
}

export interface RiwayatPelatihan {
  id: string;
  nama: string;
  penyelenggara: string | null;
  tanggalMulai: string | null;
  tanggalSelesai: string | null;
  jam: number;
  status: "Berjalan" | "Selesai";
}

/** Pegawai lengkap dari GET /employees/{id}. */
export interface PegawaiDetail extends Pegawai {
  tempatLahir: string | null;
  /** ISO date (YYYY-MM-DD) */
  tanggalLahir: string | null;
  usia: number | null;
  jenisKelamin: "Laki-laki" | "Perempuan" | null;
  komoditas: string | null;
  penugasan: string | null;
  ksoNonKso: string | null;
  employeeGroup: string | null;
  employeeSubgroup: string | null;
  pendidikan: string | null;
  jurusan: string | null;
  tanggalPensiun: string | null;
  tanggalAcuanMasaKerja: string | null;
  masaKerjaTahun: number | null;
  pelatihanDiikuti: number;
  totalJamPelatihan: number;
  riwayatPelatihan: RiwayatPelatihan[];
}

/** Isi checklist filter kolom di tabel pegawai. */
export interface PegawaiFilterOptions {
  entities: { id: string; nama: string; tipe: EntityTipe }[];
  operasional: { key: string; jenis: MasterItem | null; komoditas: string | null }[];
  jobGroups: MasterItem[];
  jobFunctions: MasterItem[];
  levelBod: number[];
  golonganPhdp: string[];
  personGrade: string[];
}

export function toPegawai(resource: EmployeeResource): Pegawai {
  return {
    id: String(resource.id),
    nama: resource.nama_lengkap || resource.name,
    nik: resource.nik,
    penempatanNama: resource.entity?.name ?? "-",
    penempatanInduk: resource.entity?.parent?.name ?? null,
    penempatanTipe: resource.entity
      ? ENTITY_TIPE_BY_TYPE[resource.entity.type]
      : null,
    jabatan: resource.jabatan?.name ?? null,
    jobGroup: resource.jabatan?.job_group?.name ?? null,
    jobFunction: resource.jabatan?.job_function?.name ?? null,
    levelBod: resource.jabatan?.level_bod ?? null,
    operasionalJenis: resource.entity_operational?.jenis
      ? toMasterItem(resource.entity_operational.jenis)
      : null,
    operasionalKomoditas: resource.entity_operational?.komoditas?.name ?? null,
    golonganPhdp: resource.golongan_phdp || null,
    personGrade: resource.person_grade || null,
    status: resource.status,
  };
}

function toRiwayatPelatihan(row: EmployeeTrainingHistory): RiwayatPelatihan {
  return {
    id: String(row.id),
    nama: row.nama ?? "-",
    penyelenggara: row.penyelenggara,
    tanggalMulai: row.tanggal_mulai,
    tanggalSelesai: row.tanggal_selesai,
    jam: row.jam,
    status: row.status,
  };
}

export function toPegawaiDetail(resource: EmployeeResource): PegawaiDetail {
  return {
    ...toPegawai(resource),
    tempatLahir: resource.tempat_lahir,
    tanggalLahir: resource.tanggal_lahir,
    usia: resource.usia,
    jenisKelamin:
      resource.jenis_kelamin === "L"
        ? "Laki-laki"
        : resource.jenis_kelamin === "P"
          ? "Perempuan"
          : null,
    komoditas: resource.komoditas?.name ?? null,
    penugasan: resource.penugasan,
    ksoNonKso: resource.kso_non_kso,
    employeeGroup: resource.employee_group,
    employeeSubgroup: resource.employee_subgroup,
    pendidikan: resource.pendidikan,
    jurusan: resource.jurusan,
    tanggalPensiun: resource.tanggal_pensiun,
    tanggalAcuanMasaKerja: resource.tanggal_acuan_masa_kerja,
    masaKerjaTahun: resource.masa_kerja_tahun,
    pelatihanDiikuti: resource.pelatihan?.total_diikuti ?? 0,
    totalJamPelatihan: resource.pelatihan?.total_jam ?? 0,
    riwayatPelatihan: resource.pelatihan?.riwayat.map(toRiwayatPelatihan) ?? [],
  };
}

export function toPegawaiSummary(resource: EmployeeSummary): PegawaiSummary {
  return {
    totalKaryawan: resource.total_karyawan,
    totalHo: resource.total_head_office,
    totalRegional: resource.total_regional,
    totalUnit: resource.total_unit,
  };
}

export function toPegawaiFilterOptions(
  resource: EmployeeFilterOptions,
): PegawaiFilterOptions {
  return {
    entities: resource.entities.map((entity) => ({
      id: String(entity.id),
      nama: entity.name,
      tipe: ENTITY_TIPE_BY_TYPE[entity.type],
    })),
    operasional: resource.operasional.map((row) => ({
      key: row.key,
      jenis: row.jenis ? toMasterItem(row.jenis) : null,
      komoditas: row.komoditas?.name ?? null,
    })),
    jobGroups: resource.job_groups.map(toMasterItem),
    jobFunctions: resource.job_functions.map(toMasterItem),
    levelBod: resource.level_bod,
    golonganPhdp: resource.golongan_phdp,
    personGrade: resource.person_grade,
  };
}

/** "BOD-3", atau "-" kalau jabatannya tidak punya level. */
export function levelBodLabel(level: number | null): string {
  return level ? `BOD-${level}` : "-";
}

/**
 * Warna badge status pegawai. Status dari SAP tidak cuma Aktif/Non-aktif —
 * ada Penugasan KSO, MBT, CDT, dan lain-lain, jadi selain dua nilai yang
 * dikenali semuanya diberi warna "perlu perhatian".
 */
export function statusTone(status: string | null): BadgeTone {
  const normalized = status?.toLowerCase().trim() ?? "";

  if (normalized === "") return "slate";
  if (normalized === "aktif" || normalized === "active") return "emerald";
  if (normalized === "inactive" || normalized === "non-aktif") return "rose";
  return "amber";
}

/** Label "Kebun · Teh" untuk baris operasional seorang pegawai. */
export function operasionalLabel(
  jenis: { label: string } | null,
  komoditas: string | null,
): string {
  return [jenis?.label, komoditas].filter(Boolean).join(" · ") || "-";
}

import type { EntityType } from "./entity";
import type { MasterRef } from "./master-data";

/** Penempatan pegawai: entity tempat bertugas + induknya. */
export interface EmployeeEntity {
  id: number;
  type: EntityType;
  code: string;
  name: string;
  parent: { id: number; type: EntityType; code: string; name: string } | null;
}

/** Jabatan pegawai (PositionTitle) seperti yang dikirim EmployeeResource. */
export interface EmployeeJabatan {
  id: number;
  code: string;
  name: string;
  /** 1-6, ditampilkan sebagai "BOD-{n}" */
  level_bod: number | null;
  job_group: MasterRef | null;
  job_function: MasterRef | null;
}

/** Satu baris riwayat pelatihan — hanya ada di GET /employees/{id}. */
export interface EmployeeTrainingHistory {
  id: number;
  nama: string | null;
  penyelenggara: string | null;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  jam: number;
  status: "Berjalan" | "Selesai";
}

/** app/Http/Resources/EmployeeResource.php */
export interface EmployeeResource {
  id: number;
  nik: string;
  name: string;
  nama_lengkap: string | null;
  gelar_depan: string | null;
  gelar_belakang: string | null;
  tempat_lahir: string | null;
  /** ISO date (YYYY-MM-DD) */
  tanggal_lahir: string | null;
  usia: number | null;
  jenis_kelamin: "L" | "P" | null;
  jabatan: EmployeeJabatan | null;
  entity: EmployeeEntity | null;
  komoditas?: MasterRef | null;
  status: string | null;
  penugasan: string | null;
  kso_non_kso: string | null;
  employee_group: string | null;
  employee_subgroup: string | null;
  person_grade: string | null;
  golongan_phdp: string | null;
  pendidikan: string | null;
  jurusan: string | null;
  mbt: string | null;
  tanggal_pensiun: string | null;
  tanggal_acuan_masa_kerja: string | null;
  masa_kerja_tahun: number | null;
  /** Hanya ada di GET /employees/{id} */
  pelatihan?: {
    total_diikuti: number;
    total_jam: number;
    riwayat: EmployeeTrainingHistory[];
  };
}

/** EmployeeController@summary */
export interface EmployeeSummary {
  total_karyawan: number;
  total_head_office: number;
  total_regional: number;
  total_unit: number;
}

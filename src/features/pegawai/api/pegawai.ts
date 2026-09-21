import { apiGet } from "@/lib/api-client";
import type { MasterRef } from "@/features/organisasi/api/masterData";
import { getRegionals } from "@/features/organisasi/api/regional";
import { getUnits } from "@/features/organisasi/api/unit";

type EntityType = "HEAD_OFFICE" | "REGIONAL" | "UNIT";

interface EntityRefApi extends MasterRef {
  type: EntityType;
}

// Bentuk mentah dari backend (EmployeeResource) — hanya field yang dipakai list
interface EmployeeApi {
  id: number;
  nik: string;
  name: string;
  nama_lengkap: string;
  jabatan: {
    id: number;
    code: string;
    name: string;
    level_bod: number | null;
    job_group: MasterRef | null;
    job_function: MasterRef | null;
  } | null;
  entity: (EntityRefApi & { parent: EntityRefApi | null }) | null;
  status: string | null;
}

interface EmployeeSummaryApi {
  total_karyawan: number;
  total_head_office: number;
  total_regional: number;
  total_unit: number;
}

export type PenempatanTipe = "HO" | "Regional" | "Unit";

const TIPE_BY_ENTITY: Record<EntityType, PenempatanTipe> = {
  HEAD_OFFICE: "HO",
  REGIONAL: "Regional",
  UNIT: "Unit",
};

// Bentuk yang dipakai komponen FE
export interface Pegawai {
  id: string;
  nama: string;
  /** Kode SAP pegawai (kolom nik di backend) */
  nik: string;
  penempatanNama: string;
  /** Konteks induk, mis. "Regional 3" untuk Unit, "Head Office" untuk Regional */
  penempatanInduk: string | null;
  penempatanTipe: PenempatanTipe | null;
  jabatan: string | null;
  jobGroup: string | null;
  /** 1–6, diformat "BOD-{n}" di layer tampilan */
  levelBod: number | null;
  status: string | null;
}

export interface PegawaiSummary {
  totalKaryawan: number;
  totalHo: number;
  totalRegional: number;
  totalUnit: number;
}

function toPegawai(e: EmployeeApi): Pegawai {
  return {
    id: String(e.id),
    nama: e.nama_lengkap || e.name,
    nik: e.nik,
    penempatanNama: e.entity?.name ?? "-",
    penempatanInduk: e.entity?.parent?.name ?? null,
    penempatanTipe: e.entity ? TIPE_BY_ENTITY[e.entity.type] : null,
    jabatan: e.jabatan?.name ?? null,
    jobGroup: e.jabatan?.job_group?.name ?? null,
    levelBod: e.jabatan?.level_bod ?? null,
    status: e.status,
  };
}

export interface PegawaiQuery {
  search?: string;
  entityId?: string;
  levelBod?: string;
  page?: number;
  perPage?: number;
}

// GET /api/v1/employees
export async function getPegawaiList(params: PegawaiQuery, signal?: AbortSignal) {
  const res = await apiGet<EmployeeApi[]>(
    "/employees",
    {
      search: params.search,
      entity_id: params.entityId,
      level_bod: params.levelBod,
      page: params.page,
      per_page: params.perPage,
    },
    signal,
  );
  return { rows: res.data.map(toPegawai), meta: res.meta };
}

// GET /api/v1/employees/summary
export async function getPegawaiSummary(
  signal?: AbortSignal,
): Promise<PegawaiSummary> {
  const { data } = await apiGet<EmployeeSummaryApi>(
    "/employees/summary",
    undefined,
    signal,
  );
  return {
    totalKaryawan: data.total_karyawan,
    totalHo: data.total_head_office,
    totalRegional: data.total_regional,
    totalUnit: data.total_unit,
  };
}

export interface PenempatanOption {
  id: string;
  nama: string;
  tipe: PenempatanTipe;
}

// Opsi filter Penempatan: HO + Regional + Unit (Regional & Unit sudah di-scope backend)
export async function getPenempatanOptions(
  signal?: AbortSignal,
): Promise<PenempatanOption[]> {
  const [ho, regionals, units] = await Promise.all([
    apiGet<MasterRef[]>("/entities", { type: "HEAD_OFFICE" }, signal),
    getRegionals({ perPage: 100 }, signal),
    getUnits({ perPage: 500 }, signal),
  ]);

  return [
    ...ho.data.map((e) => ({ id: String(e.id), nama: e.name, tipe: "HO" as const })),
    ...regionals.rows.map((r) => ({ id: r.id, nama: r.nama, tipe: "Regional" as const })),
    ...units.rows.map((u) => ({ id: u.id, nama: u.nama, tipe: "Unit" as const })),
  ];
}

// Field tambahan yang ada di GET /employees/{id}
interface EmployeeDetailApi extends EmployeeApi {
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  usia: number | null;
  jenis_kelamin: "L" | "P" | null;
  komoditas: MasterRef | null;
  penugasan: string | null;
  kso_non_kso: string | null;
  employee_group: string | null;
  employee_subgroup: string | null;
  person_grade: string | null;
  golongan_phdp: string | null;
  pendidikan: string | null;
  jurusan: string | null;
  tanggal_pensiun: string | null;
  tanggal_acuan_masa_kerja: string | null;
  pelatihan: {
    total_diikuti: number;
    total_jam: number;
    riwayat: {
      id: number;
      nama: string | null;
      penyelenggara: string | null;
      tanggal_mulai: string | null;
      tanggal_selesai: string | null;
      jam: number;
      status: "Berjalan" | "Selesai";
    }[];
  };
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

export interface PegawaiDetail extends Pegawai {
  tempatLahir: string | null;
  /** ISO date (YYYY-MM-DD) */
  tanggalLahir: string | null;
  usia: number | null;
  jenisKelamin: "Laki-laki" | "Perempuan" | null;
  jobFunction: string | null;
  komoditas: string | null;
  penugasan: string | null;
  ksoNonKso: string | null;
  employeeGroup: string | null;
  employeeSubgroup: string | null;
  personGrade: string | null;
  golonganPhdp: string | null;
  pendidikan: string | null;
  jurusan: string | null;
  tanggalPensiun: string | null;
  tanggalAcuanMasaKerja: string | null;
  pelatihanDiikuti: number;
  totalJamPelatihan: number;
  riwayatPelatihan: RiwayatPelatihan[];
}

// GET /api/v1/employees/{id}
export async function getPegawaiDetail(
  id: string,
  signal?: AbortSignal,
): Promise<PegawaiDetail> {
  const { data: e } = await apiGet<EmployeeDetailApi>(
    `/employees/${encodeURIComponent(id)}`,
    undefined,
    signal,
  );

  return {
    ...toPegawai(e),
    tempatLahir: e.tempat_lahir,
    tanggalLahir: e.tanggal_lahir,
    usia: e.usia,
    jenisKelamin:
      e.jenis_kelamin === "L"
        ? "Laki-laki"
        : e.jenis_kelamin === "P"
          ? "Perempuan"
          : null,
    jobFunction: e.jabatan?.job_function?.name ?? null,
    komoditas: e.komoditas?.name ?? null,
    penugasan: e.penugasan,
    ksoNonKso: e.kso_non_kso,
    employeeGroup: e.employee_group,
    employeeSubgroup: e.employee_subgroup,
    personGrade: e.person_grade,
    golonganPhdp: e.golongan_phdp,
    pendidikan: e.pendidikan,
    jurusan: e.jurusan,
    tanggalPensiun: e.tanggal_pensiun,
    tanggalAcuanMasaKerja: e.tanggal_acuan_masa_kerja,
    pelatihanDiikuti: e.pelatihan.total_diikuti,
    totalJamPelatihan: e.pelatihan.total_jam,
    riwayatPelatihan: e.pelatihan.riwayat.map((r) => ({
      id: String(r.id),
      nama: r.nama ?? "-",
      penyelenggara: r.penyelenggara,
      tanggalMulai: r.tanggal_mulai,
      tanggalSelesai: r.tanggal_selesai,
      jam: r.jam,
      status: r.status,
    })),
  };
}

export type CompetencyLevel =
  | "Novice"
  | "Beginner"
  | "Competent"
  | "Proficient";

export const competencyLevelValue: Record<CompetencyLevel, number> = {
  Novice: 1,
  Beginner: 2,
  Competent: 3,
  Proficient: 4,
};

export interface CompetencyRow {
  aspek: string;
  aktual: CompetencyLevel;
  dibutuhkan: CompetencyLevel;
}

export type TrainingStatus = "Berjalan" | "Selesai";

export interface TrainingHistoryRow {
  id: string;
  nama: string;
  provider: string;
  tanggal: string;
  jam: number;
  status: TrainingStatus;
}

export interface PegawaiDetail {
  id: string;
  masaKerja: string;
  pelatihanDiikuti: number;
  totalJamPelatihan: number;
  jabatanSaatIni: string;
  informasiPribadi: {
    tempatTanggalLahir: string;
    usiaJenisKelamin: string;
    pendidikanTerakhir: string;
    nomorTelepon: string;
    alamat: string;
  };
  informasiKepegawaian: {
    statusKepegawaian: string;
    employeeGroupSubgroup: string;
    personnelArea: string;
    statusKso: string;
    personGradeGolPhdp: string;
    tanggalMasuk: string;
  };
  riwayatPelatihan: TrainingHistoryRow[];
  standarJabatan: string;
  kompetensi: CompetencyRow[];
}

// DUMMY DATA — baru lengkap untuk id "1" (Slamet Riyadi). Pegawai lain di
// pegawaiDummyData.ts belum punya detail dummy selengkap ini; nanti semua
// diganti hasil GET /api/v1/pegawai/{id}/detail.
const pegawaiDetailById: Record<string, PegawaiDetail> = {
  "1": {
    id: "1",
    masaKerja: "3 Thn 5 Bln",
    pelatihanDiikuti: 9,
    totalJamPelatihan: 184,
    jabatanSaatIni: "Kepala Bagian",
    informasiPribadi: {
      tempatTanggalLahir: "Palembang, 14 Februari 1996",
      usiaJenisKelamin: "42 Tahun . Laki-laki",
      pendidikanTerakhir: "SMA/SMK",
      nomorTelepon: "0812-9221-2280",
      alamat: "Ds. Sukamaju, Kec. Muara Kelingi, Kab. Musi Rawas",
    },
    informasiKepegawaian: {
      statusKepegawaian: "Karyawan Tetap",
      employeeGroupSubgroup: "Pelaksana . PKWTT",
      personnelArea: "Regional 3",
      statusKso: "Non KSO",
      personGradeGolPhdp: "Grade 7 . II/C",
      tanggalMasuk: "3 Maret 2014",
    },
    riwayatPelatihan: [
      {
        id: "t1",
        nama: "Pelatihan K3 Perkebunan",
        provider: "LPP Palembang",
        tanggal: "18 Jul 2026",
        jam: 24,
        status: "Berjalan",
      },
      {
        id: "t2",
        nama: "Manajemen Kelapa Sawit",
        provider: "Pusdiklat Internal",
        tanggal: "12 Mei 2026",
        jam: 12,
        status: "Selesai",
      },
      {
        id: "t3",
        nama: "Sertifikasi Mandor Lapangan",
        provider: "LPP Palembang",
        tanggal: "4 Ags 2025",
        jam: 32,
        status: "Selesai",
      },
      {
        id: "t4",
        nama: "Dasar-dasar Kepemimpinan Lapangan",
        provider: "Pusdiklat Internal",
        tanggal: "25 Jan 2024",
        jam: 9,
        status: "Selesai",
      },
    ],
    standarJabatan: "Kepala Bagian",
    kompetensi: [
      {
        aspek: "Penguasaan Teknis Lapangan",
        aktual: "Proficient",
        dibutuhkan: "Competent",
      },
      { aspek: "Komunikasi", aktual: "Novice", dibutuhkan: "Beginner" },
      { aspek: "Kedisiplinan", aktual: "Proficient", dibutuhkan: "Competent" },
      {
        aspek: "K3 / Keselamatan Kerja",
        aktual: "Competent",
        dibutuhkan: "Competent",
      },
      {
        aspek: "Problem Solving",
        aktual: "Beginner",
        dibutuhkan: "Proficient",
      },
      { aspek: "Kepemimpinan", aktual: "Beginner", dibutuhkan: "Beginner" },
    ],
  },
};

export function getPegawaiDetail(id: string): PegawaiDetail | undefined {
  return pegawaiDetailById[id];
}

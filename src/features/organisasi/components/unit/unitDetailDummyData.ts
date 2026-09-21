import type { AnggaranDatum } from "@/components/shared/AnggaranPengembanganChart";
import type { DistribusiDatum } from "@/components/shared/DistribusiKaryawanChart";
import type { PengajuanPelatihanRow } from "@/components/shared/PengajuanPelatihanList";

export interface UnitPositionRow {
  id: string;
  posisi: string;
  departemen: string;
  terisi: number;
  kuota: number;
}

export interface UnitDetailExtra {
  totalKaryawan: number;
  posisiTerisi: number;
  posisiKuota: number;
  realisasiAnggaran: number;
  penanggungJawab?: string;
  noHp?: string;
  alamat?: string;
  strukturPosisi: UnitPositionRow[];
  anggaranPengembangan: AnggaranDatum[];
  distribusiKaryawan: DistribusiDatum[];
  riwayatPengajuan: PengajuanPelatihanRow[];
}

// DUMMY DATA — placeholder yang sama untuk semua unit. Header, total karyawan,
// dan induk regional sudah dari GET /api/v1/units/{id}; sisanya (struktur
// posisi, anggaran, distribusi, pengajuan) menunggu fiturnya ada di backend.
// Struktur posisi nanti diatur PIC saat edit unit (daftar jabatan + kuota).
type UnitDetailDummy = Omit<UnitDetailExtra, "totalKaryawan">;

const unitDetailById: Record<string, UnitDetailDummy> = {
  u1: {
    posisiTerisi: 15,
    posisiKuota: 18,
    realisasiAnggaran: 38_000_000,
    strukturPosisi: [
      {
        id: "p1",
        posisi: "Asisten Kepala",
        departemen: "Produksi Kebun",
        terisi: 1,
        kuota: 1,
      },
      {
        id: "p2",
        posisi: "Manajer",
        departemen: "Produksi Kebun",
        terisi: 3,
        kuota: 3,
      },
      {
        id: "p3",
        posisi: "Mandor Panen",
        departemen: "Produksi Kebun",
        terisi: 6,
        kuota: 6,
      },
      {
        id: "p4",
        posisi: "Krani Afdeling",
        departemen: "Administrasi & Umum",
        terisi: 4,
        kuota: 5,
      },
      {
        id: "p5",
        posisi: "Staff Keamanan",
        departemen: "Administrasi & Umum",
        terisi: 2,
        kuota: 3,
      },
      {
        id: "p6",
        posisi: "[nama posisi]",
        departemen: "[job group]",
        terisi: 1,
        kuota: 3,
      },
    ],
    anggaranPengembangan: [
      { bulan: "Jan", rencana: 360, realisasi: 190 },
      { bulan: "Feb", rencana: 520, realisasi: 270 },
      { bulan: "Mar", rencana: 200, realisasi: 570 },
      { bulan: "Apr", rencana: 350, realisasi: 200 },
      { bulan: "Mei", rencana: 530, realisasi: 420 },
      { bulan: "Jun", rencana: 590, realisasi: 430 },
      { bulan: "Jul", rencana: 770, realisasi: 510 },
      { bulan: "Agu", rencana: 320, realisasi: 160 },
      { bulan: "Sep", rencana: 550, realisasi: 980 },
      { bulan: "Okt", rencana: 790, realisasi: 270 },
      { bulan: "Nov", rencana: 660, realisasi: 690 },
      { bulan: "Des", rencana: 630, realisasi: 390 },
    ],
    distribusiKaryawan: [
      { name: "[Posisi Jabatan]", value: 20, color: "#EC4899" },
      { name: "[Posisi Jabatan]", value: 16, color: "#F97316" },
      { name: "[Posisi Jabatan]", value: 22, color: "#10B981" },
      { name: "[Posisi Jabatan]", value: 9, color: "#06B6D4" },
      { name: "[Posisi Jabatan]", value: 13, color: "#3B82F6" },
      { name: "[Posisi Jabatan]", value: 8, color: "#8B5CF6" },
      { name: "[Posisi Jabatan]", value: 10, color: "#EF4444" },
      { name: "[Posisi Jabatan]", value: 7, color: "#EAB308" },
    ],
    riwayatPengajuan: [
      {
        id: "v1",
        namaPelatihan: "Pelatihan K3 Perkebunan",
        namaUnit: "Kebun Sei Lakitan",
        tanggalDiajukan: "12 Agustus 2026",
        status: "diajukan",
      },
      {
        id: "v2",
        namaPelatihan: "Manajemen Mutu Pengolahan",
        namaUnit: "Kebun Sei Lakitan",
        tanggalDiajukan: "10 Agustus 2026",
        status: "menunggu_approval",
      },
      {
        id: "v3",
        namaPelatihan: "Pelatihan Keselamatan Kerja",
        namaUnit: "Kebun Sei Lakitan",
        tanggalDiajukan: "4 Agustus 2026",
        status: "diteruskan_ho",
      },
      {
        id: "v4",
        namaPelatihan: "Sertifikasi Mandor Lapangan",
        namaUnit: "Kebun Sei Lakitan",
        tanggalDiajukan: "18 Juli 2026",
        status: "ditolak",
      },
      {
        id: "v5",
        namaPelatihan: "Pelatihan Kepemimpinan",
        namaUnit: "Kebun Sei Lakitan",
        tanggalDiajukan: "18 Juli 2026",
        status: "disetujui",
      },
    ],
  },
};

export function getUnitDetailDummy(): UnitDetailDummy {
  return unitDetailById.u1;
}

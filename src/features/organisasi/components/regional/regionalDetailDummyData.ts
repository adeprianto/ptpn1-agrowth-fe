import type { StatusKey } from "@/components/shared/StatusBadge";

export interface UnitStructureRow {
  id: string;
  nama: string;
  jenis: "Kebun" | "Pabrik";
  karyawan: number;
  kepalaUnit: string;
}

// DUMMY DATA — nanti diganti hasil GET /api/v1/organisasi/regional/{id}/unit
export const unitStructureRows: UnitStructureRow[] = [
  {
    id: "1",
    nama: "Kebun Sei Lakitan",
    jenis: "Kebun",
    karyawan: 120,
    kepalaUnit: "Rudi Hartono",
  },
  {
    id: "2",
    nama: "Pabrik Tebenan",
    jenis: "Pabrik",
    karyawan: 80,
    kepalaUnit: "Sartono",
  },
  {
    id: "3",
    nama: "Kebun Tebenan",
    jenis: "Kebun",
    karyawan: 320,
    kepalaUnit: "Wibowo",
  },
  {
    id: "4",
    nama: "Kebun Sei Lakitan",
    jenis: "Kebun",
    karyawan: 76,
    kepalaUnit: "Deni Kurniawan",
  },
  {
    id: "5",
    nama: "Pabrik Subar Eji",
    jenis: "Pabrik",
    karyawan: 223,
    kepalaUnit: "Herman",
  },
  {
    id: "6",
    nama: "Pabrik Kemuning",
    jenis: "Pabrik",
    karyawan: 74,
    kepalaUnit: "Bambang",
  },
];

export interface PendingValidationRow {
  id: string;
  namaPelatihan: string;
  namaUnit: string;
  /** Sudah diformat, mis. "12 Agustus 2026" */
  tanggalDiajukan: string;
  status: StatusKey;
}

// DUMMY DATA — nanti diganti hasil GET /api/v1/organisasi/regional/{id}/validasi-pending
export const pendingValidationRows: PendingValidationRow[] = [
  {
    id: "1",
    namaPelatihan: "Pelatihan K3 Perkebunan",
    namaUnit: "Kebun Sei Lakitan",
    tanggalDiajukan: "12 Agustus 2026",
    status: "diajukan",
  },
  {
    id: "2",
    namaPelatihan: "Manajemen Mutu Pengolahan",
    namaUnit: "Kebun Sei Lakitan",
    tanggalDiajukan: "10 Agustus 2026",
    status: "menunggu_approval",
  },
  {
    id: "3",
    namaPelatihan: "Pelatihan Keselamatan Kerja",
    namaUnit: "Pabrik Tebenan",
    tanggalDiajukan: "4 Agustus 2026",
    status: "diteruskan_ho",
  },
  {
    id: "4",
    namaPelatihan: "Sertifikasi Operator Mesin",
    namaUnit: "Pabrik Subar Eji",
    tanggalDiajukan: "18 Juli 2026",
    status: "ditolak",
  },
  {
    id: "5",
    namaPelatihan: "Pelatihan Kepemimpinan",
    namaUnit: "Kebun Tebenan",
    tanggalDiajukan: "18 Juli 2026",
    status: "disetujui",
  },
];

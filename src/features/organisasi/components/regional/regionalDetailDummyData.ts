import type { PengajuanStatus } from "@/components/shared/PengajuanPelatihanList";

export interface PendingValidationRow {
  id: string;
  namaPelatihan: string;
  namaUnit: string;
  /** Sudah diformat, mis. "12 Agustus 2026" */
  tanggalDiajukan: string;
  status: PengajuanStatus;
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

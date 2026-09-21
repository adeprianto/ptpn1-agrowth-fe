import { apiGet } from "@/lib/api-client";

// Bentuk mentah dari backend (HeadOfficeController@show)
interface HeadOfficeApi {
  id: number;
  code: string;
  name: string;
  status: string;
  jumlah_karyawan: number;
  jumlah_regional: number;
  jumlah_unit: number;
}

export interface HeadOffice {
  id: string;
  kode: string;
  nama: string;
  status: string;
  /** Pegawai yang ditempatkan langsung di Head Office */
  jumlahKaryawan: number;
  jumlahRegional: number;
  jumlahUnit: number;
}

// GET /api/v1/head-office — 403 untuk akun non-HO
export async function getHeadOffice(signal?: AbortSignal): Promise<HeadOffice> {
  const { data } = await apiGet<HeadOfficeApi>("/head-office", undefined, signal);

  return {
    id: String(data.id),
    kode: data.code,
    nama: data.name,
    status: data.status,
    jumlahKaryawan: data.jumlah_karyawan,
    jumlahRegional: data.jumlah_regional,
    jumlahUnit: data.jumlah_unit,
  };
}

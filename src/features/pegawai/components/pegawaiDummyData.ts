export type PenempatanTipe = "HO" | "Regional" | "Unit";
export type StatusPegawai = "Aktif" | "Non-aktif";

export interface PegawaiRow {
  id: string;
  nama: string;
  nik: string;
  /** Nama kantor spesifik tempat pegawai ditugaskan, mis. "Kebun Tebenan" */
  penempatanNama: string;
  /** Konteks induk, mis. "Regional 6" untuk Unit, atau "HO" untuk Head Office */
  penempatanInduk: string;
  penempatanTipe: PenempatanTipe;
  jabatan: string;
  departemen: string;
  level: string;
  status: StatusPegawai;
}

// DUMMY DATA — nanti diganti hasil GET /api/v1/pegawai
export const pegawaiRows: PegawaiRow[] = [
  {
    id: "1",
    nama: "Slamet Riyadi",
    nik: "SAP 1000324",
    penempatanNama: "Head Office",
    penempatanInduk: "HO",
    penempatanTipe: "HO",
    jabatan: "Kepala Divisi SDM",
    departemen: "SDM",
    level: "1",
    status: "Aktif",
  },
  {
    id: "2",
    nama: "Nur Aisya Ramdhani",
    nik: "SAP 1000512",
    penempatanNama: "Regional Office",
    penempatanInduk: "Regional 3",
    penempatanTipe: "Regional",
    jabatan: "Asisten Pabrik",
    departemen: "Teknik & Pengolahan",
    level: "3",
    status: "Non-aktif",
  },
  {
    id: "3",
    nama: "Yusuf Alamsyah",
    nik: "SAP 1000871",
    penempatanNama: "Kebun Tebenan",
    penempatanInduk: "Regional 6",
    penempatanTipe: "Unit",
    jabatan: "Staff Administrasi",
    departemen: "Administrasi & Umum",
    level: "4",
    status: "Aktif",
  },
  {
    id: "4",
    nama: "Wulandari Kusuma",
    nik: "SAP 1000902",
    penempatanNama: "Head Office",
    penempatanInduk: "HO",
    penempatanTipe: "HO",
    jabatan: "Mandor Rawat",
    departemen: "Produksi Kebun",
    level: "4",
    status: "Aktif",
  },
  {
    id: "5",
    nama: "Herman Susilo",
    nik: "SAP 1001120",
    penempatanNama: "Pabrik Cisauk",
    penempatanInduk: "Regional 2",
    penempatanTipe: "Unit",
    jabatan: "Kepala Regional",
    departemen: "Manajemen",
    level: "2",
    status: "Aktif",
  },
];

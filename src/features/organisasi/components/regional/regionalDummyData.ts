export interface RegionalRow {
  id: string;
  kode: string;
  nama: string;
  wilayah: string;
  jumlahUnit: number;
  jumlahKaryawan: number;
  kepalaRegional: string;
}

// DUMMY DATA — nanti diganti hasil GET /api/v1/organisasi/regional
// "[Nama Wilayah]" sengaja dibiarkan seperti di desain aslinya (data belum final).
export const regionalRows: RegionalRow[] = [
  {
    id: "1",
    kode: "REG-01",
    nama: "Regional 1",
    wilayah: "Medan",
    jumlahUnit: 4,
    jumlahKaryawan: 234,
    kepalaRegional: "Fajar Bastuti",
  },
  {
    id: "2",
    kode: "REG-02",
    nama: "Regional 2",
    wilayah: "Surabaya",
    jumlahUnit: 7,
    jumlahKaryawan: 234,
    kepalaRegional: "Bambang Herlang",
  },
  {
    id: "3",
    kode: "REG-03",
    nama: "Regional 3",
    wilayah: "Bandung",
    jumlahUnit: 6,
    jumlahKaryawan: 234,
    kepalaRegional: "Kurniawan",
  },
  {
    id: "4",
    kode: "REG-04",
    nama: "Regional 4",
    wilayah: "Kalimantan",
    jumlahUnit: 9,
    jumlahKaryawan: 234,
    kepalaRegional: "Bayu Kris",
  },
  {
    id: "5",
    kode: "REG-05",
    nama: "Regional 5",
    wilayah: "[Nama Wilayah]",
    jumlahUnit: 12,
    jumlahKaryawan: 234,
    kepalaRegional: "Eko Prasetyo",
  },
  {
    id: "6",
    kode: "REG-06",
    nama: "Regional 6",
    wilayah: "[Nama Wilayah]",
    jumlahUnit: 26,
    jumlahKaryawan: 234,
    kepalaRegional: "Supratno",
  },
  {
    id: "7",
    kode: "REG-07",
    nama: "Regional 7",
    wilayah: "[Nama Wilayah]",
    jumlahUnit: 11,
    jumlahKaryawan: 234,
    kepalaRegional: "Yanto Ilham",
  },
  {
    id: "8",
    kode: "REG-08",
    nama: "Regional 8",
    wilayah: "[Nama Wilayah]",
    jumlahUnit: 8,
    jumlahKaryawan: 234,
    kepalaRegional: "Dedi Kusnadi",
  },
];

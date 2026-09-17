export interface UnitRow {
  id: string;
  kode: string;
  name: string;
  regional: string;
  tipe: string;
  komoditas: string;
  jumlahKaryawan: number;
  kepalaUnit: string;
}

export const unitRows: UnitRow[] = [
  {
    id: "1",
    kode: "UNIT-101",
    name: "Unit Arso",
    regional: "Regional 1",
    tipe: "Kebun",
    komoditas: "Teh",
    jumlahKaryawan: 234,
    kepalaUnit: "Fajar Bastuti",
  },
  {
    id: "2",
    kode: "UNIT-201",
    name: "Unit Tembakau",
    regional: "Regional 2",
    tipe: "Kebun",
    komoditas: "Teh",
    jumlahKaryawan: 234,
    kepalaUnit: "Bambang Herlang",
  },
  {
    id: "3",
    kode: "UNIT-202",
    name: "Bagjanegara",
    regional: "Regional 2",
    tipe: "Pabrik",
    komoditas: "Teh",
    jumlahKaryawan: 234,
    kepalaUnit: "Kurniawan",
  },
  {
    id: "4",
    kode: "UNIT-301",
    name: "Balong",
    regional: "Regional 3",
    tipe: "Kebun",
    komoditas: "Kopi",
    jumlahKaryawan: 234,
    kepalaUnit: "Bayu Kris",
  },
  {
    id: "5",
    kode: "UNIT-501",
    name: "Adjong Gayasan",
    regional: "Regional 5",
    tipe: "Pabrik",
    komoditas: "Coklat",
    jumlahKaryawan: 234,
    kepalaUnit: "Eko Prasetyo",
  },
  {
    id: "6",
    kode: "UNIT-502",
    name: "Kertosari",
    regional: "Regional 5",
    tipe: "Pabrik",
    komoditas: "Tembakau",
    jumlahKaryawan: 234,
    kepalaUnit: "Supratno",
  },
  {
    id: "7",
    kode: "UNIT-701",
    name: "Bergen",
    regional: "Regional 6",
    tipe: "Kebun",
    komoditas: "Tembakau",
    jumlahKaryawan: 234,
    kepalaUnit: "Yanto Ilham",
  },
  {
    id: "8",
    kode: "UNIT-702",
    name: "Beringin",
    regional: "Regional 7",
    tipe: "Kebun",
    komoditas: "Sawit",
    jumlahKaryawan: 234,
    kepalaUnit: "Dedi Kusnadi",
  },
];

// 14 kategori RKAP biaya pengembangan SDM — nama sama dengan card
// Total Konsolidasi. Sebaiknya RegionalCostChart juga import dari sini.
export const KATEGORI_RKAP = [
  "PDSM - Pengembangan BOD & BOC",
  "PDSM - Agro Walet",
  "PDSM - IHT & Public Training",
  "PDSM - Kursus Jabatan",
  "PDSM - Sertifikasi Jabatan",
  "PDSM - Program Study Banding",
  "PDSM - Program Pendidikan Lanjut",
  "PDSM - Biaya Perjalanan Dinas",
  "Assessment",
  "Rekrutmen",
  "Onboarding",
  "Program Budaya Perusahaan",
  "Konsultasi Pengembangan SDM",
  "Inovasi & Riset",
] as const;

export const ENTITY_OPTIONS = [
  { value: "HO", label: "Head Office" },
  { value: "1", label: "Regional 1" },
  { value: "2", label: "Regional 2" },
  { value: "3", label: "Regional 3" },

  { value: "5", label: "Regional 5" },

  { value: "7", label: "Regional 7" },
  { value: "8", label: "Regional 8" },
] as const;

export type EntityValue = (typeof ENTITY_OPTIONS)[number]["value"];

export interface BreakdownItem {
  kategori: string;
  nilai: number;
}

export interface MonthlyCost {
  bulan: string;
  target: number;
  realisasi: number;
  detail: BreakdownItem[];
}

const BULAN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

// Skala biaya per bulan per kategori (kira-kira), HO jauh lebih besar
const ENTITY_SCALE: Record<EntityValue, number> = {
  HO: 190_000_000,
  "1": 4_000_000,
  "2": 11_000_000,
  "3": 10_500_000,

  "5": 10_700_000,

  "7": 12_800_000,
  "8": 3_900_000,
};

// Random ber-seed (hasil selalu sama) — Math.random() tidak dipakai karena
// bikin hydration mismatch antara render server & client.
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildEntityData(entity: EntityValue, seed: number): MonthlyCost[] {
  const rand = seededRandom(seed);
  const scale = ENTITY_SCALE[entity];

  return BULAN.map((bulan, monthIndex) => {
    const trend = 0.8 + monthIndex * 0.04; // naik pelan sepanjang tahun
    const detail = KATEGORI_RKAP.map((kategori) => ({
      kategori,
      nilai: Math.round(scale * trend * (0.4 + rand() * 1.2)),
    }));
    // Realisasi = jumlah rincian, jadi total & rincian tidak mungkin beda
    const realisasi = detail.reduce((sum, d) => sum + d.nilai, 0);
    const target = Math.round(realisasi * (1.02 + rand() * 0.25));
    return { bulan, target, realisasi, detail };
  });
}

// DUMMY DATA — nanti diganti hasil GET /api/v1/dashboard/biaya-pengembangan/tren?entity=
export const developmentCostByEntity: Record<EntityValue, MonthlyCost[]> = {
  HO: buildEntityData("HO", 11),
  "1": buildEntityData("1", 23),
  "2": buildEntityData("2", 37),
  "3": buildEntityData("3", 41),

  "5": buildEntityData("5", 53),

  "7": buildEntityData("7", 67),
  "8": buildEntityData("8", 79),
};

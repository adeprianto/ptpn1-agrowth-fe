// DUMMY DATA dashboard — satu sumber untuk card ringkasan, chart, dan tabel,
// supaya angka yang sama tidak mungkin berbeda antar komponen.
// Nanti tiap bagian diganti hasil GET /api/v1/dashboard/...

// Urutan entity (kolom tabel & sumbu X chart)
export const ENTITIES = ["HO", "1", "2", "3", "5", "7", "8"] as const;
export type Entity = (typeof ENTITIES)[number];

export const TAHUN_ANGGARAN = 2026;
/** Jumlah bulan yang dihitung untuk rata-rata bulanan (dummy: setahun penuh) */
export const BULAN_BERJALAN = 12;

export const formatEntityShort = (value: string) =>
  value.toUpperCase() === "HO" ? "HO" : `R${value}`;

export const formatEntityName = (value: string) =>
  value.toUpperCase() === "HO" ? "Head Office" : `Regional ${value}`;

// ── Level BOD ────────────────────────────────────────────────────────────
// Level BOD 1–6, sama dengan enum `level_bod` di backend. Data pakai angka,
// label "BOD-n" cuma di tampilan.
export const LEVELS = [1, 2, 3, 4, 5, 6] as const;
export type Level = (typeof LEVELS)[number];
export type LevelKey = `level${Level}`;

export const levelKey = (level: Level): LevelKey => `level${level}`;
export const levelLabel = (level: Level) => `BOD-${level}`;

export const LEVEL_COLORS: Record<Level, string> = {
  1: "#562547",
  2: "#0b2228",
  3: "#bfa437",
  4: "#28e2a1",
  5: "#13f977",
  6: "#b2728d",
};

type LevelValues = Record<LevelKey, number>;

// ── Kepesertaan ──────────────────────────────────────────────────────────
// Jumlah peserta per entity per level BOD.
// GET /api/v1/dashboard/peserta-per-regional
const pesertaRaw: ({ regional: Entity } & LevelValues)[] = [
  {
    regional: "HO",
    level1: 12,
    level2: 28,
    level3: 28,
    level4: 131,
    level5: 120,
    level6: 88,
  },
  {
    regional: "1",
    level1: 2,
    level2: 6,
    level3: 8,
    level4: 52,
    level5: 85,
    level6: 130,
  },
  {
    regional: "2",
    level1: 3,
    level2: 8,
    level3: 10,
    level4: 63,
    level5: 97,
    level6: 142,
  },
  {
    regional: "3",
    level1: 2,
    level2: 7,
    level3: 9,
    level4: 59,
    level5: 90,
    level6: 125,
  },
  {
    regional: "5",
    level1: 3,
    level2: 9,
    level3: 11,
    level4: 69,
    level5: 104,
    level6: 150,
  },
  {
    regional: "7",
    level1: 3,
    level2: 8,
    level3: 10,
    level4: 58,
    level5: 92,
    level6: 136,
  },
  {
    regional: "8",
    level1: 1,
    level2: 4,
    level3: 5,
    level4: 37,
    level5: 61,
    level6: 87,
  },
];

/** Karpim = BOD-1 s/d BOD-3, Karpel = BOD-4 s/d BOD-6 */
export const KARPIM_LEVELS: readonly Level[] = [1, 2, 3];
export const KARPEL_LEVELS: readonly Level[] = [4, 5, 6];

// Warna sama dengan chart Karpim/Karpel yang lama
export const PESERTA_SERIES = {
  karpim: { name: "Karpim", color: "#7D0B35" },
  karpel: { name: "Karpel", color: "#3C758F" },
} as const;

export type PesertaDatum = {
  regional: Entity;
  total: number;
  karpim: number;
  karpel: number;
} & LevelValues;

const sumLevels = (row: LevelValues, levels: readonly Level[] = LEVELS) =>
  levels.reduce((sum, level) => sum + row[levelKey(level)], 0);

export const pesertaPerRegional: PesertaDatum[] = pesertaRaw.map((row) => ({
  ...row,
  total: sumLevels(row),
  karpim: sumLevels(row, KARPIM_LEVELS),
  karpel: sumLevels(row, KARPEL_LEVELS),
}));

// ── Jam pembelajaran ─────────────────────────────────────────────────────
// Realisasi jam per entity per level BOD; realisasi per entity = jumlah level.
// GET /api/v1/dashboard/jam-pembelajaran
const jamRaw: ({ regional: Entity; target: number } & LevelValues)[] = [
  {
    regional: "HO",
    target: 150,
    level1: 10,
    level2: 15,
    level3: 20,
    level4: 25,
    level5: 30,
    level6: 25,
  },
  {
    regional: "1",
    target: 110,
    level1: 5,
    level2: 10,
    level3: 20,
    level4: 25,
    level5: 30,
    level6: 35,
  },
  {
    regional: "2",
    target: 200,
    level1: 8,
    level2: 15,
    level3: 25,
    level4: 35,
    level5: 45,
    level6: 52,
  },
  {
    regional: "3",
    target: 175,
    level1: 6,
    level2: 12,
    level3: 22,
    level4: 30,
    level5: 38,
    level6: 42,
  },
  {
    regional: "5",
    target: 70,
    level1: 0,
    level2: 2,
    level3: 3,
    level4: 4,
    level5: 5,
    level6: 6,
  },
  {
    regional: "7",
    target: 140,
    level1: 3,
    level2: 7,
    level3: 12,
    level4: 16,
    level5: 20,
    level6: 22,
  },
  {
    regional: "8",
    target: 280,
    level1: 2,
    level2: 6,
    level3: 10,
    level4: 16,
    level5: 20,
    level6: 26,
  },
];

export type JamDatum = {
  regional: Entity;
  target: number;
  realisasi: number;
} & LevelValues;

export const jamPerRegional: JamDatum[] = jamRaw.map((row) => ({
  ...row,
  realisasi: sumLevels(row),
}));

// Target jam per level BOD (konsolidasi). Totalnya sama dengan jumlah
// target per entity di atas.
export const targetJamPerLevel: Record<Level, number> = {
  1: 30,
  2: 90,
  3: 160,
  4: 230,
  5: 280,
  6: 335,
};

// ── Jam per bidang kompetensi ────────────────────────────────────────────
// Bidang sama dengan pilihan "Bidang Pelatihan" di form program pelatihan.
// Total realisasi & target sama dengan konsolidasi jam per entity.
// GET /api/v1/dashboard/jam-per-bidang
export type JamBidangDatum = {
  bidang: string;
  target: number;
  realisasi: number;
};

export const jamPerBidang: JamBidangDatum[] = [
  { bidang: "Tanaman", target: 250, realisasi: 180 },
  { bidang: "Pengolahan", target: 220, realisasi: 150 },
  { bidang: "Teknik", target: 200, realisasi: 120 },
  { bidang: "Keuangan", target: 120, realisasi: 70 },
  { bidang: "SDM", target: 115, realisasi: 130 },
  { bidang: "IT", target: 100, realisasi: 50 },
  { bidang: "Umum", target: 120, realisasi: 60 },
];

// ── Kategori biaya RKAP ──────────────────────────────────────────────────
// 8 kategori pertama masuk grup PSDM, sisanya kategori biasa.
// Anggaran & realisasi tiap entity = jumlah 14 kategorinya.
// GET /api/v1/dashboard/konsolidasi-anggaran?entity=
export type KategoriRkap = {
  name: string;
  group: "PSDM" | null;
  anggaran: number;
  realisasi: number;
};

const kategoriHO: KategoriRkap[] = [
  {
    group: "PSDM",
    name: "Pengembangan BOD & BOC",
    anggaran: 1_500_000_000,
    realisasi: 1_206_502_000,
  },
  {
    group: "PSDM",
    name: "Agro Walet",
    anggaran: 6_000_000_000,
    realisasi: 5_567_910_620,
  },
  {
    group: "PSDM",
    name: "IHT & Public Training",
    anggaran: 3_500_000_000,
    realisasi: 2_980_442_462,
  },
  {
    group: "PSDM",
    name: "Kursus Jabatan",
    anggaran: 3_500_000_000,
    realisasi: 3_197_500_000,
  },
  {
    group: "PSDM",
    name: "Sertifikasi Jabatan",
    anggaran: 3_000_000_000,
    realisasi: 2_739_000_000,
  },
  {
    group: "PSDM",
    name: "Program Study Banding",
    anggaran: 500_000_000,
    realisasi: 295_500_000,
  },
  {
    group: "PSDM",
    name: "Program Pendidikan Lanjut",
    anggaran: 400_000_000,
    realisasi: 150_000_000,
  },
  {
    group: "PSDM",
    name: "Biaya Perjalanan Dinas",
    anggaran: 2_000_000_000,
    realisasi: 1_738_125_000,
  },
  {
    group: null,
    name: "Assessment",
    anggaran: 2_000_000_000,
    realisasi: 1_666_681_250,
  },
  {
    group: null,
    name: "Rekrutmen",
    anggaran: 4_200_000_000,
    realisasi: 3_881_438_023,
  },
  {
    group: null,
    name: "Onboarding",
    anggaran: 6_500_000_000,
    realisasi: 6_355_500_000,
  },
  {
    group: null,
    name: "Program Budaya Perusahaan",
    anggaran: 1_200_000_000,
    realisasi: 996_000_000,
  },
  {
    group: null,
    name: "Konsultasi Pengembangan SDM",
    anggaran: 1_300_000_000,
    realisasi: 1_107_549_308,
  },
  {
    group: null,
    name: "Inovasi & Riset",
    anggaran: 1_805_411_840,
    realisasi: 859_672_000,
  },
];

// Regional baru punya total anggaran & realisasi; rinciannya dibagi ke 14
// kategori mengikuti pola HO supaya jumlahnya tetap persis sama.
const totalRegional: Record<
  Exclude<Entity, "HO">,
  { anggaran: number; realisasi: number }
> = {
  "1": { anggaran: 1_500_000_000, realisasi: 627_917_647 },
  "2": { anggaran: 2_106_943_750, realisasi: 1_866_943_741 },
  "3": { anggaran: 2_260_410_000, realisasi: 1_755_910_000 },
  "5": { anggaran: 3_332_941_750, realisasi: 1_791_510_338 },
  "7": { anggaran: 2_100_000_000, realisasi: 2_151_421_750 },
  "8": { anggaran: 1_114_970_960, realisasi: 651_675_000 },
};

/** Bagi `total` sesuai bobot; sisa pembulatan ditaruh di bagian terakhir */
function allocate(total: number, weights: number[]) {
  const sumWeights = weights.reduce((sum, w) => sum + w, 0);
  const parts = weights.map((w) => Math.floor((total * w) / sumWeights));
  parts[parts.length - 1] += total - parts.reduce((sum, p) => sum + p, 0);
  return parts;
}

function splitLikeHO(total: { anggaran: number; realisasi: number }) {
  const anggaran = allocate(
    total.anggaran,
    kategoriHO.map((k) => k.anggaran),
  );
  const realisasi = allocate(
    total.realisasi,
    kategoriHO.map((k) => k.realisasi),
  );
  return kategoriHO.map((k, i) => ({
    ...k,
    anggaran: anggaran[i],
    realisasi: realisasi[i],
  }));
}

export const kategoriPerEntity: Record<Entity, KategoriRkap[]> = {
  HO: kategoriHO,
  "1": splitLikeHO(totalRegional["1"]),
  "2": splitLikeHO(totalRegional["2"]),
  "3": splitLikeHO(totalRegional["3"]),
  "5": splitLikeHO(totalRegional["5"]),
  "7": splitLikeHO(totalRegional["7"]),
  "8": splitLikeHO(totalRegional["8"]),
};

/** Konsolidasi seluruh entity, per kategori */
export const kategoriKonsolidasi: KategoriRkap[] = kategoriHO.map((k, i) => ({
  ...k,
  anggaran: ENTITIES.reduce(
    (sum, e) => sum + kategoriPerEntity[e][i].anggaran,
    0,
  ),
  realisasi: ENTITIES.reduce(
    (sum, e) => sum + kategoriPerEntity[e][i].realisasi,
    0,
  ),
}));

export const kategoriLabel = (item: KategoriRkap) =>
  item.group ? `${item.group} - ${item.name}` : item.name;

// ── Biaya per regional ───────────────────────────────────────────────────
export type BreakdownItem = {
  kategori: string;
  anggaran: number;
  realisasi: number;
};

export type BiayaRegionalDatum = {
  regional: Entity;
  target: number;
  realisasi: number;
  detail: BreakdownItem[];
};

// Diturunkan dari rincian kategori, jadi total & rincian tidak mungkin beda
// GET /api/v1/dashboard/biaya-per-regional
export const biayaPerRegional: BiayaRegionalDatum[] = ENTITIES.map(
  (regional) => {
    const kategori = kategoriPerEntity[regional];
    return {
      regional,
      target: kategori.reduce((sum, k) => sum + k.anggaran, 0),
      realisasi: kategori.reduce((sum, k) => sum + k.realisasi, 0),
      detail: kategori.map((k) => ({
        kategori: kategoriLabel(k),
        anggaran: k.anggaran,
        realisasi: k.realisasi,
      })),
    };
  },
);

// ── Ringkasan biaya (dipakai card ringkasan & tile KPI) ──────────────────
const maxBy = <T>(items: T[], value: (item: T) => number) =>
  items.reduce((best, item) => (value(item) > value(best) ? item : best));

const entityTertinggi = maxBy(biayaPerRegional, (row) => row.realisasi);

/** Konsolidasi seluruh entity (HO + regional) */
export const ringkasanBiaya = {
  anggaran: biayaPerRegional.reduce((sum, row) => sum + row.target, 0),
  realisasi: biayaPerRegional.reduce((sum, row) => sum + row.realisasi, 0),
  entityTertinggi: {
    regional: entityTertinggi.regional,
    realisasi: entityTertinggi.realisasi,
    kategoriTerbesar: maxBy(entityTertinggi.detail, (d) => d.realisasi)
      .kategori,
  },
};

// ── Format angka ─────────────────────────────────────────────────────────
export const formatNumber = (value: number) => value.toLocaleString("id-ID");

export const formatRupiah = (value: number) =>
  `Rp ${value.toLocaleString("id-ID")}`;

export const formatPercent = (value: number, digits = 1) =>
  `${value.toFixed(digits).replace(".", ",")}%`;

/** 37,4 M / 627,9 jt — untuk label nilai di atas bar */
export const formatCompact = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

/** Rp 32,74 M — ringkas dalam miliar */
export const formatMiliar = (value: number, digits = 2) =>
  `Rp ${(value / 1_000_000_000).toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} M`;

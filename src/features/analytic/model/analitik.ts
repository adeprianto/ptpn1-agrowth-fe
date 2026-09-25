/**
 * Model halaman Analitik Pengembangan SDM: metrik yang bisa dibandingkan,
 * dimensi untuk mengelompokkan/menyaring, dan bentuk hasil agregasinya.
 */
import { Clock, Users, Wallet, type LucideIcon } from "lucide-react";
import { TRAINING_LEARNING_SECTOR_LABEL } from "@/types/api/training";
import {
  ENTITIES,
  LEVELS,
  formatCompact,
  formatEntityName,
  kategoriKonsolidasi,
  kategoriLabel,
  levelLabel,
} from "@/features/dashboard/components/charts/dashboardDummyData";

/** Nilai ringkas untuk label batang & sumbu, mis. "37,4 M" */
export { formatCompact };

// ── Metrik ───────────────────────────────────────────────────────────────

export type MetricKey = "biaya" | "jam" | "peserta";

export interface MetricDef {
  key: MetricKey;
  label: string;
  icon: LucideIcon;
  /** Warna batang chart; sama dengan warna realisasi di dashboard */
  color: string;
}

export const METRICS: MetricDef[] = [
  { key: "biaya", label: "Biaya", icon: Wallet, color: "#2A5432" },
  { key: "jam", label: "Jam Pembelajaran", icon: Clock, color: "#5D1E2E" },
  { key: "peserta", label: "Peserta", icon: Users, color: "#3C758F" },
];

export const metricByKey = Object.fromEntries(METRICS.map((m) => [m.key, m])) as Record<
  MetricKey,
  MetricDef
>;

// ── Dimensi ──────────────────────────────────────────────────────────────

export type DimensionKey = "entity" | "departemen" | "bod" | "bidang" | "rkap";

export interface DimensionDef {
  key: DimensionKey;
  label: string;
  /** Urutan nilai tetap (mis. BOD-1..6); selain itu diurutkan dari nilai terbesar */
  ordered?: boolean;
  values: string[];
}

export const DIMENSIONS: DimensionDef[] = [
  {
    key: "entity",
    label: "Entity",
    ordered: true,
    values: ENTITIES.map(formatEntityName),
  },
  {
    key: "departemen",
    label: "Departemen",
    values: [
      "Tanaman",
      "Teknik & Pengolahan",
      "SDM & Umum",
      "Keuangan & Akuntansi",
      "Kesekretariatan & Humas",
      "Pengadaan",
    ],
  },
  {
    key: "bod",
    label: "Level BOD",
    ordered: true,
    values: LEVELS.map(levelLabel),
  },
  {
    key: "bidang",
    label: "Bidang Pelatihan",
    // sama dengan pilihan "Bidang Pelatihan" di form program pelatihan
    values: Object.values(TRAINING_LEARNING_SECTOR_LABEL),
  },
  {
    key: "rkap",
    label: "Kategori RKAP",
    // 14 kategori biaya RKAP yang sama dengan dashboard
    values: kategoriKonsolidasi.map(kategoriLabel),
  },
];

export const dimensionByKey = Object.fromEntries(
  DIMENSIONS.map((d) => [d.key, d]),
) as Record<DimensionKey, DimensionDef>;

// ── Query & hasil ────────────────────────────────────────────────────────

/** Satu filter aktif. Urutan filter di state = jejak drill-down. */
export interface AnalitikFilter {
  dim: DimensionKey;
  values: string[];
}

export interface AnalitikQuery {
  groupBy: DimensionKey;
  filters: AnalitikFilter[];
  /** YYYY-MM-DD, inklusif */
  dateFrom: string;
  dateTo: string;
}

export interface MetricValues {
  /** Rupiah */
  biaya: number;
  jam: number;
  peserta: number;
}

export interface AnalitikRow extends MetricValues {
  /** Nilai dimensi pengelompokan, mis. "Regional 3" */
  label: string;
}

export interface AnalitikResult {
  rows: AnalitikRow[];
  total: MetricValues;
}

// ── Format ───────────────────────────────────────────────────────────────

const number = (value: number, digits = 0) =>
  value.toLocaleString("id-ID", { maximumFractionDigits: digits });

/** Nilai lengkap, untuk kartu ringkasan, tabel, dan tooltip */
export function formatMetric(metric: MetricKey, value: number): string {
  if (metric === "biaya") {
    if (value >= 1_000_000_000) return `Rp ${number(value / 1_000_000_000, 2)} M`;
    return `Rp ${number(value / 1_000_000, 1)} jt`;
  }
  if (metric === "jam") return `${number(value)} Jam`;
  return `${number(value)} Orang`;
}

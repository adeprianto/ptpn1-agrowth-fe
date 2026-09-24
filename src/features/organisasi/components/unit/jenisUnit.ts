import { Building2, Factory, Sprout, type LucideIcon } from "lucide-react";
import type { BadgeTone } from "@/components/ui";
import type { MasterItem } from "../../model/masterData";

// Tampilan per kategori operasional (operational_categories.code).
// Kategori yang belum didaftarkan di sini pakai nama dari master + warna netral.
interface JenisConfig {
  label?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  tone: BadgeTone;
}

const JENIS_CONFIG: Record<string, JenisConfig> = {
  EST: {
    label: "Kebun",
    icon: Sprout,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    tone: "emerald",
  },
  FAC: {
    label: "Pabrik",
    icon: Factory,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    tone: "amber",
  },
};

const DEFAULT_CONFIG: JenisConfig = {
  icon: Building2,
  iconBg: "bg-slate-100",
  iconColor: "text-slate-500",
  tone: "slate",
};

/** Ikon, warna, dan label tampilan untuk satu kategori operasional. */
export function getUnitTypeDisplay(jenis?: MasterItem | null) {
  const config = (jenis && JENIS_CONFIG[jenis.kode]) || DEFAULT_CONFIG;
  return { ...config, label: config.label ?? jenis?.nama ?? "-" };
}

// Warna badge per komoditas (business_types.code) — tinggal tambah baris kalau perlu
const KOMODITAS_TONE: Record<string, BadgeTone> = {
  TEH: "emerald",
  KOPI: "amber",
  KAKAO: "slate",
  TEMBAKAU: "violet",
  SAWIT: "amber",
  KELAPA: "amber",
  KARET: "blue",
  TEBU: "emerald",
};

/** Warna badge untuk satu komoditas. */
export function getCommodityTone(komoditas: MasterItem): BadgeTone {
  return KOMODITAS_TONE[komoditas.kode] ?? "slate";
}

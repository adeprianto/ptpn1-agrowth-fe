import { Building2, Factory, Sprout, type LucideIcon } from "lucide-react";
import type { MasterRef } from "../../api/masterData";

// Tampilan per kategori operasional (operational_categories.code).
// Kategori yang belum didaftarkan di sini pakai nama dari master + warna netral.
interface JenisConfig {
  label?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  badgeClass: string;
}

const JENIS_CONFIG: Record<string, JenisConfig> = {
  EST: {
    label: "Kebun",
    icon: Sprout,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  FAC: {
    label: "Pabrik",
    icon: Factory,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badgeClass: "bg-amber-100 text-amber-700",
  },
};

const DEFAULT_CONFIG: JenisConfig = {
  icon: Building2,
  iconBg: "bg-slate-100",
  iconColor: "text-slate-500",
  badgeClass: "bg-slate-100 text-slate-600",
};

export function getJenisDisplay(jenis?: MasterRef) {
  const config = (jenis && JENIS_CONFIG[jenis.code]) || DEFAULT_CONFIG;
  return { ...config, label: config.label ?? jenis?.name ?? "-" };
}

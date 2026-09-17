import {
  LayoutDashboard,
  Network,
  Users,
  ClipboardCheck,
  BookOpen,
  Brain,
  GraduationCap,
  UserPlus,
  History,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * Konfigurasi menu sidebar, dikelompokkan sesuai desain.
 *
 * PENTING: mapping `roles` di bawah ini masih ASUMSI AWAL dari sisi FE
 * (belum dikonfirmasi).
 *
 * "Organisasi" sekarang 1 link ke halaman hub (bukan grup berisi
 * Regional+Unit terpisah lagi) — Regional & Unit diakses lewat kartu di
 * halaman hub itu. Role di-set HO+REGIONAL (union dari role Regional-only
 * dan Unit yang HO+REGIONAL) — tolong dicek juga.
 */
export const navigationConfig: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["HO", "REGIONAL", "UNIT"],
      },
      {
        label: "Organisasi",
        href: "/organisasi",
        icon: Network,
        roles: ["HO", "REGIONAL"],
      },
    ],
  },
  {
    label: "SDM",
    items: [
      {
        label: "Pegawai",
        href: "/pegawai",
        icon: Users,
        roles: ["HO", "REGIONAL", "UNIT"],
      },
    ],
  },
  // {
  //   label: "Validasi",
  //   items: [
  //     {
  //       label: "Validasi Pelatihan",
  //       href: "/validasi-pelatihan",
  //       icon: ClipboardCheck,
  //       roles: ["HO", "REGIONAL", "UNIT"],
  //     },
  //   ],
  // },
  // {
  //   label: "Kompetensi",
  //   items: [
  //     {
  //       label: "Master Kompeten",
  //       href: "/kompetensi/master",
  //       icon: BookOpen,
  //       roles: ["HO"],
  //     },
  //   ],
  // },
  // {
  //   label: "Pengembangan SDM",
  //   items: [
  //     {
  //       label: "Program Pengembangan",
  //       href: "/program-pengembangan/daftar",
  //       icon: GraduationCap,
  //       roles: ["HO", "REGIONAL", "UNIT"],
  //     },
  //   ],
  // },
  // {
  //   label: "Laporan",
  //   items: [
  //     {
  //       label: "Laporan",
  //       href: "/laporan",
  //       icon: FileText,
  //       roles: ["HO", "REGIONAL", "UNIT"],
  //     },
  //   ],
  // },
];

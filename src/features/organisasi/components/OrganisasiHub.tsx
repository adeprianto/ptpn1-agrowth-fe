"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Flag,
  GitBranch,
  Landmark,
  Network,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { formatNumber } from "@/lib/format";
import type { Role } from "@/types/auth";
import { getRegionalSummary } from "../api/regional";
import { getHeadOffice } from "../api/headOffice";
import { getPositionTitleCount } from "../api/masterData";
import { getDepartmentCount } from "../api/departemen";
import { cn } from "cn";

interface HubCardData {
  id: string;
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  stat: string;
  colorClass: string;
  /** Kartu hanya tampil untuk tier ini */
  roles?: Role[];
}

interface HubStats {
  karyawanHo?: number;
  regional?: number;
  unit?: number;
  jabatan?: number;
  departemen?: number;
}

export function OrganisasiHub() {
  const { user } = useAuth();
  const [stats, setStats] = useState<HubStats>({});
  const isHo = user.role === "HO";

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    // tiap sumber dipasang terpisah supaya satu yang gagal tidak
    // menghilangkan angka kartu lain
    getRegionalSummary(signal)
      .then((s) =>
        setStats((prev) => ({
          ...prev,
          regional: s.totalRegional,
          unit: s.totalUnit,
        })),
      )
      .catch(() => {});

    // Head Office hanya bisa diakses akun HO
    if (isHo) {
      getHeadOffice(signal)
        .then((ho) =>
          setStats((prev) => ({ ...prev, karyawanHo: ho.jumlahKaryawan })),
        )
        .catch(() => {});
    }

    getPositionTitleCount(signal)
      .then((total) => setStats((prev) => ({ ...prev, jabatan: total })))
      .catch(() => {});

    getDepartmentCount(signal)
      .then((total) => setStats((prev) => ({ ...prev, departemen: total })))
      .catch(() => {});

    return () => controller.abort();
  }, [isHo]);

  const stat = (value: number | undefined, suffix: string) =>
    value === undefined ? "…" : `${formatNumber(value)} ${suffix}`;

  const hubCards: HubCardData[] = [
    {
      id: "head-office",
      href: "/dashboard/organisasi/head-office",
      icon: Landmark,
      title: "Head Office",
      desc: "Kantor pusat PTPN 1 - ringkasan dan daftar karyawan yang ditempatkan di HO.",
      stat: stat(stats.karyawanHo, "Karyawan"),
      colorClass: "bg-slate-200 text-slate-700",
      roles: ["HO"],
    },
    {
      id: "regional",
      href: "/dashboard/organisasi/regional",
      icon: Flag,
      title: "Regional",
      desc: "Kelola wilayah regional di bawah Head Office, termasuk kepala regional dan ringkasan SDM-nya.",
      stat: stat(stats.regional, "Regional"),
      colorClass: "bg-emerald-100 text-emerald-700",
      roles: ["HO", "REGIONAL"],
    },
    {
      id: "unit",
      href: "/dashboard/organisasi/unit",
      icon: Network,
      title: "Unit",
      desc: "Kebun dan pabrik di seluruh wilayah kerja, dikelompokkan per regional dan komoditas.",
      stat: stat(stats.unit, "Unit"),
      colorClass: "bg-amber-100 text-amber-700",
    },
    {
      id: "jabatan",
      href: "/dashboard/organisasi/jabatan",
      icon: Briefcase,
      title: "Master Jabatan",
      desc: "Daftar jabatan beserta Job Group, Job Function, dan Level BOD.",
      stat: stat(stats.jabatan, "Jabatan"),
      colorClass: "bg-blue-100 text-blue-700",
    },
    {
      id: "struktur",
      href: "/dashboard/organisasi/struktur",
      icon: GitBranch,
      title: "Struktur Organisasi",
      desc: "Visualisasi hierarki organisasi dari Head Office sampai Unit dalam bentuk pohon interaktif.",
      stat: "3 Tingkat",
      colorClass: "bg-violet-100 text-violet-700",
    },
    {
      id: "departemen",
      href: "/dashboard/organisasi/departemen",
      icon: Layers,
      title: "Struktur Departemen",
      desc: "Susunan direktorat, divisi, bagian dan seterusnya di dalam tiap entity (HO, Regional, Unit).",
      stat: stat(stats.departemen, "Departemen"),
      colorClass: "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi" },
        ]}
      />

      <PageHeader
        title="Organisasi"
        description="Kelola struktur organisasi PTPN 1 - wilayah kerja, jabatan, dan hierarkinya."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {hubCards
          .filter((card) => !card.roles || card.roles.includes(user.role))
          .map((card) => (
            <HubCard key={card.id} {...card} />
          ))}
      </div>
    </div>
  );
}

function HubCard({
  href,
  icon: Icon,
  title,
  desc,
  stat,
  colorClass,
}: HubCardData) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-300 bg-white p-4 transition hover:border-slate-300 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className={cn(
            // tata letak
            "flex h-11 w-11 items-center justify-center",
            // tampilan — warnanya dikirim pemanggil
            "rounded-xl",
            colorClass,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
      </div>

      <p className="mb-1.5 font-semibold text-slate-800">{title}</p>
      <p className="mb-4 text-sm leading-relaxed text-slate-500">{desc}</p>

      <span className="inline-block rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-400">
        {stat}
      </span>
    </Link>
  );
}

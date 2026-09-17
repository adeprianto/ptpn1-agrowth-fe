import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Flag,
  GitBranch,
  Network,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { regionalRows } from "./regional/regionalDummyData";
import { strukturDepartemen } from "./departemen/masterJabatanDummyData";

interface HubCardData {
  id: string;
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  stat: string;
  colorClass: string;
}

export function OrganisasiHub() {
  const hubCards: HubCardData[] = [
    {
      id: "regional",
      href: "/organisasi/regional",
      icon: Flag,
      title: "Regional",
      desc: "Kelola wilayah regional di bawah Head Office, termasuk kepala regional dan ringkasan SDM-nya.",
      stat: `${regionalRows.length} Regional`,
      colorClass: "bg-emerald-100 text-emerald-700",
    },
    {
      id: "unit",
      href: "/organisasi/unit",
      icon: Network,
      title: "Unit",
      desc: "Kebun dan pabrik di seluruh wilayah kerja, dikelompokkan per regional dan komoditas.",
      stat: "46 Unit", // TODO: ganti dinamis begitu dummy data Unit dibuat
      colorClass: "bg-amber-100 text-amber-700",
    },
    {
      id: "jabatan",
      href: "/organisasi/jabatan",
      icon: Briefcase,
      title: "Master Jabatan",
      desc: "Daftar jabatan beserta Job Family, Job Group, Job Function, dan Level BOD.",
      stat: "24 Jabatan", // TODO: ganti dinamis begitu dummy data Jabatan dibuat
      colorClass: "bg-blue-100 text-blue-700",
    },
    {
      id: "struktur",
      href: "/organisasi/struktur",
      icon: GitBranch,
      title: "Struktur Organisasi",
      desc: "Visualisasi hierarki organisasi dari Head Office sampai Unit dalam bentuk pohon interaktif.",
      stat: "3 Tingkat",
      colorClass: "bg-violet-100 text-violet-700",
    },
    {
      id: "departemen",
      href: "/organisasi/departemen",
      icon: Layers,
      title: "Struktur Departemen",
      desc: "Susunan divisi/bagian di dalam tiap entity (HO, Regional, Unit) — referensi Job Function untuk Master Jabatan.",
      stat: `${strukturDepartemen.length} Departemen`,
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
        {hubCards.map((card) => (
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
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorClass}`}
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

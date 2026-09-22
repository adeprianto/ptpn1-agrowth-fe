"use client";

import {
  Award,
  BadgeCheck,
  BookOpenCheck,
  Briefcase,
  Building2,
  Cake,
  CalendarClock,
  CalendarDays,
  Clock,
  GraduationCap,
  Layers,
  ShieldCheck,
  User,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { DetailPageState } from "@/components/shared/DetailPageState";
import { MetricCard } from "@/components/shared/MetricCard";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  formatMasaKerja,
  formatNumber,
  formatTanggal,
  joinOrDash,
} from "@/lib/format";
import { getPegawaiDetail } from "../api/pegawai";
import { levelBodLabel, type PegawaiDetail as Pegawai } from "../model/pegawai";
import { kompetensiDummy } from "./pegawaiDetailDummyData";
import { PegawaiProfileHeader } from "./PegawaiProfileHeader";
import { InfoListCard, type InfoItem } from "./InfoListCard";
import { RiwayatPelatihanTable } from "./RiwayatPelatihanTable";
import { ProfilKompetensiCard } from "./ProfileKompetensiCard";

interface DetailPegawaiProps {
  id: string;
}

function buildInformasiPribadiItems(pegawai: Pegawai): InfoItem[] {
  return [
    {
      icon: Cake,
      label: "Tempat, Tanggal Lahir",
      value: joinOrDash(
        [pegawai.tempatLahir, pegawai.tanggalLahir && formatTanggal(pegawai.tanggalLahir)],
        ", ",
      ),
    },
    {
      icon: User,
      label: "Usia · Jenis Kelamin",
      value: joinOrDash([
        pegawai.usia !== null ? `${pegawai.usia} Tahun` : null,
        pegawai.jenisKelamin,
      ]),
    },
    {
      icon: GraduationCap,
      label: "Pendidikan Terakhir",
      value: joinOrDash([pegawai.pendidikan, pegawai.jurusan]),
    },
  ];
}

function buildInformasiKepegawaianItems(pegawai: Pegawai): InfoItem[] {
  return [
    {
      icon: Briefcase,
      label: "Status Kepegawaian",
      value: joinOrDash([pegawai.status, pegawai.penugasan]),
    },
    {
      icon: Briefcase,
      label: "Employee Group / Subgroup",
      value: joinOrDash([pegawai.employeeGroup, pegawai.employeeSubgroup], " / "),
    },
    {
      icon: Layers,
      label: "Job Group / Job Function",
      value: joinOrDash([pegawai.jobGroup, pegawai.jobFunction], " / "),
    },
    {
      icon: Building2,
      label: "Personnel Area",
      value: joinOrDash([
        pegawai.penempatanNama,
        pegawai.penempatanInduk,
        pegawai.komoditas,
      ]),
    },
    {
      icon: ShieldCheck,
      label: "Status KSO",
      value: pegawai.ksoNonKso ?? "-",
    },
    {
      icon: BadgeCheck,
      label: "Person Grade · Gol. PHDP",
      value: joinOrDash([pegawai.personGrade, pegawai.golonganPhdp]),
    },
    {
      icon: CalendarDays,
      label: "Tanggal Acuan Masa Kerja",
      value: formatTanggal(pegawai.tanggalAcuanMasaKerja),
    },
    {
      icon: CalendarClock,
      label: "Tanggal Pensiun",
      value: formatTanggal(pegawai.tanggalPensiun),
    },
  ];
}

export function DetailPegawai({ id }: DetailPegawaiProps) {
  const query = useAsyncData((signal) => getPegawaiDetail(id, signal), { deps: [id] });
  const pegawai = query.data;

  if (!pegawai) {
    return (
      <DetailPageState
        query={query}
        resource="pegawai"
        backHref="/pegawai"
        backLabel="Kembali ke daftar Pegawai"
      />
    );
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pegawai", href: "/pegawai" },
          { label: pegawai.nama },
        ]}
      />

      <PegawaiProfileHeader
        nama={pegawai.nama}
        nik={pegawai.nik}
        jabatan={pegawai.jabatan}
        penempatanNama={pegawai.penempatanNama}
        penempatanInduk={pegawai.penempatanInduk}
        backHref="/pegawai"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Masa Kerja"
          value={formatMasaKerja(pegawai.tanggalAcuanMasaKerja)}
          icon={Clock}
        />
        <MetricCard
          label="Pelatihan Diikuti"
          value={`${pegawai.pelatihanDiikuti} Kali`}
          icon={Award}
        />
        <MetricCard
          label="Total Jam Pelatihan"
          value={`${formatNumber(pegawai.totalJamPelatihan)} Jam`}
          icon={BookOpenCheck}
        />
        <MetricCard
          label="Level Jabatan"
          value={levelBodLabel(pegawai.levelBod)}
          icon={Briefcase}
        />
      </div>

      <RiwayatPelatihanTable rows={pegawai.riwayatPelatihan} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <InfoListCard
            title="Informasi Pribadi"
            items={buildInformasiPribadiItems(pegawai)}
          />
          <InfoListCard
            title="Informasi Kepegawaian"
            items={buildInformasiKepegawaianItems(pegawai)}
          />
        </div>

        <div className="space-y-5">
          {/* DUMMY — master kompetensi & penilaian belum ada di backend */}
          <ProfilKompetensiCard
            standarJabatan={pegawai.jabatan ?? "-"}
            rows={kompetensiDummy}
          />
        </div>
      </div>
    </div>
  );
}

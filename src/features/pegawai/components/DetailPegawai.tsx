"use client";

import Link from "next/link";
import { Award, BookOpenCheck, Briefcase, Clock } from "lucide-react";
import {
  Cake,
  GraduationCap,
  Phone,
  MapPin,
  Building2,
  ShieldCheck,
  BadgeCheck,
  CalendarDays,
  User,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { MetricCard } from "@/components/shared/MetricCard";
import { pegawaiRows } from "./pegawaiDummyData";
import { getPegawaiDetail } from "./pegawaiDetailDummyData";
import { PegawaiProfileHeader } from "./PegawaiProfileHeader";
import { InfoListCard, type InfoItem } from "./InfoListCard";
import { RiwayatPelatihanTable } from "./RiwayatPelatihanTable";
import { ProfilKompetensiCard } from "./ProfileKompetensiCard";

interface DetailPegawaiProps {
  id: string;
}

export function DetailPegawai({ id }: DetailPegawaiProps) {
  const pegawai = pegawaiRows.find((row) => row.id === id);

  if (!pegawai) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">Pegawai tidak ditemukan.</p>
        <Link
          href="/pegawai"
          className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:underline"
        >
          Kembali ke daftar Pegawai
        </Link>
      </div>
    );
  }

  const detail = getPegawaiDetail(id);

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
        editHref={`/pegawai/${pegawai.id}/edit`}
      />

      {!detail ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
          Detail lengkap (riwayat pelatihan, kompetensi, dll) untuk pegawai ini
          belum tersedia di data dummy.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Masa Kerja"
              value={detail.masaKerja}
              icon={Clock}
            />
            <MetricCard
              label="Pelatihan Diikuti"
              value={`${detail.pelatihanDiikuti} Kali`}
              icon={Award}
            />
            <MetricCard
              label="Total Jam Pelatihan"
              value={`${detail.totalJamPelatihan} Jam`}
              icon={BookOpenCheck}
            />
            <MetricCard
              label="Jabatan Saat Ini"
              value={detail.jabatanSaatIni}
              icon={Briefcase}
            />
          </div>
          <RiwayatPelatihanTable rows={detail.riwayatPelatihan} />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-5">
              <InfoListCard
                title="Informasi Pribadi"
                items={buildInformasiPribadiItems(detail)}
              />
              <InfoListCard
                title="Informasi Kepegawaian"
                items={buildInformasiKepegawaianItems(detail)}
              />
            </div>

            <div className="space-y-5">
              <ProfilKompetensiCard
                standarJabatan={detail.standarJabatan}
                rows={detail.kompetensi}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function buildInformasiPribadiItems(
  detail: NonNullable<ReturnType<typeof getPegawaiDetail>>,
): InfoItem[] {
  return [
    {
      icon: Cake,
      label: "Tempat, Tanggal Lahir",
      value: detail.informasiPribadi.tempatTanggalLahir,
    },
    {
      icon: User,
      label: "Usia . Jenis Kelamin",
      value: detail.informasiPribadi.usiaJenisKelamin,
    },
    {
      icon: GraduationCap,
      label: "Pendidikan Terakhir",
      value: detail.informasiPribadi.pendidikanTerakhir,
    },
    {
      icon: Phone,
      label: "Nomor Telepon",
      value: detail.informasiPribadi.nomorTelepon,
    },
    { icon: MapPin, label: "Alamat", value: detail.informasiPribadi.alamat },
  ];
}

function buildInformasiKepegawaianItems(
  detail: NonNullable<ReturnType<typeof getPegawaiDetail>>,
): InfoItem[] {
  return [
    {
      icon: Briefcase,
      label: "Status Kepegawaian",
      value: detail.informasiKepegawaian.statusKepegawaian,
    },
    {
      icon: Briefcase,
      label: "Employee Group / Subgroup",
      value: detail.informasiKepegawaian.employeeGroupSubgroup,
    },
    {
      icon: Building2,
      label: "Personnel Area",
      value: detail.informasiKepegawaian.personnelArea,
    },
    {
      icon: ShieldCheck,
      label: "Status KSO",
      value: detail.informasiKepegawaian.statusKso,
    },
    {
      icon: BadgeCheck,
      label: "Person Grade . Gol.PHDP",
      value: detail.informasiKepegawaian.personGradeGolPhdp,
    },
    {
      icon: CalendarDays,
      label: "Tanggal Masuk",
      value: detail.informasiKepegawaian.tanggalMasuk,
    },
  ];
}

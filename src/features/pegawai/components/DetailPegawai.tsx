"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { MetricCard } from "@/components/shared/MetricCard";
import { ApiError } from "@/lib/api-client";
import { getPegawaiDetail, type PegawaiDetail } from "../api/pegawai";
import { kompetensiDummy } from "./pegawaiDetailDummyData";
import { PegawaiProfileHeader } from "./PegawaiProfileHeader";
import { InfoListCard, type InfoItem } from "./InfoListCard";
import { RiwayatPelatihanTable } from "./RiwayatPelatihanTable";
import { ProfilKompetensiCard } from "./ProfileKompetensiCard";
import { formatMasaKerja, formatTanggal } from "./formatTanggal";

interface DetailPegawaiProps {
  id: string;
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; code: number | null; message: string }
  | { status: "ready"; pegawai: PegawaiDetail };

export function DetailPegawai({ id }: DetailPegawaiProps) {
  // Hasil disimpan bersama id-nya; kalau id berubah, otomatis dianggap loading
  const [loaded, setLoaded] = useState<{ id: string; state: LoadState } | null>(
    null,
  );
  const state: LoadState =
    loaded?.id === id ? loaded.state : { status: "loading" };

  useEffect(() => {
    const controller = new AbortController();
    getPegawaiDetail(id, controller.signal)
      .then((pegawai) => setLoaded({ id, state: { status: "ready", pegawai } }))
      .catch((e: Error) => {
        if (controller.signal.aborted) return;
        setLoaded({
          id,
          state: {
            status: "error",
            code: e instanceof ApiError ? e.status : null,
            message: e.message,
          },
        });
      });
    return () => controller.abort();
  }, [id]);

  if (state.status === "loading") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
        Memuat data pegawai...
      </div>
    );
  }

  if (state.status === "error") {
    const message =
      state.code === 404
        ? "Pegawai tidak ditemukan."
        : state.code === 403
          ? "Anda tidak memiliki akses ke data pegawai ini."
          : `Gagal memuat data pegawai: ${state.message}`;

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">{message}</p>
        <Link
          href="/pegawai"
          className="mt-3 inline-block text-sm font-medium text-emerald-600 hover:underline"
        >
          Kembali ke daftar Pegawai
        </Link>
      </div>
    );
  }

  const { pegawai } = state;

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
          value={`${pegawai.totalJamPelatihan.toLocaleString("id-ID")} Jam`}
          icon={BookOpenCheck}
        />
        <MetricCard
          label="Level Jabatan"
          value={pegawai.levelBod ? `BOD-${pegawai.levelBod}` : "-"}
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

const joinOrDash = (values: (string | null | undefined)[], separator = " · ") =>
  values.filter(Boolean).join(separator) || "-";

function buildInformasiPribadiItems(p: PegawaiDetail): InfoItem[] {
  return [
    {
      icon: Cake,
      label: "Tempat, Tanggal Lahir",
      value: joinOrDash(
        [p.tempatLahir, p.tanggalLahir && formatTanggal(p.tanggalLahir)],
        ", ",
      ),
    },
    {
      icon: User,
      label: "Usia · Jenis Kelamin",
      value: joinOrDash([p.usia !== null ? `${p.usia} Tahun` : null, p.jenisKelamin]),
    },
    {
      icon: GraduationCap,
      label: "Pendidikan Terakhir",
      value: joinOrDash([p.pendidikan, p.jurusan]),
    },
  ];
}

function buildInformasiKepegawaianItems(p: PegawaiDetail): InfoItem[] {
  return [
    {
      icon: Briefcase,
      label: "Status Kepegawaian",
      value: joinOrDash([p.status, p.penugasan]),
    },
    {
      icon: Briefcase,
      label: "Employee Group / Subgroup",
      value: joinOrDash([p.employeeGroup, p.employeeSubgroup], " / "),
    },
    {
      icon: Layers,
      label: "Job Group / Job Function",
      value: joinOrDash([p.jobGroup, p.jobFunction], " / "),
    },
    {
      icon: Building2,
      label: "Personnel Area",
      value: joinOrDash([p.penempatanNama, p.penempatanInduk, p.komoditas]),
    },
    {
      icon: ShieldCheck,
      label: "Status KSO",
      value: p.ksoNonKso ?? "-",
    },
    {
      icon: BadgeCheck,
      label: "Person Grade · Gol. PHDP",
      value: joinOrDash([p.personGrade, p.golonganPhdp]),
    },
    {
      icon: CalendarDays,
      label: "Tanggal Acuan Masa Kerja",
      value: formatTanggal(p.tanggalAcuanMasaKerja),
    },
    {
      icon: CalendarClock,
      label: "Tanggal Pensiun",
      value: formatTanggal(p.tanggalPensiun),
    },
  ];
}

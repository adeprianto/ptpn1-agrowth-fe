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
import { ApiError } from "@/lib/http-client";
import { getPegawaiDetail } from "../api/pegawai";
import type { EmployeeResource } from "@/types/api/employee";
import { kompetensiDummy } from "./pegawaiDetailDummyData";
import { PegawaiProfileHeader } from "./PegawaiProfileHeader";
import { InfoListCard, type InfoItem } from "./InfoListCard";
import { RiwayatPelatihanTable } from "./RiwayatPelatihanTable";
import { ProfilKompetensiCard } from "./ProfileKompetensiCard";
import { formatMasaKerja, formatTanggal } from "./formatTanggal";

interface DetailPegawaiProps {
  id: number;
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; code: number | null; message: string }
  | { status: "ready"; pegawai: EmployeeResource };

export function DetailPegawai({ id }: DetailPegawaiProps) {
  // Hasil disimpan bersama id-nya; kalau id berubah, otomatis dianggap loading
  const [loaded, setLoaded] = useState<{ id: number; state: LoadState } | null>(
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
          { label: pegawai.nama_lengkap || pegawai.name },
        ]}
      />

      <PegawaiProfileHeader
        nama={pegawai.nama_lengkap || pegawai.name}
        nik={pegawai.nik}
        jabatan={pegawai.jabatan?.name ?? null}
        penempatanNama={pegawai.entity?.name ?? "-"}
        penempatanInduk={pegawai.entity?.parent?.name ?? null}
        backHref="/pegawai"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Masa Kerja"
          value={formatMasaKerja(pegawai.tanggal_acuan_masa_kerja)}
          icon={Clock}
        />
        <MetricCard
          label="Pelatihan Diikuti"
          value={`${pegawai.pelatihan?.total_diikuti ?? 0} Kali`}
          icon={Award}
        />
        <MetricCard
          label="Total Jam Pelatihan"
          value={`${(pegawai.pelatihan?.total_jam ?? 0).toLocaleString("id-ID")} Jam`}
          icon={BookOpenCheck}
        />
        <MetricCard
          label="Level Jabatan"
          value={pegawai.jabatan?.level_bod ? `BOD-${pegawai.jabatan.level_bod}` : "-"}
          icon={Briefcase}
        />
      </div>

      <RiwayatPelatihanTable rows={pegawai.pelatihan?.riwayat ?? []} />

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
            standarJabatan={pegawai.jabatan?.name ?? "-"}
            rows={kompetensiDummy}
          />
        </div>
      </div>
    </div>
  );
}

const joinOrDash = (values: (string | null | undefined)[], separator = " · ") =>
  values.filter(Boolean).join(separator) || "-";

/** Backend menyimpan "L"/"P" seperti di SAP. */
const jenisKelaminLabel = (value: "L" | "P" | null) =>
  value === "L" ? "Laki-laki" : value === "P" ? "Perempuan" : null;

function buildInformasiPribadiItems(p: EmployeeResource): InfoItem[] {
  return [
    {
      icon: Cake,
      label: "Tempat, Tanggal Lahir",
      value: joinOrDash(
        [p.tempat_lahir, p.tanggal_lahir && formatTanggal(p.tanggal_lahir)],
        ", ",
      ),
    },
    {
      icon: User,
      label: "Usia · Jenis Kelamin",
      value: joinOrDash([p.usia !== null ? `${p.usia} Tahun` : null, jenisKelaminLabel(p.jenis_kelamin)]),
    },
    {
      icon: GraduationCap,
      label: "Pendidikan Terakhir",
      value: joinOrDash([p.pendidikan, p.jurusan]),
    },
  ];
}

function buildInformasiKepegawaianItems(p: EmployeeResource): InfoItem[] {
  return [
    {
      icon: Briefcase,
      label: "Status Kepegawaian",
      value: joinOrDash([p.status, p.penugasan]),
    },
    {
      icon: Briefcase,
      label: "Employee Group / Subgroup",
      value: joinOrDash([p.employee_group, p.employee_subgroup], " / "),
    },
    {
      icon: Layers,
      label: "Job Group / Job Function",
      value: joinOrDash([p.jabatan?.job_group?.name, p.jabatan?.job_function?.name], " / "),
    },
    {
      icon: Building2,
      label: "Personnel Area",
      value: joinOrDash([p.entity?.name, p.entity?.parent?.name, p.komoditas?.name]),
    },
    {
      icon: ShieldCheck,
      label: "Status KSO",
      value: p.kso_non_kso ?? "-",
    },
    {
      icon: BadgeCheck,
      label: "Person Grade · Gol. PHDP",
      value: joinOrDash([p.person_grade, p.golongan_phdp]),
    },
    {
      icon: CalendarDays,
      label: "Tanggal Acuan Masa Kerja",
      value: formatTanggal(p.tanggal_acuan_masa_kerja),
    },
    {
      icon: CalendarClock,
      label: "Tanggal Pensiun",
      value: formatTanggal(p.tanggal_pensiun),
    },
  ];
}

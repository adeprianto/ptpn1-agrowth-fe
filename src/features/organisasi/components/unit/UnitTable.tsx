"use client";

import Link from "next/link";
import { Factory, Sprout, Users, MapPin, Building2 } from "lucide-react";
import type { UnitRow } from "./unitDummyData"; // sesuaikan path import-nya

interface UnitTableProps {
  rows: UnitRow[];
  onEditClick: (row: UnitRow) => void;
  onDeleteClick: (row: UnitRow) => void;
}

// Konfigurasi tampilan per tipe unit (icon + warna icon + warna badge)
type TipeConfig = {
  icon: typeof Factory;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
};

const TIPE_CONFIG: Record<string, TipeConfig> = {
  Pabrik: {
    icon: Factory,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
  },
  Kebun: {
    icon: Sprout,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
  },
};

// Fallback kalau ada tipe baru yang belum didaftarkan di atas
const DEFAULT_TIPE_CONFIG: TipeConfig = {
  icon: Building2,
  iconBg: "bg-slate-100",
  iconColor: "text-slate-500",
  badgeBg: "bg-slate-100",
  badgeText: "text-slate-600",
};

// Warna badge per komoditas — tinggal tambah baris baru kalau ada komoditas lain
const KOMODITAS_COLOR: Record<string, string> = {
  Teh: "bg-teal-100 text-teal-700",
  Kopi: "bg-orange-100 text-orange-700",
  Coklat: "bg-stone-100 text-stone-700",
  Tembakau: "bg-lime-100 text-lime-700",
  Sawit: "bg-yellow-100 text-yellow-700",
};

const DEFAULT_KOMODITAS_COLOR = "bg-slate-100 text-slate-600";

export function UnitTable({
  rows,
  onEditClick,
  onDeleteClick,
}: UnitTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white">
      <table className="w-full min-w-200 text-left text-sm">
        <thead>
          <tr className="border-b border-slate-300 text-xs font-medium uppercase tracking-wide text-slate-400">
            <th className="px-6 py-4">No</th>
            <th className="px-6 py-4">Unit</th>
            <th className="px-6 py-4">Regional</th>
            <th className="px-6 py-4">Kategori</th>
            <th className="px-6 py-4">Komoditas</th>
            <th className="px-6 py-4">Karyawan</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const tipeConfig = TIPE_CONFIG[row.tipe] ?? DEFAULT_TIPE_CONFIG;
            const TipeIcon = tipeConfig.icon;
            const komoditasColor =
              KOMODITAS_COLOR[row.komoditas] ?? DEFAULT_KOMODITAS_COLOR;

            return (
              <tr
                key={row.id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-800">{row.id}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${tipeConfig.iconBg}`}
                    >
                      <TipeIcon className={`h-4 w-4 ${tipeConfig.iconColor}`} />
                    </span>
                    <div className="">
                      <p className="font-medium text-slate-800">{row.name}</p>
                      <p className="text-xs text-slate-400">{row.kode}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="h-4 w-4 text-slate-300" />
                    {row.regional}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${tipeConfig.badgeBg} ${tipeConfig.badgeText}`}
                  >
                    {row.tipe}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${komoditasColor}`}
                  >
                    {row.komoditas}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Users className="h-4 w-4 text-slate-300" />
                    {row.jumlahKaryawan}
                  </span>
                </td>
                {/* <td className="px-6 py-4 text-slate-600">{row.kepalaUnit}</td> */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/organisasi/unit/${row.id}`}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-200"
                    >
                      Detail
                    </Link>
                    <button
                      onClick={() => onEditClick(row)}
                      className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClick(row)}
                      className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-10 text-center text-sm text-slate-400"
              >
                Tidak ada unit yang cocok dengan pencarian/filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

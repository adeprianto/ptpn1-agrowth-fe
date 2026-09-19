"use client";

import Link from "next/link";
import type { PelatihanRow } from "./programPelatihanDummyData";

interface PelatihanTableProps {
    rows: PelatihanRow[];
}

const jenisPsdmBadgeClass: Record<PelatihanRow["jenisPsdm"], string> = {
    "Pengembangan BOD/BOC": "bg-blue-700 text-white",
    "Agrowallet": "bg-green-100 text-green-700",
    "IHT": "bg-sky-100 text-sky-700",
    "Public Training": "bg-purple-700 text-white",
    "Kursus Jabatan": "bg-purple-200 text-purple-800",
    "Benchmarking": "bg-orange-200 text-orange-800",
    "Program Budaya": "bg-yellow-200 text-yellow-800",
    "Sertifikasi": "bg-teal-700 text-white",
};

export function PelatihanTable({ rows }: PelatihanTableProps) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white">
            <table className="w-full min-w-200 text-left text-sm">
                <thead>
                <tr className="border-b border-slate-300 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-4">No</th>
                    <th className="px-6 py-4">Nama Pelatihan</th>
                    <th className="px-6 py-4">Penyelenggara</th>
                    <th className="px-6 py-4">Jenis Pengembangan SDM</th>
                    <th className="px-6 py-4">Jenis Kompetensi</th>
                    <th className="px-6 py-4">Bidang</th>
                    <th className="px-6 py-4 text-right">Action</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((row, index) => (
                    <tr key={row.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-6 py-4">
                            <p className="font-medium text-slate-800">{index + 1}</p>
                        </td>
                        <td className="px-6 py-4">
                            <div>
                                <p className="font-medium text-slate-800">{row.nama}</p>
                            </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                            <div>
                                <p className="font-medium text-slate-800">
                                    {row.penyelenggara}
                                </p>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div>
                                <p className="font-medium text-slate-800">{row.jenisKompetensi}</p>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span
                                className={`rounded-full whitespace-nowrap px-3 py-1 text-xs font-medium ${jenisPsdmBadgeClass[row.jenisPsdm]}`}
                            >
                              {row.jenisPsdm}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div>
                                <p className="font-medium text-slate-800">{row.bidang}</p>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                                <Link
                                    href={`/pegawai/${row.id}`}
                                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-200"
                                >
                                    Detail
                                </Link>
                                <button
                                    type="button"
                                    className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}

                {rows.length === 0 && (
                    <tr>
                        <td
                            colSpan={7}
                            className="px-6 py-10 text-center text-sm text-slate-400"
                        >
                            Tidak ada pegawai yang cocok dengan pencarian/filter.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

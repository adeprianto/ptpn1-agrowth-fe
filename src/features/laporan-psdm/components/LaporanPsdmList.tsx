import {Breadcrumb} from "@/components/shared/Breadcrumb";
import {PageHeader} from "@/components/shared/PageHeader";
import Link from "next/link";
import {
    Boxes,
    Building2,
    Landmark,
    Plus,
    FilePlus,
    Upload,
    Download,
    Hourglass, Trash2
} from "lucide-react";
import {SummaryStatCard} from "@/components/shared/SummaryStatCard";

export default function LaporanPsdmList() {
    return <div className="space-y-4">
        <Breadcrumb
            items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Laporan Realisasi PSDM" },
            ]}
        />

        <PageHeader
            title="Laporan Realisasi PSDM"
            description="Data laporan realisasi PSDM PTPN 1 di semua regional dan unit"
            action={
                <Link
                    href="/laporan-psdm/create"
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Laporan Realisasi
                </Link>
            }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryStatCard label="Total Realisasi Biaya" value="4.200" icon={Boxes} />
            <SummaryStatCard label="Total Jam Pembelajaran" value="300" icon={Landmark} />
            <SummaryStatCard label="Total Peserta" value="600" icon={Building2} />
        </div>

        <div className="relative mx-auto w-full overflow-hidden rounded-lg bg-white p-10 shadow-sm border border-slate-300">
            {/* Latar Belakang Gradien Kiri & Kanan */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-64 bg-linear-to-r from-green-50/70 to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-64 bg-linear-to-l from-green-50/70 to-transparent"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Ilustrasi Ikon */}
                <div className="relative mb-6 flex h-36 w-36 items-center justify-center rounded-3xl bg-gray-50/50">
                    <div className="absolute inset-2 rounded-full border-2 border-dashed border-gray-200"></div>
                    <div className="relative flex h-24 w-20 flex-col items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
                        {/* Hiasan Dokumen */}
                        <div className="mb-2 h-1 w-8 rounded-full bg-gray-200"></div>
                        <div className="mb-2 h-1 w-12 rounded-full bg-gray-200"></div>
                        <div className="mb-2 h-1 w-10 rounded-full bg-gray-200"></div>
                        <div className="mt-2 flex w-full justify-around px-2">
                            <div className="h-4 w-2 rounded-sm bg-gray-200"></div>
                            <div className="h-6 w-2 rounded-sm bg-gray-200"></div>
                            <div className="h-5 w-2 rounded-sm bg-green-400"></div>
                        </div>

                        {/* Lencana Kecil Ikon */}
                        <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-500">
                            <Hourglass size={14} />
                        </div>
                        <div className="absolute -bottom-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#004d40] shadow-sm text-white border-2 border-white">
                            <Trash2 size={18} />
                        </div>
                    </div>
                </div>

                {/* Lencana Status */}
                <span className="mb-6 rounded-full bg-gray-200 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-600">
                  Status Rekapitulasi: Nihil
                </span>

                {/* Tajuk dan Penerangan */}
                <h2 className="mb-4 text-3xl font-bold text-[#003d2b]">
                    Belum Ada Data Laporan Realisasi PSDM
                </h2>
                <p className="mb-10 max-w-3xl text-sm leading-relaxed text-gray-600">
                    Data rekapitulasi realisasi pengembangan SDM untuk seluruh Regional (Head Office,
                    REG01 s/d REG08) dan Unit Kerja belum tersedia untuk periode Tahun Anggaran yang
                    dipilih. Mulai laporkan kegiatan pelatihan yang telah selesai atau impor data dari
                    spreadsheet.
                </p>

                {/* Butang Tindakan */}
                <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
                    <button className="flex items-center gap-2 rounded-lg bg-[#006b4a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00573c]">
                        <FilePlus size={18} />
                        + Buat Laporan Realisasi Pertama
                    </button>

                    <button className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-100 px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100">
                        <Upload size={18} />
                        Unggah File Excel / Integrasi API
                    </button>

                    <button className="flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50">
                        <Download size={18} />
                        Unduh Template (.xlsx 34 Kolom)
                    </button>
                </div>

            </div>
        </div>

    </div>
}

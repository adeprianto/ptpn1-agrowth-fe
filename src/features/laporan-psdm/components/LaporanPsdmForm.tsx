'use client'

import {Breadcrumb} from "@/components/shared/Breadcrumb";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";
import FormFieldFile from "@/components/shared/FormFieldFile";
import {FormField, formInputClass, formInputDisableClass} from "@/components/shared/FormField";

export default function LaporanPsdmForm() {
    return <div className="space-y-5">
        <Breadcrumb
            items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Laporan Realisasi Pengambangan SDM", href: "/laporan-psdm" },
                { label: "Tambah Laporan Realisasi PSDM" },
            ]}
        />

        <div className="flex items-center gap-4">
            <Link
                href="/laporan-psdm"
                aria-label="Kembali ke daftar laporan realisasi PSDM"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50"
            >
                <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Tambah Laporan Realisasi Pengambangan SDM
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Lengkapi Data Laporan Realisasi Pengambangan SDM
                </p>
            </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-slate-900">
                Rincian Pelatihan
                <p className="mt-1 text-xs font-medium text-slate-400 block"></p>
            </h2>

            <div className="space-y-5">
                <FormField label="Nama Pelatihan">
                    <input
                        type="text"
                        value='Financial Talk "Launching Financial Guidebook & Talkshow Individual Tax"'
                        required
                        disabled
                        className={formInputDisableClass}
                    />
                </FormField>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField label="Penyelenggara Pelatihan">
                        <input
                            value="Executive Strategic Management for Plantation"
                            type="text"
                            required
                            disabled
                            className={formInputDisableClass}
                        />
                    </FormField>

                    <FormField label="Jenis Pengembangan SDM">
                        <input
                            value="Pengembangan BOD/BOC"
                            type="text"
                            required
                            disabled
                            className={formInputDisableClass}
                        />
                    </FormField>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <FormField label="Jenis Kompetensi">
                        <input
                            value="Hard Competency"
                            type="text"
                            required
                            disabled
                            className={formInputDisableClass}
                        />
                    </FormField>

                    <FormField label="Bidang">
                        <input
                            value="Operational"
                            type="text"
                            required
                            disabled
                            className={formInputDisableClass}
                        />
                    </FormField>

                    <FormField label="Alokasi Pembiayaan Pelatihan">
                        <input
                            value="PSDM - Pengembangan BOD & BOC"
                            type="text"
                            required
                            disabled
                            className={formInputDisableClass}
                        />
                    </FormField>
                </div>

                <FormField label="Deskripsi Pelatihan">
                        <textarea
                            value="Pengembangan wawasan strategis dan pengambilan keputusan untuk optimalisasi aset oleh jajaran Direksi dan Komisaris."
                            rows={3}
                            disabled
                            className={formInputDisableClass}
                        />
                </FormField>
            </div>
        </div>

        <form onSubmit={() => {}} className="space-y-5">
            {/*====================== Waktu & Lokasi Pelatihan =======================*/}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                    Waktu & Lokasi Pelatihan
                </h2>

                <div className="space-y-5">
                    <FormField label="Nama PIC" required>
                        <input
                            type="text"
                            required
                            placeholder="Cth. PT. MarkPlus Indonesia"
                            className={formInputClass}
                        />
                    </FormField>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <FormField label="Tanggal Mulai" required>
                            <input
                                type="date"
                                placeholder=""
                                className={formInputClass}
                            />
                        </FormField>

                        <FormField label="Tanggal Akhir" required>
                            <input
                                type="date"
                                placeholder=""
                                className={formInputClass}
                            />
                        </FormField>

                        <FormField label="Metode Pelatihan" required>
                            <select required defaultValue="" className={formInputClass}>
                                <option value="" disabled>
                                    Pilih...
                                </option>
                                <option value="1">Offline</option>
                                <option value="2">Online</option>
                                <option value="3">Hybrid</option>
                            </select>
                        </FormField>

                        <FormField label="Lokasi Pelatihan" required>
                            <input
                                type="text"
                                required
                                placeholder="Cth. Kota Jakarta"
                                className={formInputClass}
                            />
                        </FormField>
                    </div>

                    <FormField label="Alamat Lokasi Pelatihan">
                        <textarea
                            rows={3}
                            placeholder="Cth. Jl. H. R. Rasuna Said, RT.7/RW.4, Kuningan Timur, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12950"
                            className={formInputClass}
                        />
                    </FormField>
                </div>
            </div>

            {/*====================== Durasi Pelatihan =======================*/}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                    Durasi Pelatihan
                    <p className="mt-1 text-xs font-medium text-slate-400 block">Durasi pembelajaran dalam jam per hari (jam/hari)</p>
                </h2>

                <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <FormField label="Experiental Learning" hint="On the job, praktek langsung, action learning." required>
                            <input
                                type="text"
                                required
                                placeholder="Jam/Hari"
                                className={formInputClass}
                            />
                        </FormField>

                        <FormField label="Social Learning" hint="Mentoring, diskusi kelompok, peer review." required>
                            <input
                                type="text"
                                required
                                placeholder="Jam/Hari"
                                className={formInputClass}
                            />
                        </FormField>

                        <FormField label="Formal Learning" hint="Presentasi materi, workshop kurikulum, tes." required>
                            <input
                                type="text"
                                required
                                placeholder="Jam/Hari"
                                className={formInputClass}
                            />
                        </FormField>
                    </div>

                    <FormField label="Alamat Lokasi Pelatihan">
                        <textarea
                            rows={3}
                            placeholder="Cth. Jl. H. R. Rasuna Said, RT.7/RW.4, Kuningan Timur, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12950"
                            className={formInputClass}
                        />
                    </FormField>
                </div>
            </div>

            {/*====================== Biaya Pelatihan =======================*/}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                    Biaya Pelatihan
                    <p className="mt-1 text-xs font-medium text-slate-400 block">Durasi pembelajaran dalam jam per hari (jam/hari)</p>
                </h2>

                <div className="space-y-5">
                    <FormField label="Biaya Pelatihan" hint="On the job, praktek langsung, action learning." required>
                        <input
                            type="number"
                            required
                            placeholder="Rp"
                            className={formInputClass}
                        />
                    </FormField>
                </div>
            </div>

            {/*====================== Biaya BPD =======================*/}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                    Biaya Perjalanan Dinas
                    <p className="mt-1 text-xs font-medium text-slate-400 block">Durasi pembelajaran dalam jam per hari (jam/hari)</p>
                </h2>

                <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <FormField label="Biaya Transport">
                            <input
                                type="number"
                                required
                                placeholder="Rp"
                                className={formInputClass}
                            />
                        </FormField>

                        <FormField label="Biaya Per Diem">
                            <input
                                type="number"
                                required
                                placeholder="Rp"
                                className={formInputClass}
                            />
                        </FormField>

                        <FormField label="Biaya Penginapan">
                            <input
                                type="number"
                                required
                                placeholder="Rp/Orang"
                                className={formInputClass}
                            />
                        </FormField>
                    </div>

                    <FormField label="Total Biaya BPD">
                        <input
                            type="number"
                            required
                            placeholder="Rp"
                            className={formInputDisableClass}
                        />
                    </FormField>
                </div>
            </div>

            {/*====================== Total Biaya =======================*/}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                    Total Biaya
                    <p className="mt-1 text-xs font-medium text-slate-400 block">Total biaya pelatihan + biaya perjalanan dinas</p>
                </h2>

                <input
                    type="number"
                    required
                    disabled
                    placeholder="Rp"
                    className={formInputDisableClass}
                />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                    Informasi Peserta
                </h2>

                <FormFieldFile />
            </div>

            <div className="flex justify-end gap-2">
                <Link
                    href="/laporan-psdm"
                    className="rounded-xl bg-slate-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-500"
                >
                    Batal
                </Link>
                <button
                    type="submit"
                    className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
                >
                    Simpan Penyelenggara
                </button>
            </div>
        </form>
    </div>
}

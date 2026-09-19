'use client'

import {Breadcrumb} from "@/components/shared/Breadcrumb";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";
import {FormField, formInputClass} from "@/components/shared/FormField";

export default function TambahPelatihanForm() {
    return <div className="space-y-5">
        <Breadcrumb
            items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Program Pelatihan", href: "/program-pelatihan" },
                { label: "Tambah Program Pelatihan" },
            ]}
        />

        <div className="flex items-center gap-4">
            <Link
                href="/program-pelatihan"
                aria-label="Kembali ke daftar program pelatihan"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50"
            >
                <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Tambah Program Pelatihan Baru
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Lengkapi Data Progam Pelatihan
                </p>
            </div>
        </div>

        <form onSubmit={() => {}} className="space-y-5">
            {/* ---------- Data Program Pelatihan ---------- */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                    Data Pelatihan
                </h2>

                <div className="space-y-5">
                    <FormField label="Nama Pelatihan" required>
                        <input
                            type="text"
                            required
                            placeholder="Cth. Agribusiness Investment Management Series (AIMS)"
                            className={formInputClass}
                        />
                    </FormField>

                    <FormField label="Penyelenggara Pelatihan" required>
                        <select required defaultValue="" className={formInputClass}>
                            <option value="" disabled>
                                Pilih...
                            </option>
                            <option value="1">LPP Agro Nusantara</option>
                            <option value="2">PT. MarkPlus Indonesia</option>
                            <option value="3">Balai Besar Pelatihan Manajemen dan Kepemimpinan Pertanian</option>
                            <option value="4">CV Solusi SDM Mandiri</option>
                        </select>
                    </FormField>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <FormField label="Jenis Pengembangan SDM" required>
                            <select required defaultValue="" className={formInputClass}>
                                <option value="" disabled>
                                    Pilih...
                                </option>
                                <option value="bod_boc">Pengembangan BOD/BOC</option>
                                <option value="agrowallet">Agrowallet</option>
                                <option value="iht">In House Training</option>
                                <option value="public_training">Public Training</option>
                                <option value="kursus_jabatan">Kursus Jabatan</option>
                                <option value="benchmarking">Benchmarking</option>
                                <option value="program_budaya">Program Budaya</option>
                                <option value="Sertifikasi">Sertifikasi</option>
                            </select>
                        </FormField>

                        <FormField label="Jenis Kompetensi Pelatihan" required>
                            <select required defaultValue="" className={formInputClass}>
                                <option value="" disabled>
                                    Pilih...
                                </option>
                                <option value="hard">Hard Competency</option>
                                <option value="soft">Soft Competency</option>
                                <option value="hard_soft">Hard Competency & Soft Competency</option>
                            </select>
                        </FormField>

                        <FormField label="Bidang Pelatihan" required>
                            <select required defaultValue="" className={formInputClass}>
                                <option value="" disabled>
                                    Pilih...
                                </option>
                                <option value="tanaman">Tanaman</option>
                                <option value="pengolahan">Pengolahan</option>
                                <option value="teknik">Teknik</option>
                                <option value="keuangan">Keuangan</option>
                                <option value="sdm">SDM</option>
                                <option value="ti">IT</option>
                                <option value="umum">Umum</option>
                            </select>
                        </FormField>

                        <FormField label="Alokasi Anggaran Pembiayaan" required>
                            <select required defaultValue="" className={formInputClass}>
                                <option value="" disabled>
                                    Pilih...
                                </option>
                                <option value="psdm_bod_boc">PSDM - Pengembangan BOD & BOC</option>
                                <option value="agrowallet">PSDM - Agro Wallet</option>
                                <option value="iht_public_training">PSDM - IHT dan Public Training</option>
                                <option value="pldp">PSDM - Kursus Jabatan (PLDP)</option>
                                <option value="sertifikasi_jabatan">PSDM - Sertifikasi Jabatan</option>
                                <option value="benchmarking">PSDM - Program Study Banding (Benchmarking)</option>
                                <option value="pendidikan_lanjutan">PSDM - Program Pendidikan Lanjutan</option>
                                <option value="assesment">Assesment</option>
                                <option value="rekrutmen">Rekrutmen</option>
                                <option value="onboarding">Onboarding</option>
                                <option value="program_budaya_perusahaan">Program Budaya Perusahaan</option>
                                <option value="konsultasi_pengembangan_sdm">Konsultasi Pengembangan SDM</option>
                                <option value="inovasi_riset">Inovasi dan Riset</option>
                            </select>
                        </FormField>
                    </div>

                    <FormField label="Deskripsi Pelatihan">
                      <textarea
                          rows={3}
                          placeholder="Dekripsi mengenai pelatihan"
                          className={formInputClass}
                      />
                    </FormField>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Link
                    href="/program-pelatihan"
                    className="rounded-xl bg-slate-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-500"
                >
                    Batal
                </Link>
                <button
                    type="submit"
                    className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
                >
                    Simpan Pelatihan
                </button>
            </div>
        </form>
    </div>
}

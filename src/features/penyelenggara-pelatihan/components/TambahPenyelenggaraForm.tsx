"use client";

import {Breadcrumb} from "@/components/shared/Breadcrumb";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";
import {FormField, formInputClass} from "@/components/shared/FormField";

export default function TambahPenyelenggaraForm() {
    return <div className="space-y-5">
        <Breadcrumb
            items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Data Penyelenggara", href: "/penyelenggara-pelatihan" },
                { label: "Tambah Penyelenggara" },
            ]}
        />

        <div className="flex items-center gap-4">
            <Link
                href="/penyelenggara-pelatihan"
                aria-label="Kembali ke daftar penyelenggara"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50"
            >
                <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Tambah Penyelenggara Pelatihan Baru
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Lengkapi Identitas Penyelenggara Pelatihan
                </p>
            </div>
        </div>

        <form onSubmit={() => {}} className="space-y-5">
            {/* ---------- Informasi Penyelenggara ---------- */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                    Informasi Penyelenggara
                </h2>

                <div className="space-y-5">
                    <FormField label="Nama Penyelenggara" required>
                        <input
                            type="text"
                            required
                            placeholder="Cth. PT. MarkPlus Indonesia"
                            className={formInputClass}
                        />
                    </FormField>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <FormField label="Jenis Penyelenggara" required>
                            <select required defaultValue="" className={formInputClass}>
                                <option value="" disabled>
                                    Pilih...
                                </option>
                                <option value="lpp">Lembaga Pendidikan Perkebunan (LPP)</option>
                                <option value="internal">Internal PTPN Group</option>
                                <option value="internal">Eksternal PTPN Group</option>
                            </select>
                        </FormField>

                        <FormField label="Nomor Telpon">
                            <input
                                type="text"
                                placeholder="0812-xxxx-xxxx"
                                className={formInputClass}
                            />
                        </FormField>

                        <FormField label="E-Mail">
                            <input
                                type="email"
                                placeholder="markpxxxx@gmxx.com"
                                className={formInputClass}
                            />
                        </FormField>

                        <FormField label="Kota">
                            <input
                                type="text"
                                placeholder="Cth. Jakarta"
                                className={formInputClass}
                            />
                        </FormField>
                    </div>

                    <FormField label="Website">
                        <input
                            type="text"
                            placeholder="https://marplus.com"
                            className={formInputClass}
                        />
                    </FormField>

                    <FormField label="Alamat">
                      <textarea
                          rows={3}
                          placeholder="Alamat lengkap sesuai KTP"
                          className={formInputClass}
                      />
                    </FormField>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                    Informasi PIC
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
                        <FormField label="Nomor Telpon PIC">
                            <input
                                type="text"
                                placeholder="0812-xxxx-xxxx"
                                className={formInputClass}
                            />
                        </FormField>

                        <FormField label="E-Mail PIC">
                            <input
                                type="email"
                                placeholder="markpxxxx@gmxx.com"
                                className={formInputClass}
                            />
                        </FormField>
                    </div>

                    <FormField label="Jabatan PIC">
                        <input
                            type="text"
                            placeholder="Cth. Sales & Marketing"
                            className={formInputClass}
                        />
                    </FormField>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Link
                    href="/penyelenggara-pelatihan"
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

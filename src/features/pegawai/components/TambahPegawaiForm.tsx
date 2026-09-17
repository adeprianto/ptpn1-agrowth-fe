"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Info } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FormField, formInputClass } from "@/components/shared/FormField";
import {
  PenempatanJabatanSection,
  type PenempatanJabatanValue,
} from "./PenempatanJabatanSection";

export function TambahPegawaiForm() {
  const router = useRouter();

  const [penempatan, setPenempatan] = useState<PenempatanJabatanValue>({
    levelPenempatan: "HO",
    regionalId: "",
    unitId: "",
    jabatanId: "",
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log("Tambah pegawai (dummy):", penempatan);
    router.push("/pegawai");
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Data Pegawai", href: "/pegawai" },
          { label: "Tambah Pegawai" },
        ]}
      />

      <div className="flex items-center gap-4">
        <Link
          href="/pegawai"
          aria-label="Kembali ke daftar pegawai"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tambah Pegawai Baru
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Lengkapi Identitas dan Kepegawaian
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ---------- Informasi Pribadi ---------- */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Informasi Pribadi
          </h2>

          <div className="space-y-5">
            <FormField label="Nama Lengkap" required>
              <input
                type="text"
                required
                placeholder="Cth. Slamet Riyadi"
                className={formInputClass}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="NIK" required>
                <input
                  type="text"
                  required
                  placeholder="Cth. 1000234"
                  className={formInputClass}
                />
              </FormField>

              <FormField label="Jenis Kelamin" required>
                <select required defaultValue="" className={formInputClass}>
                  <option value="" disabled>
                    Pilih...
                  </option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </FormField>

              <FormField label="Tempat Lahir">
                <input
                  type="text"
                  placeholder="Cth. Sumedang"
                  className={formInputClass}
                />
              </FormField>

              <FormField label="Tanggal Lahir" required>
                <input type="date" required className={formInputClass} />
              </FormField>

              <FormField label="Pendidikan Terakhir" required>
                <select required defaultValue="" className={formInputClass}>
                  <option value="" disabled>
                    Pilih...
                  </option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </FormField>

              <FormField label="Nomor Telpon">
                <input
                  type="text"
                  placeholder="0812-xxxx-xxxx"
                  className={formInputClass}
                />
              </FormField>
            </div>

            <FormField label="Alamat">
              <textarea
                rows={3}
                placeholder="Alamat lengkap sesuai KTP"
                className={formInputClass}
              />
            </FormField>
          </div>
        </div>

        {/* ---------- Penempatan & Jabatan ---------- */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Penempatan & Jabatan
          </h2>

          <PenempatanJabatanSection
            value={penempatan}
            onChange={setPenempatan}
          />

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Tanggal Masuk" required>
              <input type="date" required className={formInputClass} />
            </FormField>

            <FormField label="Status Kepegawaian" required>
              <select required defaultValue="" className={formInputClass}>
                <option value="" disabled>
                  Pilih...
                </option>
                <option value="Karyawan Tetap">Karyawan Tetap</option>
                <option value="PKWT">PKWT</option>
                <option value="Kontrak">Kontrak</option>
                <option value="Harian Lepas">Harian Lepas</option>
              </select>
            </FormField>
          </div>
        </div>

        {/* ---------- Data Kepegawaian ---------- */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">Data Kepegawaian</h2>
          <p className="mb-5 text-sm text-slate-400">
            Mengikuti struktur administrasi personalia yang berjalan
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Employee Group" required>
              <select required defaultValue="" className={formInputClass}>
                <option value="" disabled>
                  Pilih...
                </option>
                <option value="Pelaksana">Pelaksana</option>
                <option value="Staff">Staff</option>
                <option value="Manajerial">Manajerial</option>
              </select>
            </FormField>

            <FormField label="Employee Sub Group" required>
              <select required defaultValue="" className={formInputClass}>
                <option value="" disabled>
                  Pilih...
                </option>
                <option value="PKWTT">PKWTT</option>
                <option value="PKWT">PKWT</option>
              </select>
            </FormField>

            <FormField label="Status KSO" required>
              <select required defaultValue="" className={formInputClass}>
                <option value="" disabled>
                  Pilih...
                </option>
                <option value="KSO">KSO</option>
                <option value="Non KSO">Non KSO</option>
              </select>
            </FormField>

            <FormField label="Person Grade">
              <input
                type="text"
                placeholder="Cth. Grade 7"
                className={formInputClass}
              />
            </FormField>

            <FormField label="Golongan PHDP">
              <select defaultValue="" className={formInputClass}>
                <option value="" disabled>
                  Pilih...
                </option>
                <option value="I/A">I/A</option>
                <option value="I/B">I/B</option>
                <option value="II/A">II/A</option>
                <option value="II/B">II/B</option>
                <option value="II/C">II/C</option>
                <option value="III/A">III/A</option>
              </select>
            </FormField>
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            Personnel area akan mengikuti Level Penempatan yang dipilih di atas
            (Head Office, Regional, atau Unit) dan tidak perlu diisi manual.
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link
            href="/pegawai"
            className="rounded-xl bg-slate-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-500"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            Simpan Pegawai
          </button>
        </div>
      </form>
    </div>
  );
}

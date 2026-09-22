"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { FormPageLayout } from "@/components/shared/FormPageLayout";
import {
  Card,
  CardHeader,
  Field,
  Input,
  Select,
  Textarea,
  type SelectOption,
} from "@/components/ui";
import {
  PenempatanJabatanSection,
  type PenempatanJabatanValue,
} from "./PenempatanJabatanSection";

// DUMMY — daftar pilihan belum diambil dari master/API.
const toOptions = (values: string[]): SelectOption[] =>
  values.map((value) => ({ value, label: value }));

const JENIS_KELAMIN_OPTIONS = toOptions(["Laki-laki", "Perempuan"]);
const PENDIDIKAN_OPTIONS = toOptions([
  "SD",
  "SMP",
  "SMA/SMK",
  "D3",
  "S1",
  "S2",
  "S3",
]);
const STATUS_KEPEGAWAIAN_OPTIONS = toOptions([
  "Karyawan Tetap",
  "PKWT",
  "Kontrak",
  "Harian Lepas",
]);
const EMPLOYEE_GROUP_OPTIONS = toOptions(["Pelaksana", "Staff", "Manajerial"]);
const EMPLOYEE_SUBGROUP_OPTIONS = toOptions(["PKWTT", "PKWT"]);
const STATUS_KSO_OPTIONS = toOptions(["KSO", "Non KSO"]);
const GOLONGAN_PHDP_OPTIONS = toOptions([
  "I/A",
  "I/B",
  "II/A",
  "II/B",
  "II/C",
  "III/A",
]);

export function TambahPegawaiForm() {
  const router = useRouter();

  const [penempatan, setPenempatan] = useState<PenempatanJabatanValue>({
    levelPenempatan: "HO",
    regionalId: "",
    unitId: "",
    jabatanId: "",
  });

  function handleSubmit() {
    // DUMMY — endpoint tambah pegawai belum tersedia.
    // TODO: POST /api/v1/employees
    router.push("/pegawai");
  }

  return (
    <FormPageLayout
      variant="plain"
      breadcrumb={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Data Pegawai", href: "/pegawai" },
        { label: "Tambah Pegawai" },
      ]}
      title="Tambah Pegawai Baru"
      description="Lengkapi Identitas dan Kepegawaian"
      backHref="/pegawai"
      submitLabel="Simpan Pegawai"
      onSubmit={handleSubmit}
    >
      <Card className="p-6">
        <CardHeader title="Informasi Pribadi" />

        <div className="mt-5 space-y-5">
          <Field label="Nama Lengkap" required>
            <Input required placeholder="Cth. Slamet Riyadi" />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="NIK" required>
              <Input required placeholder="Cth. 1000234" />
            </Field>

            <Field label="Jenis Kelamin" required>
              <Select
                required
                defaultValue=""
                placeholder="Pilih..."
                options={JENIS_KELAMIN_OPTIONS}
              />
            </Field>

            <Field label="Tempat Lahir">
              <Input placeholder="Cth. Sumedang" />
            </Field>

            <Field label="Tanggal Lahir" required>
              <Input type="date" required />
            </Field>

            <Field label="Pendidikan Terakhir" required>
              <Select
                required
                defaultValue=""
                placeholder="Pilih..."
                options={PENDIDIKAN_OPTIONS}
              />
            </Field>

            <Field label="Nomor Telpon">
              <Input placeholder="0812-xxxx-xxxx" />
            </Field>
          </div>

          <Field label="Alamat">
            <Textarea placeholder="Alamat lengkap sesuai KTP" />
          </Field>
        </div>
      </Card>

      <Card className="p-6">
        <CardHeader title="Penempatan & Jabatan" />

        <div className="mt-5">
          <PenempatanJabatanSection value={penempatan} onChange={setPenempatan} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Tanggal Masuk" required>
            <Input type="date" required />
          </Field>

          <Field label="Status Kepegawaian" required>
            <Select
              required
              defaultValue=""
              placeholder="Pilih..."
              options={STATUS_KEPEGAWAIAN_OPTIONS}
            />
          </Field>
        </div>
      </Card>

      <Card className="p-6">
        <CardHeader
          title="Data Kepegawaian"
          description="Mengikuti struktur administrasi personalia yang berjalan"
        />

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Employee Group" required>
            <Select
              required
              defaultValue=""
              placeholder="Pilih..."
              options={EMPLOYEE_GROUP_OPTIONS}
            />
          </Field>

          <Field label="Employee Sub Group" required>
            <Select
              required
              defaultValue=""
              placeholder="Pilih..."
              options={EMPLOYEE_SUBGROUP_OPTIONS}
            />
          </Field>

          <Field label="Status KSO" required>
            <Select
              required
              defaultValue=""
              placeholder="Pilih..."
              options={STATUS_KSO_OPTIONS}
            />
          </Field>

          <Field label="Person Grade">
            <Input placeholder="Cth. Grade 7" />
          </Field>

          <Field label="Golongan PHDP">
            <Select
              defaultValue=""
              placeholder="Pilih..."
              options={GOLONGAN_PHDP_OPTIONS}
            />
          </Field>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          Personnel area akan mengikuti Level Penempatan yang dipilih di atas
          (Head Office, Regional, atau Unit) dan tidak perlu diisi manual.
        </div>
      </Card>
    </FormPageLayout>
  );
}

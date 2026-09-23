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
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { mustBeNumeric, notBefore, requireText, requireSelection } from "@/lib/validation";
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

/** Isian form tambah pegawai; penempatan & jabatan ikut di dalamnya. */
interface PegawaiFormValues extends PenempatanJabatanValue {
  nama: string;
  nik: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  pendidikan: string;
  telepon: string;
  alamat: string;
  tanggalMasuk: string;
  statusKepegawaian: string;
  employeeGroup: string;
  employeeSubgroup: string;
  statusKso: string;
  personGrade: string;
  golonganPhdp: string;
}

const emptyForm: PegawaiFormValues = {
  nama: "",
  nik: "",
  jenisKelamin: "",
  tempatLahir: "",
  tanggalLahir: "",
  pendidikan: "",
  telepon: "",
  alamat: "",
  levelPenempatan: "HO",
  regionalId: "",
  unitId: "",
  jabatanId: "",
  tanggalMasuk: "",
  statusKepegawaian: "",
  employeeGroup: "",
  employeeSubgroup: "",
  statusKso: "",
  personGrade: "",
  golonganPhdp: "",
};

export function TambahPegawaiForm() {
  const router = useRouter();
  const [values, setValues] = useState<PegawaiFormValues>(emptyForm);

  const { submit, saving, errors, formError } = useFormSubmit<PegawaiFormValues>({
    validate: (form) => ({
      nama: requireText(form.nama, "Nama Lengkap"),
      nik: requireText(form.nik, "NIK") ?? mustBeNumeric(form.nik, "NIK"),
      jenisKelamin: requireSelection(form.jenisKelamin, "Jenis Kelamin"),
      tanggalLahir: requireText(form.tanggalLahir, "Tanggal Lahir"),
      pendidikan: requireSelection(form.pendidikan, "Pendidikan Terakhir"),
      // regional & unit hanya ditanyakan untuk level penempatan yang memakainya
      regionalId:
        form.levelPenempatan !== "HO" ? requireSelection(form.regionalId, "Regional") : undefined,
      unitId: form.levelPenempatan === "Unit" ? requireSelection(form.unitId, "Unit") : undefined,
      jabatanId: requireSelection(form.jabatanId, "Posisi Jabatan"),
      tanggalMasuk:
        requireText(form.tanggalMasuk, "Tanggal Masuk") ??
        notBefore(form.tanggalMasuk, "Tanggal Masuk", form.tanggalLahir, "Tanggal Lahir"),
      statusKepegawaian: requireSelection(form.statusKepegawaian, "Status Kepegawaian"),
      employeeGroup: requireSelection(form.employeeGroup, "Employee Group"),
      employeeSubgroup: requireSelection(form.employeeSubgroup, "Employee Sub Group"),
      statusKso: requireSelection(form.statusKso, "Status KSO"),
    }),
    onSubmit: async () => {
      // DUMMY — endpoint tambah pegawai belum tersedia.
      // TODO: POST /api/v1/employees
      router.push("/pegawai");
    },
  });

  function setField<K extends keyof PegawaiFormValues>(key: K, value: PegawaiFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
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
      error={formError}
      saving={saving}
      submitLabel="Simpan Pegawai"
      onSubmit={() => submit(values)}
    >
      <Card padding="roomy">
        <CardHeader title="Informasi Pribadi" />

        <div className="mt-5 space-y-5">
          <Field label="Nama Lengkap" required error={errors.nama}>
            <Input
              value={values.nama}
              invalid={Boolean(errors.nama)}
              placeholder="Cth. Slamet Riyadi"
              onChange={(event) => setField("nama", event.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="NIK" required error={errors.nik}>
              <Input
                value={values.nik}
                invalid={Boolean(errors.nik)}
                inputMode="numeric"
                placeholder="Cth. 1000234"
                onChange={(event) => setField("nik", event.target.value)}
              />
            </Field>

            <Field label="Jenis Kelamin" required error={errors.jenisKelamin}>
              <Select
                value={values.jenisKelamin}
                invalid={Boolean(errors.jenisKelamin)}
                placeholder="Pilih..."
                options={JENIS_KELAMIN_OPTIONS}
                onChange={(event) => setField("jenisKelamin", event.target.value)}
              />
            </Field>

            <Field label="Tempat Lahir">
              <Input
                value={values.tempatLahir}
                placeholder="Cth. Sumedang"
                onChange={(event) => setField("tempatLahir", event.target.value)}
              />
            </Field>

            <Field label="Tanggal Lahir" required error={errors.tanggalLahir}>
              <Input
                type="date"
                value={values.tanggalLahir}
                invalid={Boolean(errors.tanggalLahir)}
                onChange={(event) => setField("tanggalLahir", event.target.value)}
              />
            </Field>

            <Field label="Pendidikan Terakhir" required error={errors.pendidikan}>
              <Select
                value={values.pendidikan}
                invalid={Boolean(errors.pendidikan)}
                placeholder="Pilih..."
                options={PENDIDIKAN_OPTIONS}
                onChange={(event) => setField("pendidikan", event.target.value)}
              />
            </Field>

            <Field label="Nomor Telpon">
              <Input
                value={values.telepon}
                placeholder="0812-xxxx-xxxx"
                onChange={(event) => setField("telepon", event.target.value)}
              />
            </Field>
          </div>

          <Field label="Alamat">
            <Textarea
              value={values.alamat}
              placeholder="Alamat lengkap sesuai KTP"
              onChange={(event) => setField("alamat", event.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card padding="roomy">
        <CardHeader title="Penempatan & Jabatan" />

        <div className="mt-5">
          <PenempatanJabatanSection
            value={values}
            errors={errors}
            onChange={(penempatan) => setValues((prev) => ({ ...prev, ...penempatan }))}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Tanggal Masuk" required error={errors.tanggalMasuk}>
            <Input
              type="date"
              value={values.tanggalMasuk}
              invalid={Boolean(errors.tanggalMasuk)}
              onChange={(event) => setField("tanggalMasuk", event.target.value)}
            />
          </Field>

          <Field label="Status Kepegawaian" required error={errors.statusKepegawaian}>
            <Select
              value={values.statusKepegawaian}
              invalid={Boolean(errors.statusKepegawaian)}
              placeholder="Pilih..."
              options={STATUS_KEPEGAWAIAN_OPTIONS}
              onChange={(event) => setField("statusKepegawaian", event.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card padding="roomy">
        <CardHeader
          title="Data Kepegawaian"
          description="Mengikuti struktur administrasi personalia yang berjalan"
        />

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Employee Group" required error={errors.employeeGroup}>
            <Select
              value={values.employeeGroup}
              invalid={Boolean(errors.employeeGroup)}
              placeholder="Pilih..."
              options={EMPLOYEE_GROUP_OPTIONS}
              onChange={(event) => setField("employeeGroup", event.target.value)}
            />
          </Field>

          <Field label="Employee Sub Group" required error={errors.employeeSubgroup}>
            <Select
              value={values.employeeSubgroup}
              invalid={Boolean(errors.employeeSubgroup)}
              placeholder="Pilih..."
              options={EMPLOYEE_SUBGROUP_OPTIONS}
              onChange={(event) => setField("employeeSubgroup", event.target.value)}
            />
          </Field>

          <Field label="Status KSO" required error={errors.statusKso}>
            <Select
              value={values.statusKso}
              invalid={Boolean(errors.statusKso)}
              placeholder="Pilih..."
              options={STATUS_KSO_OPTIONS}
              onChange={(event) => setField("statusKso", event.target.value)}
            />
          </Field>

          <Field label="Person Grade">
            <Input
              value={values.personGrade}
              placeholder="Cth. Grade 7"
              onChange={(event) => setField("personGrade", event.target.value)}
            />
          </Field>

          <Field label="Golongan PHDP">
            <Select
              value={values.golonganPhdp}
              placeholder="Pilih..."
              options={GOLONGAN_PHDP_OPTIONS}
              onChange={(event) => setField("golonganPhdp", event.target.value)}
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

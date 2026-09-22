"use client";

import { useState } from "react";
import { Alert, Button, Field, Input, Modal, ModalActions } from "@/components/ui";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { RegionalInput } from "../../model/regional";

export type RegionalFormValues = RegionalInput;

const emptyForm: RegionalFormValues = { nama: "", kode: "" };

// Nama field di backend berbeda dengan key form, jadi error 422 perlu dipetakan.
const FIELD_MAP = { name: "nama", code: "kode" } as const;

interface RegionalFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: RegionalFormValues;
  onClose: () => void;
  /** Lempar error (mis. ApiError 422) untuk menampilkan pesannya di form */
  onSubmit: (values: RegionalFormValues) => Promise<void>;
}

export function RegionalFormModal({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
}: RegionalFormModalProps) {
  const [values, setValues] = useState<RegionalFormValues>(
    initialValues ?? emptyForm,
  );

  const { submit, saving, errors, formError } = useFormSubmit<RegionalFormValues>({
    fieldMap: FIELD_MAP,
    validate: (form) => ({
      nama: form.nama.trim() ? undefined : "Nama Regional wajib diisi",
      kode: form.kode.trim() ? undefined : "Kode Regional wajib diisi",
    }),
    onSubmit,
  });

  function handleChange<K extends keyof RegionalFormValues>(
    key: K,
    value: RegionalFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={mode === "create" ? "Tambah Regional" : "Edit Regional"}
      footer={
        <ModalActions>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button loading={saving} onClick={() => submit(values)}>
            {mode === "create" ? "Simpan Regional" : "Simpan Perubahan"}
          </Button>
        </ModalActions>
      }
    >
      <div className="space-y-4">
        {formError && <Alert tone="error">{formError}</Alert>}

        <Field label="Nama Regional" required error={errors.nama}>
          <Input
            value={values.nama}
            invalid={Boolean(errors.nama)}
            placeholder="Cth. Regional 1"
            onChange={(event) => handleChange("nama", event.target.value)}
          />
        </Field>

        <Field label="Kode Regional" required error={errors.kode}>
          <Input
            value={values.kode}
            invalid={Boolean(errors.kode)}
            placeholder="REG01"
            onChange={(event) => handleChange("kode", event.target.value)}
          />
        </Field>
      </div>
    </Modal>
  );
}

import { notFound } from "next/navigation";
import {
  MasterJabatanForm,
  positionRowToFormValues,
} from "@/features/organisasi/components/jabatan/MasterJabatanForm";
import { jabatanMasterRows } from "@/features/organisasi/components/departemen/masterJabatanDummyData";

export default async function EditJabatanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = jabatanMasterRows.find((r) => r.id === id);

  if (!row) {
    notFound();
  }

  return (
    <MasterJabatanForm
      mode="edit"
      initialValues={positionRowToFormValues(row)}
    />
  );
}

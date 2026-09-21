import { PenyelenggaraForm } from "@/features/penyelenggara-pelatihan/components/PenyelenggaraForm";

interface EditPenyelenggaraPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPenyelenggaraPage({
  params,
}: EditPenyelenggaraPageProps) {
  const { id } = await params;

  return <PenyelenggaraForm mode="edit" vendorId={Number(id)} />;
}

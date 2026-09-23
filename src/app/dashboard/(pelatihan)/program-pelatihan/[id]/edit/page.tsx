import { PelatihanForm } from "@/features/program-pelatihan/components/PelatihanForm";

interface EditProgramPelatihanPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProgramPelatihanPage({
  params,
}: EditProgramPelatihanPageProps) {
  const { id } = await params;

  return <PelatihanForm mode="edit" trainingId={id} />;
}

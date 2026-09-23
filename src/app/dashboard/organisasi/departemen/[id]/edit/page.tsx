import { StrukturDepartemenForm } from "@/features/organisasi/components/departemen/StrukturDepartemenForm";

interface EditDepartemenPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDepartemenPage({
  params,
}: EditDepartemenPageProps) {
  const { id } = await params;

  return <StrukturDepartemenForm mode="edit" departemenId={id} />;
}

import { UnitForm } from "@/features/organisasi/components/unit/UnitForm";

interface EditUnitPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUnitPage({ params }: EditUnitPageProps) {
  const { id } = await params;

  return <UnitForm mode="edit" unitId={Number(id)} />;
}

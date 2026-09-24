import { StrukturDepartemenForm } from "@/features/organisasi/components/departemen/StrukturDepartemenForm";

export default async function TambahDepartemenPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string }>;
}) {
  const { entity } = await searchParams;

  return <StrukturDepartemenForm mode="create" defaultEntityId={entity} />;
}

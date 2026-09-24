import { DetailUnit } from "@/features/organisasi/components/unit/DetailUnit";

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DetailUnit id={id} />;
}

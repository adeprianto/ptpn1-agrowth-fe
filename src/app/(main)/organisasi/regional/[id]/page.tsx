import { DetailRegional } from "@/features/organisasi/components/regional/DetailRegional";

interface RegionalDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RegionalDetailPage({
  params,
}: RegionalDetailPageProps) {
  const { id } = await params;

  return <DetailRegional id={Number(id)} />;
}

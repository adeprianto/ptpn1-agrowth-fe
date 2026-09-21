import { DetailPegawai } from "@/features/pegawai/components/DetailPegawai";

export default async function PegawaiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DetailPegawai id={Number(id)} />;
}

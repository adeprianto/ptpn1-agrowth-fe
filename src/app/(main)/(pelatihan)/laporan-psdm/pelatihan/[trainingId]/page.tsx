import { LaporanPerPelatihan } from "@/features/laporan-psdm/components/LaporanPerPelatihan";

interface LaporanPerPelatihanPageProps {
  params: Promise<{ trainingId: string }>;
}

export default async function LaporanPerPelatihanPage({
  params,
}: LaporanPerPelatihanPageProps) {
  const { trainingId } = await params;

  return <LaporanPerPelatihan trainingId={trainingId} />;
}

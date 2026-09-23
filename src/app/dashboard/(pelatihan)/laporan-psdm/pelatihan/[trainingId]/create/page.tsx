import LaporanPsdmForm from "@/features/laporan-psdm/components/LaporanPsdmForm";

interface TambahLaporanPsdmPageProps {
  params: Promise<{ trainingId: string }>;
}

export default async function TambahLaporanPsdmPage({
  params,
}: TambahLaporanPsdmPageProps) {
  const { trainingId } = await params;

  return <LaporanPsdmForm trainingId={trainingId} />;
}

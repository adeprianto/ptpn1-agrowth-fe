import { LaporanDetail } from "@/features/laporan-psdm/components/LaporanDetail";

interface DetailLaporanPsdmPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailLaporanPsdmPage({ params }: DetailLaporanPsdmPageProps) {
  const { id } = await params;

  return <LaporanDetail laporanId={id} />;
}

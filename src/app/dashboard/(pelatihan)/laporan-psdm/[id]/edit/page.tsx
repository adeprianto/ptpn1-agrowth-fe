import LaporanPsdmForm from "@/features/laporan-psdm/components/LaporanPsdmForm";

interface UbahLaporanPsdmPageProps {
  params: Promise<{ id: string }>;
}

export default async function UbahLaporanPsdmPage({ params }: UbahLaporanPsdmPageProps) {
  const { id } = await params;

  return <LaporanPsdmForm laporanId={id} />;
}

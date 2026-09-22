import { BudgetGauge } from "./BudgetGauge";
import { DevelopmentTypeList, type CategoryData } from "./DevelopmentTypeList";

// DUMMY DATA — 14 kategori ini adalah rincian HEAD OFFICE (totalnya persis
// sama dengan realisasi HO di RegionalCostChart: Rp 32.741.820.663).
// Nanti diganti hasil GET /api/v1/dashboard/konsolidasi-anggaran?entity=
const kategoriBiaya: CategoryData[] = [
  { name: "PDSM - Pengembangan BOD & BOC", value: 1206502000 },
  { name: "PDSM - Agro Walet", value: 5567910620 },
  { name: "PDSM - IHT & Public Training", value: 2980442462 },
  { name: "PDSM - Kursus Jabatan", value: 3197500000 },
  { name: "PDSM - Sertifikasi Jabatan", value: 2739000000 },
  { name: "PDSM - Program Study Banding", value: 295500000 },
  { name: "PDSM - Program Pendidikan Lanjut", value: 150000000 },
  { name: "PDSM - Biaya Perjalanan Dinas", value: 1738125000 },
  { name: "Assessment", value: 1666681250 },
  { name: "Rekrutmen", value: 3881438023 },
  { name: "Onboarding", value: 6355500000 },
  { name: "Program Budaya Perusahaan", value: 996000000 },
  { name: "Konsultasi Pengembangan SDM", value: 1107549308 },
  { name: "Inovasi & Riset", value: 859672000 },
];

// Anggaran (target) HO, sama dengan RegionalCostChart
const anggaranHO = 37_405_411_840;

export function BudgetConsolidationCard() {
  // Realisasi gauge = jumlah 14 kategori, supaya angka di kiri & kanan
  // tidak mungkin berbeda.
  const realisasi = kategoriBiaya.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <BudgetGauge realisasi={realisasi} anggaran={anggaranHO} />
      </div>
      <div className="lg:col-span-3 lg:border-l lg:border-slate-100 lg:pl-6">
        <DevelopmentTypeList data={kategoriBiaya} />
      </div>
    </div>
  );
}

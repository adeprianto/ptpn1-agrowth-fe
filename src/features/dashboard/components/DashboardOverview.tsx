import { DashboardHeading } from "./DashboardHeading";
import { DashboardSection } from "./DashboardSection";
import { DashboardCard } from "./DashboardCard";
import { ExecutiveSummary } from "./ExecutiveSummary";
import {
  CostSummaryTiles,
  ParticipantSummaryTiles,
  TrainingHourSummaryTiles,
} from "./SectionSummaryTiles";
import { BudgetCategoryPanel } from "./BudgetCategoryPanel";
import { RegionalCostChart } from "./charts/RegionalCostChart";
import { DevelopmentCostTrendChart } from "./charts/DevelopmentCostTrendChart";
import { ParticipantTypeChart } from "./charts/ParticipantTypeChart";
import { RegionalParticipantsChart } from "./charts/RegionalParticipantsChart";
import { TrainingHourChart } from "./charts/TrainingHourChart";
import { CompetencyHourChart } from "./charts/CompetencyHourChart";
import { CompetencyMatrixTable } from "./charts/CompetencyMatrixTable";
import { LevelMatrixTable } from "./charts/LevelMatrixTable";
import {
  ENTITIES,
  TAHUN_ANGGARAN,
  jamPerRegional,
  pesertaPerRegional,
} from "./charts/dashboardDummyData";

export function DashboardOverview() {
  return (
    <div className="space-y-10">
      <DashboardHeading
        eyebrow="PTPN 1 · Dashboard Eksekutif"
        systemName="Sistem Pengembangan SDM"
        description="Ringkasan eksekutif status pengajuan dan pelaksanaan pelatihan karyawan di seluruh wilayah kerja PTPN 1."
        chips={[
          `Tahun Anggaran ${TAHUN_ANGGARAN}`,
          `${ENTITIES.length} Entitas · HO & Regional`,
          "Biaya · Peserta · Jam Pembelajaran",
        ]}
      />

      {/* 1. Ringkasan eksekutif */}
      <DashboardSection
        eyebrow="Overview"
        title="Ringkasan Eksekutif"
        description="Konsolidasi biaya, kepesertaan, dan jam pembelajaran seluruh HO dan regional."
      >
        <ExecutiveSummary />
      </DashboardSection>

      {/* 2. Realisasi biaya */}
      <DashboardSection
        eyebrow="Program Pengembangan"
        title="Realisasi Biaya Pengembangan SDM"
        description="Rincian realisasi biaya pengembangan SDM berdasarkan regional, tren bulanan, dan kategori RKAP."
      >
        <CostSummaryTiles />

        <DashboardCard
          title="Biaya Pengembangan SDM Per-Region"
          subtitle="Menampilkan perbandingan total biaya yang dialokasikan"
        >
          <RegionalCostChart />
        </DashboardCard>

        <DashboardCard
          title="Tren Biaya Pengembangan SDM"
          subtitle="Melihat kenaikan/penurunan biaya per bulan/tahun"
        >
          <DevelopmentCostTrendChart />
        </DashboardCard>

        <BudgetCategoryPanel />
      </DashboardSection>

      {/* 3. Kepesertaan */}
      <DashboardSection
        eyebrow="SDM"
        title="Cakupan & Demografi Peserta"
        description="Pemetaan sebaran peserta berdasarkan level jabatan BOD per regional serta perbandingan klasifikasi Karpim dan Karpel."
      >
        <ParticipantSummaryTiles />

        <DashboardCard
          title="Peserta Per-Regional"
          subtitle="Perbandingan peserta Karpim dan Karpel di tiap regional"
        >
          <ParticipantTypeChart />
        </DashboardCard>

        <DashboardCard
          title="Distribusi Peserta Berdasarkan Level BOD"
          subtitle="Komposisi jenjang struktural kepemimpinan dan teknis di masing-masing regional"
        >
          <RegionalParticipantsChart />
        </DashboardCard>

        <DashboardCard
          title="Matrix Capaian per Level BOD & Regional"
          subtitle="Jumlah peserta per level BOD di tiap regional"
        >
          <LevelMatrixTable data={pesertaPerRegional} measure="peserta" unit="orang" />
        </DashboardCard>
      </DashboardSection>

      {/* 4. Jam pembelajaran */}
      <DashboardSection
        eyebrow="Jam Pembelajaran"
        title="Efektivitas & Realisasi Jam Pembelajaran"
        description="Komparasi pemenuhan RKAP jam pembelajaran SDM per level BOD di regional."
      >
        <TrainingHourSummaryTiles />

        <DashboardCard
          title="Jam Pembelajaran"
          subtitle="RKAP dan realisasi jam pembelajaran antar regional"
        >
          <TrainingHourChart />
        </DashboardCard>

        <DashboardCard
          title="Matrix Jam Pembelajaran per Level BOD & Regional"
          subtitle="Realisasi jam pembelajaran per level BOD di tiap regional"
        >
          <LevelMatrixTable
            data={jamPerRegional}
            measure="jam pembelajaran"
            unit="jam"
            heatRgb="59, 130, 246"
          />
        </DashboardCard>

        <DashboardCard
          title="Jam Pembelajaran per Bidang Kompetensi"
          subtitle="RKAP dan realisasi jam pembelajaran di tiap bidang kompetensi"
        >
          <CompetencyHourChart />
        </DashboardCard>

        <DashboardCard
          title="Matrix Jam Pembelajaran per Bidang & Level BOD"
          subtitle="Realisasi jam pembelajaran tiap bidang kompetensi per level BOD"
        >
          <CompetencyMatrixTable />
        </DashboardCard>
      </DashboardSection>
    </div>
  );
}

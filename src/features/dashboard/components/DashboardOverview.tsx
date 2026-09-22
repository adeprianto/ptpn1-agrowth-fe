import { Users, ClipboardList, Gauge } from "lucide-react";
import { DashboardHeading } from "./DashboardHeading";
import { StatCard } from "./StatCard";
import { DashboardCard } from "./DashboardCard";
import { ChartPlaceholder } from "./ChartPlaceholder";
import { RegionalCostChart } from "./charts/RegionalCostChart";
import { DevelopmentCostTrendChart } from "./charts/DevelopmentCostTrendChart";
import { RegionalParticipantsChart } from "./charts/RegionalParticipantsChart";
import { ParticipantKartimChart } from "./charts/ParticipantKartimChart";
import { ParticipantPelaksanaChart } from "./charts/ParticipantPelaksanaChart";
import { TrainingHourChart } from "./charts/TrainingHourChart";
import { BudgetConsolidationCard } from "./charts/BudgetConsolidationChart";

export function DashboardOverview() {
  return (
    <div className="space-y-5">
      <DashboardHeading
        systemName="Sistem Pengembangan SDM"
        description="Ringkasan eksekutif status pengajuan dan pelaksanaan pelatihan karyawan di seluruh wilayah kerja PTPN 1."
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Karyawan"
          value="4,532"
          icon={Users}
          trend="2.4%"
        />
        <StatCard
          label="Pengajuan Aktif"
          value="223"
          icon={ClipboardList}
          trend="2.4%"
        />
        <StatCard
          label="Pelatihan Berjalan"
          value="40"
          icon={Gauge}
          trend="2.4%"
          variant="featured"
        />
      </div>

      <div className="grid grid-cols-1">
        <DashboardCard
          title="Total Konsolidasi PTPN1"
          subtitle="Menampilkan Total pengembangan SDM"
        >
          <BudgetConsolidationCard />
        </DashboardCard>
      </div>

      {/* Biaya per region + Jenis pengembangan */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardCard
          title="Biaya Pengembangan SDM Per-Region"
          subtitle="Menampilkan perbandingan total biaya yang dialokasikan"
          className="lg:col-span-2"
        >
          <RegionalCostChart />
        </DashboardCard>
      </div>

      {/* Tren biaya - full width */}
      <DashboardCard
        title="Tren Biaya Pengembangan SDM"
        subtitle="Melihat kenaikan/penurunan biaya per bulan/tahun"
      >
        <DevelopmentCostTrendChart />
      </DashboardCard>

      {/* Status pengembangan + peserta per regional */}
      <div className="grid grid-cols-1">
        <DashboardCard
          title="Peserta Per-Regional"
          subtitle="Membandingkan coverage pengembangan antar regional"
          className="lg:col-span-2"
        >
          <RegionalParticipantsChart />
        </DashboardCard>
      </div>

      {/* Peserta kartim + pelaksana */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardCard
          title="Peserta Karpim"
          subtitle="Membandingkan coverage pengembangan antar regional"
        >
          <ParticipantKartimChart />
        </DashboardCard>

        <DashboardCard
          title="Peserta Karpel"
          subtitle="Membandingkan coverage pengembangan antar regional"
        >
          <ParticipantPelaksanaChart />
        </DashboardCard>
      </div>

      {/* Jam pembelajaran - full width */}
      <div className="grid grid-cols-1">
        <DashboardCard
          title="Jam Pembelajaran"
          subtitle="Membandingkan coverage pengembangan antar regional"
          className="lg:col-span-2"
        >
          <TrainingHourChart />
        </DashboardCard>
      </div>

      {/* Riwayat pendaftaran + recent activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DashboardCard
          title="Riwayat Pendaftaran"
          subtitle="Daftar pengajuan pelatihan terbaru"
          className="lg:col-span-2"
        >
          <ChartPlaceholder label="RiwayatPendaftaranTable" />
        </DashboardCard>

        <DashboardCard
          title="Recent Activity"
          subtitle="Aktivitas approval terbaru"
        >
          <ChartPlaceholder label="RecentActivityList" />
        </DashboardCard>
      </div>

      {/* Peta sebaran regional - full width */}
      <DashboardCard
        title="Peta Sebaran Regional"
        subtitle="Sebaran lokasi kegiatan pengembangan SDM per regional"
      >
        <ChartPlaceholder label="PetaSebaranRegional" />
      </DashboardCard>
    </div>
  );
}

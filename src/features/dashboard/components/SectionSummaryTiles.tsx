import {
  KARPEL_LEVELS,
  KARPIM_LEVELS,
  PESERTA_SERIES,
  TAHUN_ANGGARAN,
  formatEntityName,
  formatNumber,
  formatPercent,
  formatRupiah,
  jamPerRegional,
  levelLabel,
  pesertaPerRegional,
  ringkasanBiaya,
  type Level,
} from "./charts/dashboardDummyData";

const GREEN = "#15803d";
const RED = "#dc2626";

function KpiTile({
  label,
  value,
  caption,
  valueColor,
  captionColor,
}: {
  label: string;
  value: string;
  caption: string;
  /** Warna CSS untuk angka; default slate gelap */
  valueColor?: string;
  /** Warna CSS untuk keterangan; default slate muda */
  captionColor?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className="mt-1 text-lg font-bold text-slate-900"
        style={{ color: valueColor }}
      >
        {value}
      </p>
      <p
        className="mt-0.5 text-[11px] text-slate-400"
        style={{ color: captionColor }}
      >
        {caption}
      </p>
    </div>
  );
}

const share = (value: number, total: number) =>
  total > 0 ? (value / total) * 100 : 0;

const levelRange = (levels: readonly Level[]) =>
  `${levelLabel(levels[0])} s/d ${levelLabel(levels[levels.length - 1])}`;

export function CostSummaryTiles() {
  const { anggaran, realisasi, entityTertinggi } = ringkasanBiaya;
  const serapan = share(realisasi, anggaran);
  const miliar = (entityTertinggi.realisasi / 1_000_000_000).toLocaleString(
    "id-ID",
    { maximumFractionDigits: 2 },
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiTile
        label="Total Anggaran RKAP"
        value={formatRupiah(anggaran)}
        caption={`Alokasi tahun ${TAHUN_ANGGARAN}`}
      />
      <KpiTile
        label="Realisasi Biaya"
        value={formatRupiah(realisasi)}
        caption={`Serapan ${formatPercent(serapan)} anggaran`}
        valueColor={GREEN}
      />
      <KpiTile
        label="Sisa Saldo Anggaran"
        value={formatRupiah(anggaran - realisasi)}
        caption={`${formatPercent(100 - serapan)} kuota tersisa`}
      />
      <KpiTile
        label="Entity Realisasi Biaya Tertinggi"
        value={`Rp ${miliar} Miliar`}
        caption={`${formatEntityName(entityTertinggi.regional)} (${entityTertinggi.kategoriTerbesar})`}
        captionColor={GREEN}
      />
    </div>
  );
}

export function ParticipantSummaryTiles() {
  const total = pesertaPerRegional.reduce((sum, row) => sum + row.total, 0);
  const karpim = pesertaPerRegional.reduce((sum, row) => sum + row.karpim, 0);
  const karpel = pesertaPerRegional.reduce((sum, row) => sum + row.karpel, 0);
  const terbanyak = pesertaPerRegional.reduce((best, row) =>
    row.total > best.total ? row : best,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiTile
        label="Total Peserta Terealisasi"
        value={formatNumber(total)}
        caption="Seluruh entity & regional"
      />
      <KpiTile
        label="Peserta (Karpim)"
        value={`${formatNumber(karpim)} Orang`}
        caption={`${formatPercent(share(karpim, total))} dari total peserta (${levelRange(KARPIM_LEVELS)})`}
        valueColor={PESERTA_SERIES.karpim.color}
        captionColor={PESERTA_SERIES.karpim.color}
      />
      <KpiTile
        label="Peserta (Karpel)"
        value={`${formatNumber(karpel)} Orang`}
        caption={`${formatPercent(share(karpel, total))} dari total peserta (${levelRange(KARPEL_LEVELS)})`}
        valueColor={PESERTA_SERIES.karpel.color}
        captionColor={PESERTA_SERIES.karpel.color}
      />
      <KpiTile
        label="Entity Peserta Terbanyak"
        value={`${formatNumber(terbanyak.total)} Orang`}
        caption={formatEntityName(terbanyak.regional)}
        captionColor={GREEN}
      />
    </div>
  );
}

export function TrainingHourSummaryTiles() {
  const target = jamPerRegional.reduce((sum, row) => sum + row.target, 0);
  const realisasi = jamPerRegional.reduce((sum, row) => sum + row.realisasi, 0);
  const gap = target - realisasi;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiTile
        label="Target Jam Pembelajaran"
        value={`${formatNumber(target)} Jam`}
        caption="Target RKAP konsolidasi holding"
      />
      <KpiTile
        label="Realisasi Jam Pembelajaran"
        value={`${formatNumber(realisasi)} Jam`}
        caption={`${formatPercent(share(realisasi, target))} capaian pemenuhan target`}
        valueColor={GREEN}
      />
      <KpiTile
        label="Gap Jam Pembelajaran"
        value={`${formatNumber(Math.max(gap, 0))} Jam`}
        caption={
          gap > 0
            ? "Selisih target yang harus dikejar"
            : "Target sudah terpenuhi"
        }
        valueColor={gap > 0 ? RED : GREEN}
      />
    </div>
  );
}

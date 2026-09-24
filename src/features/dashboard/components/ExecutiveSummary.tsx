import type { ReactNode } from "react";
import { BudgetBreakdown } from "./BudgetBreakdown";
import { MiniTable, Stacked } from "./MiniTable";
import { CapaianValue, capaian } from "./charts/overTarget";
import {
  BULAN_BERJALAN,
  LEVELS,
  LEVEL_COLORS,
  PESERTA_SERIES,
  TAHUN_ANGGARAN,
  formatEntityName,
  formatMiliar,
  formatNumber,
  formatPercent,
  formatRupiah,
  jamPerBidang,
  jamPerRegional,
  levelKey,
  levelLabel,
  pesertaPerRegional,
  ringkasanBiaya,
  targetJamPerLevel,
  type Level,
} from "./charts/dashboardDummyData";

const GAUGE_COLOR = "#4f46e5";
const JAM_COLOR = "#3b82f6";

const sumBy = <T,>(items: T[], value: (item: T) => number) =>
  items.reduce((sum, item) => sum + value(item), 0);

const share = (value: number, total: number) =>
  total > 0 ? (value / total) * 100 : 0;

const formatDecimal = (value: number, digits: number) =>
  value.toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

function LevelName({ level }: { level: Level }) {
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      {/* Titik warna disembunyikan di layar sempit supaya tabel muat */}
      <span
        className="hidden h-2 w-2 shrink-0 rounded-full xl:inline-block"
        style={{ backgroundColor: LEVEL_COLORS[level] }}
      />
      {levelLabel(level)}
    </span>
  );
}

// Jam realisasi per level BOD, dijumlah dari seluruh entity
const jamPerLevel = (level: Level) =>
  sumBy(jamPerRegional, (row) => row[levelKey(level)]);

function SummaryCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-sm font-semibold text-slate-800">{title}</h3>
      {/* @container: isi kartu menyesuaikan lebar kartu, bukan lebar layar */}
      <div className="@container mt-4 flex flex-1 flex-col">{children}</div>
    </div>
  );
}

/** Setengah lingkaran + jarum. Arc dikunci 0–100%, teks tetap angka asli. */
function NeedleGauge({ percent }: { percent: number }) {
  const clamped = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="relative mx-auto w-full max-w-[220px]">
      <svg viewBox="0 0 200 112" className="w-full">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={14}
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={GAUGE_COLOR}
          strokeWidth={14}
          pathLength={100}
          strokeDasharray={`${clamped} 100`}
        />
        {/* Jarum digambar menunjuk ke kiri (0%), lalu diputar searah jarum jam */}
        <g transform={`rotate(${clamped * 1.8} 100 100)`}>
          <line
            x1={100}
            y1={100}
            x2={38}
            y2={100}
            stroke="#1e293b"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
        <circle cx={100} cy={100} r={6} fill="#1e293b" />
      </svg>
      <div className="mt-1 text-center">
        <p className="text-lg font-bold text-slate-800">
          {formatPercent(percent)}
        </p>
        <p className="text-[11px] text-slate-400">dari anggaran terpakai</p>
      </div>
    </div>
  );
}

function BudgetSummaryCard() {
  const { anggaran, realisasi, entityTertinggi } = ringkasanBiaya;

  return (
    <SummaryCard eyebrow="Keuangan RKAP" title="Konsolidasi Biaya Pengembangan">
      <NeedleGauge percent={share(realisasi, anggaran)} />

      <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg bg-slate-100 p-3 @[16rem]:grid-cols-2">
        <div>
          <p className="text-[10px] text-slate-500">Realisasi Penyerapan</p>
          <p className="mt-0.5 text-sm font-bold text-slate-800">
            {formatMiliar(realisasi)}
          </p>
          <p className="whitespace-nowrap text-[10px] text-slate-400">
            {formatRupiah(realisasi)}
          </p>
        </div>
        <div className="@[16rem]:text-right">
          <p className="text-[10px] text-slate-500">Anggaran RKAP</p>
          <p className="mt-0.5 text-sm font-bold text-slate-800">
            {formatMiliar(anggaran)}
          </p>
          <p className="whitespace-nowrap text-[10px] text-slate-400">
            {formatRupiah(anggaran)}
          </p>
        </div>
      </div>

      <div className="space-y-2 pt-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
            <span className="text-slate-500">Sisa RKAP {TAHUN_ANGGARAN}</span>
          </div>
          <span className="ml-auto whitespace-nowrap font-semibold text-slate-800">
            {formatRupiah(anggaran - realisasi)}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
            <span className="text-slate-500">Penyerap tertinggi</span>
          </div>
          <span className="ml-auto whitespace-nowrap font-semibold text-slate-800">
            {formatEntityName(entityTertinggi.regional)} (
            {formatMiliar(entityTertinggi.realisasi)})
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <BudgetBreakdown />
      </div>
    </SummaryCard>
  );
}

function ParticipantSummaryCard() {
  const total = sumBy(pesertaPerRegional, (row) => row.total);
  const karpim = sumBy(pesertaPerRegional, (row) => row.karpim);
  const karpel = sumBy(pesertaPerRegional, (row) => row.karpel);

  const perLevel = LEVELS.map((level) => ({
    level,
    value: sumBy(pesertaPerRegional, (row) => row[levelKey(level)]),
  }));
  // Dua level dengan peserta terbanyak, ditampilkan urut level
  const dominan = [...perLevel]
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .sort((a, b) => a.level - b.level);
  const dominanShare = share(
    sumBy(dominan, (item) => item.value),
    total,
  );

  const segments = [
    { ...PESERTA_SERIES.karpim, value: karpim },
    { ...PESERTA_SERIES.karpel, value: karpel },
  ];

  return (
    <SummaryCard eyebrow="Kepesertaan" title="Konsolidasi Peserta Pelatihan">
      <p className="text-[11px] text-slate-500">Cakupan Karyawan Terlatih</p>
      <p className="text-2xl font-bold text-slate-800">{formatNumber(total)}</p>

      <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-slate-200">
        {segments.map((segment) => (
          <div
            key={segment.name}
            style={{
              width: `${share(segment.value, total)}%`,
              backgroundColor: segment.color,
            }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap justify-between gap-x-3 text-[11px] text-slate-500">
        {segments.map((segment) => (
          <span key={segment.name} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            {segment.name}: {formatNumber(segment.value)} (
            {formatPercent(share(segment.value, total))})
          </span>
        ))}
      </div>

      <div className="mt-3">
        <MiniTable
          columns={[
            { label: "Level" },
            { label: "Peserta", sublabel: "% Peserta", align: "right" },
            { label: "% Target Jam", align: "right" },
          ]}
          rows={perLevel.map(({ level, value }) => ({
            key: String(level),
            cells: [
              <LevelName key="level" level={level} />,
              <Stacked
                key="peserta"
                main={`${formatNumber(value)} orang`}
                sub={formatPercent(share(value, total))}
              />,
              <CapaianValue
                key="jam"
                percent={capaian(jamPerLevel(level), targetJamPerLevel[level])}
              />,
            ],
          }))}
          legend={[
            { term: "% Peserta", description: "porsi dari total peserta" },
            {
              term: "% Target Jam",
              description:
                "realisasi jam pembelajaran level tsb dibanding target jamnya (▲ = melebihi)",
            },
          ]}
        />
      </div>

      <div className="mt-3 space-y-1.5 rounded-lg border border-slate-200 p-3 text-[11px]">
        <div className="flex justify-between gap-2">
          <span className="text-slate-400">Dominasi Segmen</span>
          <span className="font-semibold text-slate-700">
            {dominan.map((item) => levelLabel(item.level)).join(" & ")} (
            {formatPercent(dominanShare)})
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-slate-400">Rasio Karpim : Karpel</span>
          <span className="font-semibold text-slate-700">
            1 :{" "}
            {karpim > 0 ? (karpel / karpim).toFixed(1).replace(".", ",") : "-"}{" "}
            Karyawan
          </span>
        </div>
      </div>
    </SummaryCard>
  );
}

function TrainingHourSummaryCard() {
  const target = sumBy(jamPerRegional, (row) => row.target);
  const realisasi = sumBy(jamPerRegional, (row) => row.realisasi);
  const peserta = sumBy(pesertaPerRegional, (row) => row.total);
  const bidangDominan = jamPerBidang.reduce((best, row) =>
    row.realisasi > best.realisasi ? row : best,
  );

  return (
    <SummaryCard eyebrow="Kapabilitas" title="Konsolidasi Jam Pembelajaran">
      <p className="text-[11px] text-slate-500">Volume Pelaksanaan Jam</p>
      <p className="text-2xl font-bold text-slate-800">
        {formatNumber(realisasi)}
        <span className="text-xs font-normal text-slate-400">
          {" "}
          / {formatNumber(target)} Jam
        </span>
      </p>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(share(realisasi, target), 100)}%`,
            backgroundColor: JAM_COLOR,
          }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
        <span>0 Jam</span>
        <span className="font-medium text-slate-600">
          {formatPercent(share(realisasi, target))} tercapai
        </span>
        <span>{formatNumber(target)} Jam</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-slate-200 p-3">
        <div>
          <p className="text-[10px] text-slate-400">Rata-rata Bulanan</p>
          <p className="text-sm font-bold text-slate-800">
            {formatDecimal(realisasi / BULAN_BERJALAN, 1)} Jam
          </p>
          <p className="text-[10px] text-green-600">per bulan</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400">Rasio Jam / Peserta</p>
          <p className="text-sm font-bold text-slate-800">
            {peserta > 0 ? formatDecimal(realisasi / peserta, 2) : "-"} Jam
          </p>
          <p className="text-[10px] text-green-600">per karyawan</p>
        </div>
      </div>

      <div className="mt-3">
        <MiniTable
          columns={[
            { label: "Level" },
            { label: "Jam", sublabel: "% Jam", align: "right" },
            { label: "% RKAP", align: "right" },
            { label: "Rata²", align: "right" },
          ]}
          rows={LEVELS.map((level) => {
            const jam = jamPerLevel(level);
            const pesertaLevel = sumBy(
              pesertaPerRegional,
              (row) => row[levelKey(level)],
            );
            return {
              key: String(level),
              cells: [
                <LevelName key="level" level={level} />,
                <Stacked
                  key="jam"
                  main={formatNumber(jam)}
                  sub={formatPercent(share(jam, realisasi))}
                />,
                <CapaianValue
                  key="rkap"
                  percent={capaian(jam, targetJamPerLevel[level])}
                />,
                pesertaLevel > 0 ? formatDecimal(jam / pesertaLevel, 2) : "-",
              ],
            };
          })}
          legend={[
            { term: "% Jam", description: "porsi dari total jam pembelajaran" },
            {
              term: "% RKAP",
              description:
                "realisasi jam dibanding target RKAP level tsb (▲ = melebihi)",
            },
            {
              term: "Rata²",
              description: "rata-rata jam per peserta di level tsb",
            },
          ]}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-slate-200 p-3 text-[11px]">
        <span className="text-slate-400">Bidang pembelajaran dominan</span>
        <span className="text-right font-semibold text-slate-700">
          {bidangDominan.bidang} ({formatNumber(bidangDominan.realisasi)} jam ·{" "}
          {formatPercent(share(bidangDominan.realisasi, realisasi))})
        </span>
      </div>
    </SummaryCard>
  );
}

export function ExecutiveSummary() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <BudgetSummaryCard />
      <ParticipantSummaryCard />
      <TrainingHourSummaryCard />
    </div>
  );
}

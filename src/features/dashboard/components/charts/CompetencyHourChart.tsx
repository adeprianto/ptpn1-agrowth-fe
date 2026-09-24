"use client";

import { ConsolidationPanel } from "./ConsolidationPanel";
import { TargetRealisasiChart } from "./TargetRealisasiChart";
import {
  formatNumber,
  formatPercent,
  jamPerBidang as data,
} from "./dashboardDummyData";
import { capaian, isOverTarget } from "./overTarget";

const COLORS = { target: "#A7D8DE", realisasi: "#1F6F78" };
const TOP_N = 3;

const formatHours = (value: number) => `${formatNumber(value)} Jam`;

function CompetencyHourSummary() {
  const total = data.reduce((sum, row) => sum + row.realisasi, 0);
  const totalTarget = data.reduce((sum, row) => sum + row.target, 0);
  const share = (value: number) => (total > 0 ? (value / total) * 100 : 0);
  const [dominan, ...rest] = [...data].sort(
    (a, b) => b.realisasi - a.realisasi,
  );

  const rows = [dominan, ...rest.slice(0, TOP_N - 1)].map((row, index) => {
    const over = isOverTarget(row.realisasi, row.target);
    return {
      name: `${index + 1}. ${row.bidang}`,
      color: COLORS.realisasi,
      value: formatHours(row.realisasi),
      note: (
        <>
          <span className="block">
            <b>{formatPercent(share(row.realisasi))}</b> dari total realisasi
            jam PTPN
          </span>
          <span className="block">
            <b>{formatPercent(capaian(row.realisasi, row.target))}</b> dari
            target bidang ini ({formatHours(row.target)}, PTPN)
          </span>
        </>
      ),
      bar: share(row.realisasi),
      over,
    };
  });

  return (
    <ConsolidationPanel
      accent={COLORS.realisasi}
      title="Bidang Paling Dominan"
      caption={`${data.length} bidang · realisasi PTPN ${formatHours(total)} dari target ${formatHours(totalTarget)}`}
      headline={dominan.bidang}
      headlineUnit={`${formatPercent(share(dominan.realisasi))} dari total realisasi jam PTPN`}
      rows={rows}
      footer={
        <p className="rounded-lg bg-white px-3 py-2 text-[11px] text-slate-500">
          Menampilkan {TOP_N} bidang dengan jam realisasi terbanyak.
        </p>
      }
    />
  );
}

/** Target vs realisasi jam pembelajaran per bidang kompetensi */
export function CompetencyHourChart() {
  return (
    <TargetRealisasiChart
      data={data}
      categoryKey="bidang"
      formatValue={formatHours}
      colors={COLORS}
      subject="target jam"
      side={<CompetencyHourSummary />}
    />
  );
}

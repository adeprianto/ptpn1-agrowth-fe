"use client";

import { ConsolidationPanel } from "./ConsolidationPanel";
import { TargetRealisasiChart } from "./TargetRealisasiChart";
import {
  formatEntityName,
  formatEntityShort,
  formatNumber,
  formatPercent,
  jamPerRegional as data,
} from "./dashboardDummyData";
import { capaian, isOverTarget } from "./overTarget";

const COLORS = { target: "#FCB6B0", realisasi: "#5D1E2E" };

const formatJam = (value: number) => `${formatNumber(value)} Jam`;

function TrainingHourSummary() {
  const target = data.reduce((sum, row) => sum + row.target, 0);
  const realisasi = data.reduce((sum, row) => sum + row.realisasi, 0);
  const persen = capaian(realisasi, target);
  const over = isOverTarget(realisasi, target);
  const gap = target - realisasi;

  return (
    <ConsolidationPanel
      accent={COLORS.realisasi}
      title="Total Konsolidasi Jam"
      caption={`Seluruh ${data.length} entity (HO & regional)`}
      headline={formatNumber(realisasi)}
      headlineUnit={`/ ${formatJam(target)}`}
      progress={{
        percent: persen,
        label: `${formatPercent(persen)} target tercapai`,
        over,
      }}
      rows={[
        { name: "Target", color: COLORS.target, value: formatJam(target) },
        {
          name: "Realisasi",
          color: COLORS.realisasi,
          value: formatJam(realisasi),
          over,
        },
        {
          name: gap > 0 ? "Gap ke target" : "Lebih dari target",
          color: "#cbd5e1",
          value: formatJam(Math.abs(gap)),
        },
      ]}
    />
  );
}

export function TrainingHourChart() {
  return (
    <TargetRealisasiChart
      data={data}
      categoryKey="regional"
      formatTick={formatEntityShort}
      formatName={formatEntityName}
      formatValue={formatJam}
      colors={COLORS}
      subject="target jam"
      side={<TrainingHourSummary />}
    />
  );
}

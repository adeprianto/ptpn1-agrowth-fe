"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts";
import { ConsolidationPanel } from "./ConsolidationPanel";
import { SerapanBadge, capaianTone } from "./overTarget";
import { DIMMED_OPACITY, highlightTick } from "./overTargetBarShape";
import {
  KARPEL_LEVELS,
  KARPIM_LEVELS,
  LEVELS,
  LEVEL_COLORS,
  formatEntityName as entityName,
  formatEntityShort as formatRegionalLabel,
  formatNumber,
  formatPercent,
  levelKey,
  levelLabel,
  pesertaPerRegional as data,
  type Entity,
  type LevelKey,
  type PesertaDatum as ParticipantDatum,
} from "./dashboardDummyData";

interface TooltipPayloadItem {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
  payload?: ParticipantDatum;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const datum = payload[0]?.payload;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-slate-800">
        {entityName(String(label))}
      </p>
      <div className="space-y-1.5">
        {/* Recharts mengirim payload urut bawah→atas; dibalik supaya
            urutannya sama dengan tumpukan yang terlihat (atas→bawah) */}
        {[...payload].reverse().map((item) => (
          <div
            key={String(item.dataKey)}
            className="flex items-center justify-between gap-6 text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-500">{item.name}</span>
            </div>
            <span className="font-medium text-slate-800">
              {formatNumber(Number(item.value))}
            </span>
          </div>
        ))}
      </div>
      {datum && (
        <div className="mt-2 flex items-center justify-between gap-6 border-t border-slate-100 pt-2 text-xs font-semibold">
          <span className="text-slate-600">Total</span>
          <span className="text-slate-800">{formatNumber(datum.total)}</span>
        </div>
      )}
    </div>
  );
}

const ACCENT = "#334155";

function ParticipantLevelSummary() {
  const perLevel = LEVELS.map((level) => ({
    level,
    value: data.reduce((sum, row) => sum + row[levelKey(level)], 0),
  }));
  const grandTotal = perLevel.reduce((sum, item) => sum + item.value, 0);
  const share = (value: number) =>
    grandTotal > 0 ? (value / grandTotal) * 100 : 0;

  // Dua level dengan peserta terbanyak, ditampilkan urut level
  const dominan = [...perLevel]
    .sort((x, y) => y.value - x.value)
    .slice(0, 2)
    .sort((x, y) => x.level - y.level);
  const dominanShare = share(
    dominan.reduce((sum, item) => sum + item.value, 0),
  );

  return (
    <ConsolidationPanel
      accent={ACCENT}
      title="Total Konsolidasi per Level"
      caption={`Seluruh ${data.length} entity (HO & regional)`}
      headline={formatNumber(grandTotal)}
      headlineUnit="Orang"
      rows={perLevel.map(({ level, value }) => ({
        name: levelLabel(level),
        color: LEVEL_COLORS[level],
        value: formatNumber(value),
        note: `${formatPercent(share(value))} dari total · ${KARPIM_LEVELS.includes(level) ? "Karpim" : "Karpel"}`,
        bar: share(value),
      }))}
      footer={
        <p className="rounded-lg bg-white px-3 py-2 text-[11px] text-slate-500">
          Dominasi segmen:{" "}
          <span className="font-semibold text-slate-800">
            {dominan.map((item) => levelLabel(item.level)).join(" & ")} (
            {formatPercent(dominanShare)})
          </span>
        </p>
      }
    />
  );
}

/**
 * Rincian satu entity per level BOD: terlatih vs target peserta, serta
 * porsinya terhadap seluruh karyawan entity & seluruh karyawan level itu.
 */
type DetailDatum = Omit<ParticipantDatum, "regional">;

// Gabungan seluruh entity, dipakai sebagai rincian bawaan (Seluruh PTPN)
const sumLevelValues = (
  pick: (row: ParticipantDatum) => Record<LevelKey, number>,
) =>
  Object.fromEntries(
    LEVELS.map((level) => [
      levelKey(level),
      data.reduce((sum, row) => sum + pick(row)[levelKey(level)], 0),
    ]),
  ) as Record<LevelKey, number>;

const ptpnDatum: DetailDatum = {
  ...sumLevelValues((row) => row),
  total: data.reduce((sum, row) => sum + row.total, 0),
  karpim: data.reduce((sum, row) => sum + row.karpim, 0),
  karpel: data.reduce((sum, row) => sum + row.karpel, 0),
  karyawan: sumLevelValues((row) => row.karyawan),
  targetPeserta: sumLevelValues((row) => row.targetPeserta),
};

interface EntityLevelDetailProps {
  datum: DetailDatum;
  /** Nama di kalimat keterangan, mis. "Regional 1" atau "PTPN" */
  nama: string;
  /** Judul panel, mis. "Regional 1" atau "Seluruh PTPN (7 entity)" */
  judul: string;
  /** Kalau diisi, tampil tombol kembali ke rincian seluruh PTPN */
  onReset?: () => void;
}

function EntityLevelDetail({
  datum,
  nama,
  judul,
  onReset,
}: EntityLevelDetailProps) {
  const share = (value: number, total: number) =>
    total > 0 ? (value / total) * 100 : 0;
  const sumOf = (values: Record<LevelKey, number>) =>
    LEVELS.reduce((sum, level) => sum + values[levelKey(level)], 0);
  const range = (levels: readonly (typeof LEVELS)[number][]) =>
    `${levelLabel(levels[0])}–${levelLabel(levels[levels.length - 1])}`;

  const totalKaryawan = sumOf(datum.karyawan);
  const totalTarget = sumOf(datum.targetPeserta);
  const capaianTotal = share(datum.total, totalTarget);

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            Rincian Peserta — {judul}
          </h4>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {onReset ? (
              <>
                Klik bar lain untuk ganti entity, atau{" "}
                <button
                  type="button"
                  onClick={onReset}
                  className="font-medium text-emerald-700 hover:underline"
                >
                  tampilkan seluruh PTPN
                </button>
              </>
            ) : (
              "Klik bar entity untuk melihat rincian per HO/regional"
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            Karyawan {nama}: <b>{formatNumber(totalKaryawan)}</b> orang
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            Terlatih <b>{formatNumber(datum.total)}</b> dari target{" "}
            <b>{formatNumber(totalTarget)}</b>
            <SerapanBadge
              percent={capaianTotal}
              overTitle="Melebihi target peserta"
            />
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            Karpim ({range(KARPIM_LEVELS)}): <b>{formatNumber(datum.karpim)}</b>
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            Karpel ({range(KARPEL_LEVELS)}): <b>{formatNumber(datum.karpel)}</b>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {LEVELS.map((level) => {
          const key = levelKey(level);
          const terlatih = datum[key];
          const target = datum.targetPeserta[key];
          const karyawanLevel = datum.karyawan[key];
          const capaian = share(terlatih, target);
          const tone = capaianTone(capaian);
          return (
            <div
              key={level}
              className="rounded-lg border border-slate-200 p-3"
              style={{ borderTopColor: LEVEL_COLORS[level], borderTopWidth: 3 }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold text-slate-500">
                  {levelLabel(level)}
                </p>
                <SerapanBadge
                  percent={capaian}
                  overTitle="Melebihi target peserta"
                />
              </div>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatNumber(terlatih)}
                <span className="ml-1 text-[11px] font-normal text-slate-500">
                  / {formatNumber(target)} orang target
                </span>
              </p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(capaian, 100)}%`,
                    backgroundColor: tone.bar,
                  }}
                />
              </div>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Capaian target peserta {levelLabel(level)}
              </p>

              <dl className="mt-2 space-y-1.5 border-t border-slate-100 pt-2 text-[10px] leading-snug text-slate-500">
                <div>
                  <dt className="inline font-bold text-slate-800">
                    {formatPercent(share(terlatih, totalKaryawan))}
                  </dt>{" "}
                  <dd className="inline">
                    karyawan {levelLabel(level)} yang terlatih dari seluruh
                    karyawan {nama} ({formatNumber(totalKaryawan)} orang)
                  </dd>
                </div>
                <div>
                  <dt className="inline font-bold text-slate-800">
                    {formatPercent(share(terlatih, karyawanLevel))}
                  </dt>{" "}
                  <dd className="inline">
                    karyawan {levelLabel(level)} yang terlatih dari seluruh
                    karyawan {levelLabel(level)} di {nama} (
                    {formatNumber(karyawanLevel)} orang)
                  </dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RegionalParticipantsChart() {
  // null = seluruh PTPN (bawaan); klik bar untuk memilih satu entity
  const [selected, setSelected] = useState<Entity | null>(null);
  const selectedDatum = data.find((row) => row.regional === selected);

  // Saat ada entity dipilih, bar entity lain dipudarkan
  const renderSegment = (props: BarShapeProps) => (
    <Rectangle
      {...props}
      fillOpacity={
        selected === null || props.payload?.regional === selected
          ? 1
          : DIMMED_OPACITY
      }
    />
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-80 w-full lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barCategoryGap="25%"
              margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
              style={{ cursor: "pointer" }}
              onClick={(state) => {
                if (state && typeof state.activeLabel === "string") {
                  const label = state.activeLabel as Entity;
                  // Klik bar yang sama lagi = kembali ke seluruh PTPN
                  setSelected((prev) => (prev === label ? null : label));
                }
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="regional"
                axisLine={false}
                tickLine={false}
                tick={highlightTick(selected, formatRegionalLabel)}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={formatNumber}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f8fafc" }}
              />

              {/* stackId sama = ditumpuk. Bar pertama ada di paling bawah. */}
              {LEVELS.map((level, index) => (
                <Bar
                  key={level}
                  dataKey={levelKey(level)}
                  name={levelLabel(level)}
                  stackId="peserta"
                  fill={LEVEL_COLORS[level]}
                  shape={renderSegment}
                >
                  {/* Total per entity ditaruh di atas segmen paling atas */}
                  {index === LEVELS.length - 1 && (
                    <LabelList
                      dataKey="total"
                      position="top"
                      fontSize={11}
                      fill="#334155"
                      formatter={(value) => formatNumber(Number(value))}
                    />
                  )}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <ParticipantLevelSummary />
        </div>
      </div>

      {selectedDatum ? (
        <EntityLevelDetail
          datum={selectedDatum}
          nama={entityName(selectedDatum.regional)}
          judul={entityName(selectedDatum.regional)}
          onReset={() => setSelected(null)}
        />
      ) : (
        <EntityLevelDetail
          datum={ptpnDatum}
          nama="PTPN"
          judul={`Seluruh PTPN (${data.length} entity)`}
        />
      )}
    </div>
  );
}

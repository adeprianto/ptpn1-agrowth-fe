"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { StatusBadge, type BadgeTone } from "@/components/shared/StatusBadge";
import {
  competencyLevelValue,
  type CompetencyRow,
} from "./pegawaiDetailDummyData";
import { cn } from "cn";

interface ProfilKompetensiCardProps {
  standarJabatan: string;
  rows: CompetencyRow[];
}

function getTargetStatus(row: CompetencyRow): {
  tone: BadgeTone;
  label: string;
} {
  const aktual = competencyLevelValue[row.aktual];
  const dibutuhkan = competencyLevelValue[row.dibutuhkan];

  if (aktual > dibutuhkan) return { tone: "emerald", label: "Di Atas Target" };
  if (aktual === dibutuhkan) return { tone: "blue", label: "Sesuai Target" };
  return { tone: "rose", label: "Di Bawah Target" };
}

interface RadarTooltipPayload {
  aspek: string;
  levelSaatIni: number;
  levelDibutuhkan: number;
}

// Tooltip kustom agar saat hover, angka level saat ini & dibutuhkan
// langsung terlihat berdampingan — tidak perlu menaksir posisi titik di radar.
function CompetencyTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: RadarTooltipPayload }>;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const selisih = data.levelSaatIni - data.levelDibutuhkan;
  const selisihLabel = selisih > 0 ? `+${selisih}` : `${selisih}`;
  const selisihColor =
    selisih > 0
      ? "text-emerald-600"
      : selisih === 0
        ? "text-blue-600"
        : "text-rose-600";

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-slate-800">{data.aspek}</p>
      <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
        <p>
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-orange-500" />
          Level Saat Ini:{" "}
          <span className="font-medium text-slate-700">
            {data.levelSaatIni}
          </span>
        </p>
        <p>
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-violet-500" />
          Level Dibutuhkan:{" "}
          <span className="font-medium text-slate-700">
            {data.levelDibutuhkan}
          </span>
        </p>
        <p className={cn("font-semibold", selisihColor)}>
          Selisih: {selisihLabel}
        </p>
      </div>
    </div>
  );
}

export function ProfilKompetensiCard({
  standarJabatan,
  rows,
}: ProfilKompetensiCardProps) {
  const radarData = rows.map((row) => ({
    aspek: row.aspek,
    levelDibutuhkan: competencyLevelValue[row.dibutuhkan],
    levelSaatIni: competencyLevelValue[row.aktual],
  }));

  // Domain dihitung dinamis dari nilai level tertinggi yang ada di data,
  // supaya kalau skala level berubah (misal jadi 1-5) chart tidak perlu diubah manual.
  const maxLevelValue = Math.max(...Object.values(competencyLevelValue));

  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-5">
      <h3 className="inline-block border-b-2 border-emerald-500 pb-1 text-base font-bold text-slate-900">
        Profil Kompetensi
      </h3>
      <p className="mt-2 text-sm text-slate-400">
        Dibandingkan dengan standar jabatan{" "}
        <span className="font-semibold text-slate-600">{standarJabatan}</span> .
        Penilaian siklus terakhir
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData} outerRadius="70%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="aspek"
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <PolarRadiusAxis
            domain={[0, maxLevelValue]}
            tick={false}
            axisLine={false}
          />
          <Tooltip content={<CompetencyTooltip />} />
          <Radar
            name="Level Dibutuhkan"
            dataKey="levelDibutuhkan"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.25}
            dot={{ r: 3, fill: "#8B5CF6", strokeWidth: 0 }}
          />
          <Radar
            name="Level Saat Ini"
            dataKey="levelSaatIni"
            stroke="#F97316"
            fill="#F97316"
            fillOpacity={0.3}
            dot={{ r: 3, fill: "#F97316", strokeWidth: 0 }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mb-4 flex items-center justify-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
          Level Dibutuhkan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
          Level Saat Ini
        </span>
      </div>

      <div className="divide-y divide-slate-50">
        {rows.map((row) => {
          const status = getTargetStatus(row);
          const aktualValue = competencyLevelValue[row.aktual];
          const dibutuhkanValue = competencyLevelValue[row.dibutuhkan];

          return (
            <div
              key={row.aspek}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {row.aspek}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Aktual: {row.aktual} - Dibutuhkan: {row.dibutuhkan}
                </p>
                {/* Mini-bar pembanding per baris: setiap kotak mewakili satu level,
                    kotak terisi oranye = sudah dicapai, kotak dengan ring ungu = level target.
                    Ini memberi perbandingan visual instan tanpa harus melihat radar chart di atas. */}
                <div className="mt-1.5 flex items-center gap-1">
                  {Array.from({ length: maxLevelValue }).map((_, i) => {
                    const step = i + 1;
                    const isFilled = step <= aktualValue;
                    const isTarget = step === dibutuhkanValue;
                    return (
                      <span
                        key={step}
                        className={[
                          "h-1.5 flex-1 rounded-full",
                          isFilled ? "bg-orange-400" : "bg-slate-100",
                          isTarget
                            ? "ring-2 ring-violet-400 ring-offset-1"
                            : "",
                        ].join(" ")}
                      />
                    );
                  })}
                </div>
              </div>
              <StatusBadge tone={status.tone} label={status.label} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

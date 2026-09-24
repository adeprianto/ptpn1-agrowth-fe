import { AlertTriangle } from "lucide-react";
import { formatPercent } from "./dashboardDummyData";

/** Satu warna penanda "melebihi target/anggaran" untuk seluruh dashboard */
export const OVER_COLOR = "#ea580c";

export const isOverTarget = (realisasi: number, target: number) =>
  target > 0 && realisasi > target;

export const capaian = (realisasi: number, target: number) =>
  target > 0 ? (realisasi / target) * 100 : 0;

/** Label kecil "Melebihi" di samping angka */
export function OverBadge({ label = "Melebihi" }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[9px] font-semibold uppercase leading-none text-white"
      style={{ backgroundColor: OVER_COLOR }}
    >
      {label}
    </span>
  );
}

interface OverTargetNoticeProps {
  items: { label: string; realisasi: number; target: number }[];
  /** Kata benda yang dilampaui, mis. "anggaran" atau "target jam" */
  subject: string;
  /** Kalimat penjelas tambahan, mis. arti warna bar */
  hint?: string;
}

/** Banner peringatan; tidak dirender kalau tidak ada yang melebihi target */
export function OverTargetNotice({
  items,
  subject,
  hint,
}: OverTargetNoticeProps) {
  const over = items.filter((item) =>
    isOverTarget(item.realisasi, item.target),
  );
  if (over.length === 0) return null;

  return (
    <div
      className="mb-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs"
      style={{
        borderColor: `${OVER_COLOR}55`,
        backgroundColor: `${OVER_COLOR}10`,
        color: OVER_COLOR,
      }}
    >
      <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
      <p>
        <span className="font-semibold">
          {over.length} melebihi {subject}:
        </span>{" "}
        {over
          .map(
            (item) =>
              `${item.label} (${formatPercent(capaian(item.realisasi, item.target))})`,
          )
          .join(", ")}
        .{hint && ` ${hint}`}
      </p>
    </div>
  );
}

/** Legend manual supaya warna "melebihi target" ikut dijelaskan */
export function ChartLegend({
  items,
}: {
  items: { color: string; label: string }[];
}) {
  return (
    <div className="mb-1 flex flex-wrap justify-end gap-x-4 gap-y-1 text-xs text-slate-600">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** Persentase capaian; oranye + panah kalau melebihi 100% */
export function CapaianValue({ percent }: { percent: number }) {
  const over = percent > 100;
  return (
    <span
      className={over ? "font-semibold" : undefined}
      style={over ? { color: OVER_COLOR } : undefined}
      title={over ? "Melebihi RKAP" : undefined}
    >
      {over && "▲"}
      {formatPercent(percent)}
    </span>
  );
}

/**
 * Warna capaian: 0% merah → 100% hijau, di atas 100% oranye.
 * `bar` untuk isi progress bar, `background`/`text` untuk badge.
 */
export function capaianTone(percent: number) {
  if (percent > 100) {
    return {
      bar: OVER_COLOR,
      background: `${OVER_COLOR}1f`,
      text: OVER_COLOR,
    };
  }
  const hue = (Math.max(percent, 0) / 100) * 120;
  return {
    bar: `hsl(${hue} 70% 45%)`,
    background: `hsl(${hue} 80% 90%)`,
    text: `hsl(${hue} 70% 28%)`,
  };
}

/**
 * Badge persentase capaian berwarna (lihat capaianTone). Dipakai untuk
 * serapan anggaran dan capaian target peserta.
 */
export function SerapanBadge({
  percent,
  overTitle = "Melebihi RKAP",
}: {
  percent: number;
  overTitle?: string;
}) {
  const over = percent > 100;
  const tone = capaianTone(percent);

  return (
    <span
      className="inline-block min-w-[4.5rem] rounded-full px-2 py-0.5 text-center text-[11px] font-semibold tabular-nums"
      style={{ backgroundColor: tone.background, color: tone.text }}
      title={over ? overTitle : undefined}
    >
      {over && "▲"}
      {formatPercent(percent)}
    </span>
  );
}

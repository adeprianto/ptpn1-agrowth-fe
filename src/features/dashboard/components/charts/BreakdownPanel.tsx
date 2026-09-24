import type { BreakdownItem } from "./dashboardDummyData";
import {
  OVER_COLOR,
  OverBadge,
  OverTargetNotice,
  SerapanBadge,
  capaian,
  isOverTarget,
} from "./overTarget";

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

function SisaValue({
  anggaran,
  realisasi,
}: {
  anggaran: number;
  realisasi: number;
}) {
  const over = isOverTarget(realisasi, anggaran);
  return (
    <span style={over ? { color: OVER_COLOR } : undefined}>
      {over
        ? `+${formatRupiah(realisasi - anggaran)}`
        : formatRupiah(anggaran - realisasi)}
    </span>
  );
}

interface BreakdownPanelProps {
  /** Mis. "Regional 7" atau "Head Office, Mar" */
  title: string;
  items: BreakdownItem[];
  onClose: () => void;
}

/**
 * Rincian per kategori RKAP: anggaran vs realisasi. Serapan diwarnai
 * merah (0%) → hijau (100%), dan oranye kalau melebihi anggaran.
 */
export function BreakdownPanel({ title, items, onClose }: BreakdownPanelProps) {
  const total = {
    anggaran: items.reduce((sum, item) => sum + item.anggaran, 0),
    realisasi: items.reduce((sum, item) => sum + item.realisasi, 0),
  };
  const overCount = items.filter((item) =>
    isOverTarget(item.realisasi, item.anggaran),
  ).length;

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            Rincian Anggaran & Realisasi — {title}
          </h4>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {items.length} kategori RKAP
            {overCount > 0 && (
              <span style={{ color: OVER_COLOR }}>
                {" "}
                · {overCount} kategori melebihi anggaran
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          Tutup
        </button>
      </div>

      <OverTargetNotice
        subject="anggaran"
        hint="Baris oranye = kategori yang realisasinya di atas anggaran."
        items={items.map((item) => ({
          label: item.kategori,
          realisasi: item.realisasi,
          target: item.anggaran,
        }))}
      />

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[640px] border-collapse text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Kategori</th>
              <th className="px-3 py-2 text-right font-semibold">Anggaran</th>
              <th className="px-3 py-2 text-right font-semibold">Realisasi</th>
              <th className="px-3 py-2 text-center font-semibold">Serapan</th>
              <th className="px-3 py-2 text-right font-semibold">
                Sisa / Kelebihan
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const over = isOverTarget(item.realisasi, item.anggaran);
              return (
                <tr
                  key={item.kategori}
                  className="border-t border-slate-100 tabular-nums text-slate-700"
                  style={
                    over ? { backgroundColor: `${OVER_COLOR}0f` } : undefined
                  }
                >
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-2">
                      {item.kategori}
                      {over && <OverBadge />}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {formatRupiah(item.anggaran)}
                  </td>
                  <td
                    className="px-3 py-2 text-right font-medium"
                    style={over ? { color: OVER_COLOR } : undefined}
                  >
                    {formatRupiah(item.realisasi)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <SerapanBadge
                      percent={capaian(item.realisasi, item.anggaran)}
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <SisaValue {...item} />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 font-semibold text-slate-800">
            <tr className="border-t border-slate-200 tabular-nums">
              <td className="px-3 py-2">Total</td>
              <td className="px-3 py-2 text-right">
                {formatRupiah(total.anggaran)}
              </td>
              <td className="px-3 py-2 text-right">
                {formatRupiah(total.realisasi)}
              </td>
              <td className="px-3 py-2 text-center">
                <SerapanBadge
                  percent={capaian(total.realisasi, total.anggaran)}
                />
              </td>
              <td className="px-3 py-2 text-right">
                <SisaValue {...total} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
        <p>
          <span className="font-semibold text-slate-500">Serapan</span>:
          realisasi dibanding anggaran kategori itu sendiri.{" "}
          <span className="font-semibold text-slate-500">Sisa / Kelebihan</span>
          : tanda + oranye berarti realisasi sudah melewati anggaran.
        </p>
        <span className="flex items-center gap-1.5">
          0%
          <span
            aria-hidden
            className="h-2 w-20 rounded-full"
            style={{
              background:
                "linear-gradient(to right, hsl(0 80% 80%), hsl(60 80% 80%), hsl(120 80% 80%))",
            }}
          />
          100%
          <span
            aria-hidden
            className="ml-1 h-2 w-4 rounded-full"
            style={{ backgroundColor: OVER_COLOR }}
          />
          &gt;100%
        </span>
      </div>
    </div>
  );
}

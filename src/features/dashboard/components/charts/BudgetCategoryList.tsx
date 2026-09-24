"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  formatCompact,
  formatPercent,
  formatRupiah,
  type KategoriRkap,
} from "./dashboardDummyData";
import { OVER_COLOR, OverBadge, OverTargetNotice } from "./overTarget";

// Tinggi baris dikunci supaya area scroll pas menampilkan VISIBLE_ITEMS baris.
// Saat PSDM tertutup: 1 baris PSDM + 6 kategori lain = 7 baris, tanpa scroll.
const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 7;

const BAR_COLOR = "#3b82f6";

const usage = (item: Pick<KategoriRkap, "anggaran" | "realisasi">) =>
  item.anggaran > 0 ? (item.realisasi / item.anggaran) * 100 : 0;

/** Rupiah penuh kalau baris cukup lebar, ringkas (mis. Rp 22,7 M) kalau sempit */
function Amount({ value }: { value: number }) {
  return (
    <>
      <span className="@[22rem]:hidden">Rp {formatCompact(value)}</span>
      <span className="hidden @[22rem]:inline">{formatRupiah(value)}</span>
    </>
  );
}

interface CategoryRowProps {
  label: string;
  anggaran: number;
  realisasi: number;
  /** Kalau diisi, baris jadi tombol buka/tutup sub-kategori */
  toggle?: { open: boolean; count: number; onToggle: () => void };
}

function CategoryRow({ label, anggaran, realisasi, toggle }: CategoryRowProps) {
  const percent = usage({ anggaran, realisasi });
  const overBudget = percent > 100;

  const content = (
    <>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span
          className={`flex min-w-0 items-center gap-1 text-slate-700 ${toggle ? "font-bold" : "font-medium"}`}
          title={label}
        >
          {toggle && (
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${toggle.open ? "" : "-rotate-90"}`}
            />
          )}
          <span className="truncate">{label}</span>
          {toggle && (
            <span className="shrink-0 font-normal text-slate-400">
              ({toggle.count} sub-kategori)
            </span>
          )}
        </span>
        <span
          className="flex shrink-0 items-center gap-1.5 font-semibold text-slate-700"
          style={overBudget ? { color: OVER_COLOR } : undefined}
        >
          {overBudget && <OverBadge />}
          {formatPercent(percent)}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(percent, 100)}%`,
            backgroundColor: overBudget ? OVER_COLOR : BAR_COLOR,
          }}
        />
      </div>
      <p className="flex gap-x-3 overflow-hidden whitespace-nowrap text-left text-[11px] text-slate-400">
        <span className="whitespace-nowrap">
          Realisasi{" "}
          <span
            className="font-semibold text-slate-700"
            style={overBudget ? { color: OVER_COLOR } : undefined}
          >
            <Amount value={realisasi} />
          </span>
        </span>
        <span className="whitespace-nowrap">
          RKAP{" "}
          <span className="font-medium text-slate-600">
            <Amount value={anggaran} />
          </span>
        </span>
      </p>
    </>
  );

  // @container: label nilai menyesuaikan lebar baris (lihat Amount)
  const className = "@container flex w-full flex-col justify-center gap-1";
  return toggle ? (
    <button
      type="button"
      onClick={toggle.onToggle}
      aria-expanded={toggle.open}
      className={`${className} sticky top-0 z-10 bg-white hover:bg-slate-50`}
      style={{ height: ITEM_HEIGHT }}
    >
      {content}
    </button>
  ) : (
    <div className={className} style={{ height: ITEM_HEIGHT }}>
      {content}
    </div>
  );
}

/**
 * Realisasi tiap kategori RKAP terhadap anggarannya. PSDM tampil sebagai satu
 * baris total; diklik untuk membuka 8 sub-kategorinya.
 */
export function BudgetCategoryList({ data }: { data: KategoriRkap[] }) {
  const [psdmOpen, setPsdmOpen] = useState(false);
  const psdm = data.filter((item) => item.group === "PSDM");
  const lainnya = data.filter((item) => item.group !== "PSDM");

  const psdmTotal = {
    anggaran: psdm.reduce((sum, item) => sum + item.anggaran, 0),
    realisasi: psdm.reduce((sum, item) => sum + item.realisasi, 0),
  };

  return (
    <>
      <OverTargetNotice
        subject="RKAP"
        items={data.map((item) => ({
          label: item.group ? `${item.group} - ${item.name}` : item.name,
          realisasi: item.realisasi,
          target: item.anggaran,
        }))}
      />
      <div
        className="overflow-y-auto pr-2"
        style={{ maxHeight: ITEM_HEIGHT * VISIBLE_ITEMS }}
      >
        <div>
          <CategoryRow
            label="1. PSDM"
            {...psdmTotal}
            toggle={{
              open: psdmOpen,
              count: psdm.length,
              onToggle: () => setPsdmOpen((open) => !open),
            }}
          />
          {psdmOpen && (
            <div className="ml-1 border-l-2 border-slate-100 pl-3">
              {psdm.map((item, index) => (
                <CategoryRow
                  key={item.name}
                  label={`1.${index + 1} ${item.name}`}
                  anggaran={item.anggaran}
                  realisasi={item.realisasi}
                />
              ))}
            </div>
          )}
        </div>

        {lainnya.map((item, index) => (
          <CategoryRow
            key={item.name}
            label={`${index + 2}. ${item.name}`}
            anggaran={item.anggaran}
            realisasi={item.realisasi}
          />
        ))}
      </div>
    </>
  );
}

/** Kartu pendamping: total anggaran RKAP, terpakai, dan sisa yang tersedia */
export function BudgetAvailableSummary({ data }: { data: KategoriRkap[] }) {
  const sum = (items: KategoriRkap[]) => ({
    count: items.length,
    anggaran: items.reduce((total, item) => total + item.anggaran, 0),
    realisasi: items.reduce((total, item) => total + item.realisasi, 0),
  });

  const total = sum(data);
  const sisa = total.anggaran - total.realisasi;
  const percent = usage(total);
  const over = sisa < 0;
  const overStyle = over ? { color: OVER_COLOR } : undefined;

  const groups = [
    { label: "PSDM", ...sum(data.filter((i) => i.group === "PSDM")) },
    {
      label: "Kategori Lainnya",
      ...sum(data.filter((i) => i.group !== "PSDM")),
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Total RKAP
      </p>
      <p className="mt-1 text-2xl font-bold text-slate-900">
        {formatRupiah(total.anggaran)}
      </p>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-emerald-100">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(percent, 100)}%`,
            backgroundColor: over ? OVER_COLOR : BAR_COLOR,
          }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
        <span style={overStyle}>Terpakai {formatPercent(percent)}</span>
        {over ? (
          <OverBadge label="Melebihi RKAP" />
        ) : (
          <span>Tersedia {formatPercent(100 - percent)}</span>
        )}
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: BAR_COLOR }}
            />
            <span className="text-slate-500">Realisasi</span>
          </div>
          <span className="font-semibold text-slate-800">
            {formatRupiah(total.realisasi)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-100 ring-1 ring-emerald-300" />
            <span className="text-slate-500">
              {over ? "Kelebihan Realisasi" : "Sisa RKAP Tersedia"}
            </span>
          </div>
          <span className="font-semibold text-emerald-700" style={overStyle}>
            {formatRupiah(Math.abs(sisa))}
          </span>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2">
        {groups.map((group) => {
          const groupSisa = group.anggaran - group.realisasi;
          return (
            <div
              key={group.label}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <p className="text-xs font-semibold text-slate-700">
                {group.label}{" "}
                <span className="font-normal text-slate-400">
                  ({group.count} kategori)
                </span>
              </p>
              <dl className="mt-2 space-y-1 text-[11px]">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-400">RKAP</dt>
                  <dd className="font-medium text-slate-700">
                    {formatRupiah(group.anggaran)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-400">Realisasi</dt>
                  <dd className="font-medium text-slate-700">
                    {formatRupiah(group.realisasi)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-400">
                    {groupSisa < 0 ? "Kelebihan" : "Tersedia"}
                  </dt>
                  <dd
                    className="font-semibold text-emerald-700"
                    style={groupSisa < 0 ? { color: OVER_COLOR } : undefined}
                  >
                    {formatRupiah(Math.abs(groupSisa))}
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

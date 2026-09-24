"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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

type Amounts = { anggaran: number; realisasi: number };

const sumAmounts = (items: Amounts[]): Amounts => ({
  anggaran: items.reduce((sum, item) => sum + item.anggaran, 0),
  realisasi: items.reduce((sum, item) => sum + item.realisasi, 0),
});

function SisaValue({ anggaran, realisasi }: Amounts) {
  const over = isOverTarget(realisasi, anggaran);
  return (
    <span style={over ? { color: OVER_COLOR } : undefined}>
      {over
        ? `+${formatRupiah(realisasi - anggaran)}`
        : formatRupiah(anggaran - realisasi)}
    </span>
  );
}

interface RowProps extends Amounts {
  label: string;
  /** Baris sub-kategori, digeser ke kanan */
  indent?: boolean;
  /** Baris grup yang bisa dibuka/tutup */
  toggle?: {
    open: boolean;
    count: number;
    overCount: number;
    onToggle: () => void;
  };
}

function BreakdownRow({
  label,
  anggaran,
  realisasi,
  indent,
  toggle,
}: RowProps) {
  const over = isOverTarget(realisasi, anggaran);

  return (
    <tr
      className={`border-t border-slate-100 tabular-nums text-slate-700 ${
        toggle ? "cursor-pointer font-semibold hover:bg-slate-50" : ""
      }`}
      style={over ? { backgroundColor: `${OVER_COLOR}0f` } : undefined}
      onClick={toggle?.onToggle}
      aria-expanded={toggle?.open}
    >
      <td className={`py-2 pr-3 ${indent ? "pl-9" : "pl-3"}`}>
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          {toggle && (
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
                toggle.open ? "" : "-rotate-90"
              }`}
            />
          )}
          {label}
          {toggle && (
            <span className="font-normal text-slate-400">
              ({toggle.count} sub-kategori)
            </span>
          )}
          {over && <OverBadge />}
          {/* Saat grup tertutup, beri tahu kalau ada sub yang melebihi */}
          {toggle && !toggle.open && toggle.overCount > 0 && (
            <span
              className="text-[10px] font-medium"
              style={{ color: OVER_COLOR }}
            >
              {toggle.overCount} sub melebihi anggaran
            </span>
          )}
        </span>
      </td>
      <td className="px-3 py-2 text-right">{formatRupiah(anggaran)}</td>
      <td
        className="px-3 py-2 text-right font-medium"
        style={over ? { color: OVER_COLOR } : undefined}
      >
        {formatRupiah(realisasi)}
      </td>
      <td className="px-3 py-2 text-center">
        <SerapanBadge percent={capaian(realisasi, anggaran)} />
      </td>
      <td className="px-3 py-2 text-right">
        <SisaValue anggaran={anggaran} realisasi={realisasi} />
      </td>
    </tr>
  );
}

interface BreakdownPanelProps {
  /** Mis. "Regional 7" atau "Head Office, Mar" */
  title: string;
  items: BreakdownItem[];
  onClose: () => void;
}

/**
 * Rincian per kategori RKAP: anggaran vs realisasi. Kategori yang punya grup
 * (PSDM) tampil sebagai satu baris total yang bisa dibuka untuk melihat
 * sub-kategorinya. Serapan diwarnai merah (0%) → hijau (100%), oranye kalau
 * melebihi anggaran.
 */
export function BreakdownPanel({ title, items, onClose }: BreakdownPanelProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const total = sumAmounts(items);
  const overCount = items.filter((item) =>
    isOverTarget(item.realisasi, item.anggaran),
  ).length;

  // Urutan tampil: grup muncul di posisi anggota pertamanya
  const groups = new Map<string, BreakdownItem[]>();
  const order: (
    { type: "group"; name: string } | { type: "item"; item: BreakdownItem }
  )[] = [];
  for (const item of items) {
    if (!item.group) {
      order.push({ type: "item", item });
      continue;
    }
    if (!groups.has(item.group)) {
      groups.set(item.group, []);
      order.push({ type: "group", name: item.group });
    }
    groups.get(item.group)!.push(item);
  }

  const toggleGroup = (name: string) =>
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));

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
            {order.map((entry) => {
              if (entry.type === "item") {
                return (
                  <BreakdownRow
                    key={entry.item.kategori}
                    label={entry.item.name}
                    anggaran={entry.item.anggaran}
                    realisasi={entry.item.realisasi}
                  />
                );
              }
              const members = groups.get(entry.name) ?? [];
              const open = Boolean(openGroups[entry.name]);
              return [
                <BreakdownRow
                  key={entry.name}
                  label={entry.name}
                  {...sumAmounts(members)}
                  toggle={{
                    open,
                    count: members.length,
                    overCount: members.filter((m) =>
                      isOverTarget(m.realisasi, m.anggaran),
                    ).length,
                    onToggle: () => toggleGroup(entry.name),
                  }}
                />,
                ...(open
                  ? members.map((member) => (
                      <BreakdownRow
                        key={member.kategori}
                        label={member.name}
                        anggaran={member.anggaran}
                        realisasi={member.realisasi}
                        indent
                      />
                    ))
                  : []),
              ];
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
          Klik baris <span className="font-semibold text-slate-500">PSDM</span>{" "}
          untuk membuka sub-kategorinya.{" "}
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

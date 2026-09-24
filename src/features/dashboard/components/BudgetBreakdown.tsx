"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { MiniTable, type MiniTableRow } from "./MiniTable";
import {
  biayaPerRegional,
  formatCompact,
  formatEntityName,
  formatPercent,
  formatRupiah,
  kategoriKonsolidasi,
} from "./charts/dashboardDummyData";
import {
  OVER_COLOR,
  SerapanBadge,
  capaian,
  isOverTarget,
} from "./charts/overTarget";

type Tab = "entity" | "kategori";

const TABS: { value: Tab; label: string }[] = [
  { value: "entity", label: "Per HO/Regional" },
  { value: "kategori", label: "Per Kategori" },
];

type Row = { name: string; anggaran: number; realisasi: number };

const entityRows: Row[] = biayaPerRegional.map((row) => ({
  name: formatEntityName(row.regional),
  anggaran: row.target,
  realisasi: row.realisasi,
}));

const psdmRows: Row[] = kategoriKonsolidasi
  .filter((row) => row.group === "PSDM")
  .map(({ name, anggaran, realisasi }) => ({ name, anggaran, realisasi }));
const lainnyaRows: Row[] = kategoriKonsolidasi
  .filter((row) => row.group !== "PSDM")
  .map(({ name, anggaran, realisasi }) => ({ name, anggaran, realisasi }));

const sumRows = (rows: Row[], name: string): Row => ({
  name,
  anggaran: rows.reduce((sum, row) => sum + row.anggaran, 0),
  realisasi: rows.reduce((sum, row) => sum + row.realisasi, 0),
});

const psdmTotal = sumRows(psdmRows, "PSDM");
const grandTotal = sumRows(entityRows, "Total PTPN");

/**
 * Rupiah penuh kalau kartu sangat lebar, ringkas (mis. Rp 32,7 M) kalau tidak.
 * Nilai ringkas tetap menampilkan rupiah penuh saat kursor diarahkan.
 */
function Amount({ value }: { value: number }) {
  return (
    <>
      <span className="@[52rem]:hidden" title={formatRupiah(value)}>
        Rp {formatCompact(value)}
      </span>
      <span className="hidden @[52rem]:inline">{formatRupiah(value)}</span>
    </>
  );
}

function SisaValue({ anggaran, realisasi }: Row) {
  const over = isOverTarget(realisasi, anggaran);
  return (
    <span style={over ? { color: OVER_COLOR } : undefined}>
      {over && "+"}
      <Amount value={Math.abs(anggaran - realisasi)} />
    </span>
  );
}

/**
 * Rincian realisasi biaya per HO/regional atau per kategori RKAP, dengan
 * kolom yang sama seperti panel rincian chart biaya. PSDM bisa dibuka-tutup.
 */
export function BudgetBreakdown() {
  const [tab, setTab] = useState<Tab>("entity");
  const [psdmOpen, setPsdmOpen] = useState(false);

  const toCells = (row: Row, label: ReactNode = row.name) => {
    const over = isOverTarget(row.realisasi, row.anggaran);
    return [
      <span key="name" title={row.name}>
        {label}
      </span>,
      <span key="real" style={over ? { color: OVER_COLOR } : undefined}>
        <Amount value={row.realisasi} />
      </span>,
      <Amount key="rkap" value={row.anggaran} />,
      <SerapanBadge
        key="serapan"
        percent={capaian(row.realisasi, row.anggaran)}
      />,
      formatPercent(
        grandTotal.realisasi > 0
          ? (row.realisasi / grandTotal.realisasi) * 100
          : 0,
      ),
    ];
  };

  const bodyRows: MiniTableRow[] =
    tab === "entity"
      ? entityRows.map((row) => ({ key: row.name, cells: toCells(row) }))
      : [
          {
            key: "PSDM",
            emphasis: true,
            expanded: psdmOpen,
            onClick: () => setPsdmOpen((open) => !open),
            cells: toCells(
              psdmTotal,
              <span className="flex items-center gap-1">
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
                    psdmOpen ? "" : "-rotate-90"
                  }`}
                />
                PSDM
                <span className="font-normal text-slate-400">
                  ({psdmRows.length} sub-kategori)
                </span>
              </span>,
            ),
          },
          ...(psdmOpen
            ? psdmRows.map((row) => ({
                key: `PSDM-${row.name}`,
                cells: toCells(
                  row,
                  <span className="block truncate pl-5 text-slate-600">
                    {row.name}
                  </span>,
                ),
              }))
            : []),
          ...lainnyaRows.map((row) => ({ key: row.name, cells: toCells(row) })),
        ];

  const rows: MiniTableRow[] = [
    ...bodyRows,
    { key: "total", emphasis: true, cells: toCells(grandTotal) },
  ];

  return (
    <div className="@container flex flex-1 flex-col">
      <div className="mb-3 flex w-full max-w-xs rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTab(item.value)}
            className={`flex-1 rounded-md px-2 py-1 transition-colors ${
              tab === item.value
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <MiniTable
        size="comfortable"
        maxRows={8}
        columns={[
          { label: tab === "entity" ? "Entitas" : "Kategori", grow: true },
          { label: "Realisasi", align: "right" },
          { label: "RKAP", align: "right" },
          { label: "% RKAP", align: "center" },
          { label: "% Total Realisasi", align: "right", nowrap: true },
        ]}
        rows={rows}
        legend={[
          {
            term: "% RKAP",
            description: `realisasi dibanding RKAP ${tab === "entity" ? "entitas" : "kategori"} itu sendiri; merah (0%) → hijau (100%), oranye ▲ = melebihi`,
          },
          {
            term: "% Real",
            description: "porsi terhadap total realisasi PTPN",
          },

          ...(tab === "kategori"
            ? [
                {
                  term: "PSDM",
                  description: "klik baris untuk membuka sub-kategorinya",
                },
              ]
            : []),
        ]}
      />
    </div>
  );
}

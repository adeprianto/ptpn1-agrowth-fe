"use client";

import { Fragment, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, Plus, RotateCcw, X } from "lucide-react";
import { ColumnFilterModal } from "@/components/shared/data-table";
import { Card, Input, Modal } from "@/components/ui";
import { cn } from "cn";
import {
  DIMENSIONS,
  METRICS,
  dimensionByKey,
  type AnalitikFilter,
  type DimensionKey,
  type MetricKey,
} from "../model/analitik";

function ControlRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
      <p className="shrink-0 text-xs font-medium tracking-wide text-slate-400 uppercase sm:w-24 sm:pt-2">
        {label}
      </p>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function FilterChip({
  filter,
  onEdit,
  onRemove,
}: {
  filter: AnalitikFilter;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const { label } = dimensionByKey[filter.dim];
  const summary =
    filter.values.length <= 2
      ? filter.values.join(", ")
      : `${filter.values[0]} +${filter.values.length - 1}`;

  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 py-1 pr-1.5 pl-3 text-sm text-emerald-800">
      <button
        type="button"
        onClick={onEdit}
        title={filter.values.join(", ")}
        className="flex min-w-0 items-center gap-1"
      >
        <span className="text-xs opacity-70">{label}:</span>
        <span className="truncate font-medium">{summary}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Hapus filter ${label}`}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full hover:bg-emerald-100"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

interface AnalitikControlsProps {
  dateFrom: string;
  dateTo: string;
  onDateChange: (from: string, to: string) => void;
  filters: AnalitikFilter[];
  onFilterChange: (dim: DimensionKey, values: string[] | undefined) => void;
  onReset: () => void;
  metric: MetricKey;
  onMetricChange: (metric: MetricKey) => void;
  /** Dimensi pengelompokan yang sedang berlaku; `undefined` kalau semua terkunci */
  groupBy: DimensionKey | undefined;
  /** Dimensi yang dikunci ke tepat satu nilai — tidak bisa jadi pengelompokan */
  lockedDims: DimensionKey[];
  onGroupByChange: (dim: DimensionKey) => void;
}

/**
 * Panel kontrol analitik. Pilihan nilai filter dibuka sebagai modal (sama
 * seperti filter kolom tabel) supaya daftar panjang seperti 14 kategori RKAP
 * tidak terpotong di layar kecil.
 */
export function AnalitikControls({
  dateFrom,
  dateTo,
  onDateChange,
  filters,
  onFilterChange,
  onReset,
  metric,
  onMetricChange,
  groupBy,
  lockedDims,
  onGroupByChange,
}: AnalitikControlsProps) {
  // dimensi yang nilai filternya sedang dipilih di modal
  const [editingDim, setEditingDim] = useState<DimensionKey | null>(null);
  const [pickingDim, setPickingDim] = useState(false);

  const unusedDims = DIMENSIONS.filter((d) => !filters.some((f) => f.dim === d.key));
  const editing = editingDim ? dimensionByKey[editingDim] : null;

  return (
    <Card className="space-y-4">
      <ControlRow label="Periode">
        <div className="grid max-w-sm grid-cols-[1fr_auto_1fr] items-center gap-2">
          <Input
            type="date"
            aria-label="Tanggal mulai"
            value={dateFrom}
            max={dateTo}
            onChange={(e) => e.target.value && onDateChange(e.target.value, dateTo)}
          />
          <span className="text-slate-400">s/d</span>
          <Input
            type="date"
            aria-label="Tanggal akhir"
            value={dateTo}
            min={dateFrom}
            onChange={(e) => e.target.value && onDateChange(dateFrom, e.target.value)}
          />
        </div>
      </ControlRow>

      <ControlRow label="Filter">
        <div className="flex flex-wrap items-center gap-2">
          {filters.length === 0 && (
            <span className="py-1 text-sm text-slate-400">Semua data dalam cakupan Anda</span>
          )}

          {filters.map((filter, index) => (
            <Fragment key={filter.dim}>
              {/* urutan chip = jejak drill-down */}
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
              <FilterChip
                filter={filter}
                onEdit={() => setEditingDim(filter.dim)}
                onRemove={() => onFilterChange(filter.dim, undefined)}
              />
            </Fragment>
          ))}

          {unusedDims.length > 0 && (
            <button
              type="button"
              onClick={() => setPickingDim(true)}
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Filter
            </button>
          )}

          {filters.length > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="ml-auto flex items-center gap-1.5 px-2 text-xs text-slate-400 hover:text-slate-600"
            >
              <RotateCcw className="h-3 w-3" />
              Reset semua
            </button>
          )}
        </div>
      </ControlRow>

      <ControlRow label="Metrik">
        <div className="inline-flex max-w-full flex-wrap rounded-xl bg-slate-100 p-1">
          {METRICS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              aria-pressed={metric === key}
              onClick={() => onMetricChange(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors sm:px-4",
                metric === key
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </ControlRow>

      <ControlRow label="Lihat per">
        <div className="flex flex-wrap items-center gap-2">
          {DIMENSIONS.map((dim) => {
            const locked = lockedDims.includes(dim.key);
            const active = groupBy === dim.key;

            return (
              <button
                key={dim.key}
                type="button"
                disabled={locked}
                aria-pressed={active}
                onClick={() => onGroupByChange(dim.key)}
                title={locked ? "Sudah dikunci ke satu nilai di Filter" : undefined}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  locked
                    ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                    : active
                      ? "border-emerald-950 bg-emerald-950 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                {dim.label}
              </button>
            );
          })}
        </div>
      </ControlRow>

      {/* Langkah 1 tambah filter: pilih dimensinya */}
      <Modal
        open={pickingDim}
        onClose={() => setPickingDim(false)}
        size="sm"
        title="Tambah Filter"
        description="Pilih data yang ingin disaring."
      >
        <div className="space-y-1">
          {unusedDims.map((dim) => (
            <button
              key={dim.key}
              type="button"
              onClick={() => {
                setPickingDim(false);
                setEditingDim(dim.key);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              {dim.label}
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </button>
          ))}
        </div>
      </Modal>

      {/* Langkah 2 (atau ubah chip): centang nilainya */}
      <ColumnFilterModal
        open={editing !== null}
        label={editing?.label ?? ""}
        config={{
          options: editing?.values.map((value) => ({ value, label: value })) ?? [],
        }}
        value={filters.find((f) => f.dim === editingDim)?.values}
        onApply={(values) => editingDim && onFilterChange(editingDim, values)}
        onClose={() => setEditingDim(null)}
      />
    </Card>
  );
}

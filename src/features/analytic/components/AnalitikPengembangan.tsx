"use client";

import { useMemo, useState } from "react";
import { Clock, Download, MousePointerClick, Users, Wallet } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import { Alert, Button, Card, EmptyState, Spinner, useToast } from "@/components/ui";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { useAsyncData } from "@/hooks/useAsyncData";
import { formatDate } from "@/lib/format";
import { cn } from "cn";
import { getAnalitik } from "../api/analitik";
import { exportAnalitikExcel } from "../api/exportAnalitik";
import {
  DIMENSIONS,
  dimensionByKey,
  formatMetric,
  metricByKey,
  type AnalitikFilter,
  type AnalitikResult,
  type DimensionKey,
  type MetricKey,
} from "../model/analitik";
import { AnalitikChart } from "./AnalitikChart";
import { AnalitikControls } from "./AnalitikControls";
import { AnalitikTable } from "./AnalitikTable";

const DEFAULT_GROUP_BY: DimensionKey = "entity";

/** 1 Januari tahun ini s/d hari ini, dalam zona waktu browser */
function defaultPeriod() {
  const today = new Date();
  const iso = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return { from: `${today.getFullYear()}-01-01`, to: iso(today) };
}

export function AnalitikPengembangan() {
  const toast = useToast();

  const [metric, setMetric] = useState<MetricKey>("biaya");
  const [groupBy, setGroupBy] = useState<DimensionKey>(DEFAULT_GROUP_BY);
  // urutan = jejak drill-down, ditampilkan sebagai chip berurutan
  const [filters, setFilters] = useState<AnalitikFilter[]>([]);
  const [period, setPeriod] = useState(defaultPeriod);
  const [exporting, setExporting] = useState(false);

  // Dimensi yang dikunci ke satu nilai tidak berguna sebagai pengelompokan
  // (chart-nya cuma satu batang), jadi pengelompokan pindah ke dimensi lain.
  const lockedDims = filters.filter((f) => f.values.length === 1).map((f) => f.dim);
  const availableDims = DIMENSIONS.filter((d) => !lockedDims.includes(d.key));
  const effectiveGroupBy = availableDims.some((d) => d.key === groupBy)
    ? groupBy
    : availableDims[0]?.key;
  const canDrill = availableDims.length > 1;

  const { data, loading, error } = useAsyncData(
    (signal) =>
      getAnalitik(
        {
          groupBy: effectiveGroupBy ?? DEFAULT_GROUP_BY,
          filters,
          dateFrom: period.from,
          dateTo: period.to,
        },
        signal,
      ),
    { deps: [effectiveGroupBy, filters, period], enabled: effectiveGroupBy !== undefined },
  );

  // Hasil sebelumnya tetap tampil (diredupkan) selama data baru dimuat,
  // supaya chart tidak berkedip kosong setiap kali filter diubah.
  const [shown, setShown] = useState<AnalitikResult | null>(null);
  if (data && data !== shown) setShown(data);
  const result = effectiveGroupBy ? (data ?? shown) : null;

  // Entity & Level BOD punya urutan baku; dimensi lain diurutkan dari nilai
  // terbesar untuk metrik yang dipilih.
  const rows = useMemo(() => {
    if (!result || !effectiveGroupBy) return [];
    if (dimensionByKey[effectiveGroupBy].ordered) return result.rows;
    return [...result.rows].sort((a, b) => b[metric] - a[metric]);
  }, [result, effectiveGroupBy, metric]);

  const total = result?.total ?? { biaya: 0, jam: 0, peserta: 0 };
  const metricLabel = metricByKey[metric].label;
  const groupLabel = effectiveGroupBy ? dimensionByKey[effectiveGroupBy].label : "";

  const activeFilters = filters.filter((f) => f.values.length > 0);
  const keterangan = [
    activeFilters.length === 0
      ? "Semua data"
      : activeFilters
          .map((f) => `${dimensionByKey[f.dim].label}: ${f.values.join(", ")}`)
          .join(" · "),
    `${formatDate(period.from, "short")} s/d ${formatDate(period.to, "short")}`,
  ].join(" · ");

  const involvesDepartemen =
    effectiveGroupBy === "departemen" || filters.some((f) => f.dim === "departemen");

  const average =
    total.peserta === 0
      ? "-"
      : metric === "jam"
        ? formatMetric("jam", Math.round((total.jam / total.peserta) * 10) / 10)
        : formatMetric("biaya", total.biaya / total.peserta);

  /** Klik batang/baris: kunci dimensi aktif ke nilai itu, lalu pindah ke dimensi berikutnya. */
  function drillInto(value: string) {
    if (!effectiveGroupBy || !canDrill) return;
    const dim = effectiveGroupBy;

    setFilters((prev) =>
      prev.some((f) => f.dim === dim)
        ? prev.map((f) => (f.dim === dim ? { ...f, values: [value] } : f))
        : [...prev, { dim, values: [value] }],
    );

    const next = DIMENSIONS.find((d) => d.key !== dim && !lockedDims.includes(d.key));
    if (next) setGroupBy(next.key);
  }

  function changeFilter(dim: DimensionKey, values: string[] | undefined) {
    setFilters((prev) => {
      if (!values?.length) return prev.filter((f) => f.dim !== dim);
      return prev.some((f) => f.dim === dim)
        ? prev.map((f) => (f.dim === dim ? { ...f, values } : f))
        : [...prev, { dim, values }];
    });
  }

  function resetAll() {
    setFilters([]);
    setGroupBy(DEFAULT_GROUP_BY);
    setPeriod(defaultPeriod());
  }

  async function handleExport() {
    if (rows.length === 0) return;
    setExporting(true);
    try {
      await exportAnalitikExcel({ rows, total, metric, groupLabel, keterangan });
      toast.success("File Excel berhasil dibuat");
    } catch (caught) {
      toast.error("Export Excel gagal", (caught as Error).message);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Analitik Pengembangan" }]}
      />

      <PageHeader
        title="Analitik Pengembangan SDM"
        description="Klik batang pada chart untuk masuk lebih dalam, lalu pilih cara pengelompokan berikutnya."
        action={
          <Button
            variant="outline"
            size="lg"
            icon={Download}
            loading={exporting}
            disabled={rows.length === 0}
            onClick={handleExport}
          >
            Export Excel
          </Button>
        }
      />

      <Alert tone="info">
        Angka di halaman ini masih data contoh (dummy) sampai endpoint analitik tersedia di
        backend.
      </Alert>

      <AnalitikControls
        dateFrom={period.from}
        dateTo={period.to}
        onDateChange={(from, to) => setPeriod({ from, to })}
        filters={filters}
        onFilterChange={changeFilter}
        onReset={resetAll}
        metric={metric}
        onMetricChange={setMetric}
        groupBy={effectiveGroupBy}
        lockedDims={lockedDims}
        onGroupByChange={setGroupBy}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryStatCard
          label="Total Biaya"
          value={formatMetric("biaya", total.biaya)}
          icon={Wallet}
          highlighted={metric === "biaya"}
        />
        <SummaryStatCard
          label="Total Jam Pembelajaran"
          value={formatMetric("jam", total.jam)}
          icon={Clock}
          highlighted={metric === "jam"}
        />
        <SummaryStatCard
          label="Total Peserta"
          value={formatMetric("peserta", total.peserta)}
          icon={Users}
          highlighted={metric === "peserta"}
        />
        <SummaryStatCard
          label={metric === "jam" ? "Rata-rata Jam / Peserta" : "Rata-rata Biaya / Peserta"}
          value={average}
          icon={metric === "jam" ? Clock : Wallet}
        />
      </div>

      {involvesDepartemen && (
        <Alert tone="warning">
          Detail peserta pelatihan belum menyimpan departemen pegawai, jadi dimensi Departemen baru
          bisa berisi data asli setelah pegawai terhubung ke struktur organisasi.
        </Alert>
      )}

      {error && <Alert tone="error">Gagal memuat data analitik: {error}</Alert>}

      <DashboardCard
        title={effectiveGroupBy ? `${metricLabel} per ${groupLabel}` : metricLabel}
        subtitle={keterangan}
        menuItems={[{ label: "Unduh Excel", onClick: handleExport }]}
        headerAction={
          canDrill && rows.length > 0 ? (
            <span className="hidden items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-400 sm:flex">
              <MousePointerClick className="h-3 w-3" />
              Klik batang untuk masuk lebih dalam
            </span>
          ) : null
        }
      >
        {!effectiveGroupBy ? (
          <EmptyState
            title="Semua dimensi sudah dikunci"
            description="Hapus atau lebarkan salah satu filter untuk melihat perbandingan."
          />
        ) : !result ? (
          <div className="flex h-72 items-center justify-center">
            <Spinner />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title="Tidak ada data"
            description="Tidak ada realisasi pelatihan untuk kombinasi filter dan periode ini."
          />
        ) : (
          <div className={cn("transition-opacity", loading && "opacity-60")}>
            <AnalitikChart
              rows={rows}
              metric={metric}
              onBarClick={canDrill ? drillInto : undefined}
            />
          </div>
        )}
      </DashboardCard>

      {rows.length > 0 && (
        <Card padding="none" className={cn("overflow-hidden transition-opacity", loading && "opacity-60")}>
          <AnalitikTable
            rows={rows}
            total={total}
            metric={metric}
            groupLabel={groupLabel}
            onRowClick={canDrill ? drillInto : undefined}
          />
        </Card>
      )}
    </div>
  );
}

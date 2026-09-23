"use client";

import { useState } from "react";
import { Factory, LandPlot, Plus, Sprout, User } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import {
  filterList,
  filterText,
  useServerDataTable,
} from "@/components/shared/data-table";
import { Alert, ButtonLink } from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { formatNumber } from "@/lib/format";
import { UnitTable } from "./UnitTable";
import { getUnitTypeDisplay } from "./jenisUnit";
import { deleteUnit, getUnits, getUnitSummary } from "../../api/unit";
import { getRegionals } from "../../api/regional";
import { getBusinessTypes, getOperationalCategories } from "../../api/masterData";
import { withDistinctLabels, type MasterItem } from "../../model/masterData";
import type { Unit } from "../../model/unit";

interface UnitFilterOptions {
  regional: MasterItem[];
  jenis: MasterItem[];
  komoditas: MasterItem[];
}

/** Isi checklist filter kolom; sumbernya beda-beda jadi diambil sekaligus. */
async function getUnitFilterOptions(signal: AbortSignal): Promise<UnitFilterOptions> {
  const [regionals, categories, businessTypes] = await Promise.all([
    getRegionals({ perPage: 100 }, signal),
    getOperationalCategories(signal),
    getBusinessTypes(signal),
  ]);

  return {
    regional: regionals.rows.map((row) => ({
      id: row.id,
      kode: row.kode,
      nama: row.nama,
    })),
    // kategori operasional ditampilkan dengan label UI-nya (Kebun / Pabrik)
    jenis: categories.map((item) => ({ ...item, nama: getUnitTypeDisplay(item).label })),
    komoditas: withDistinctLabels(businessTypes),
  };
}

export function UnitList() {
  const { user } = useAuth();
  // akun Unit tidak bisa membuat unit baru (regional induknya di luar cakupannya)
  const canCreate = user.role !== "UNIT";

  // dinaikkan setelah hapus supaya ringkasan ikut diambil ulang
  const [dataVersion, setDataVersion] = useState(0);

  const { tableState, rows, total, loading, error, refresh, startIndex } =
    useServerDataTable<Unit>({
      fetcher: ({ filters, sort, direction, page, perPage }, signal) =>
        getUnits(
          {
            // id kolom di tabel = nama parameter sort/filter di backend
            nama: filterText(filters.name),
            regional: filterText(filters.regional_id),
            regionalIds: filterList(filters.regional_id),
            jenisIds: filterList(filters.operational_category_id),
            komoditasIds: filterList(filters.business_type_id),
            sort,
            direction,
            page,
            perPage,
          },
          signal,
        ).then((res) => ({
          rows: res.rows,
          total: res.meta?.total ?? res.rows.length,
        })),
    });

  const { data: summary } = useAsyncData(getUnitSummary, { deps: [dataVersion] });
  const { data: options } = useAsyncData(getUnitFilterOptions);

  // Gagal menghapus (mis. 409 karena unit masih punya pegawai) tidak
  // menyegarkan tabel maupun ringkasan — pesannya muncul di Alert di bawah.
  const hapus = useDeleteConfirm<Unit>({
    onDelete: (row) => deleteUnit(row.id),
    onSuccess: () => {
      refresh();
      setDataVersion((version) => version + 1);
    },
  });

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/organisasi" },
          { label: "Unit" },
        ]}
      />

      <PageHeader
        title="Unit"
        description="Kebun dan Pabrik di seluruh wilayah PTPN 1"
        action={
          canCreate ? (
            <ButtonLink href="/organisasi/unit/create" size="lg" icon={Plus}>
              Tambah Unit
            </ButtonLink>
          ) : null
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryStatCard
          label="Total Unit"
          value={formatNumber(summary?.totalUnit)}
          icon={LandPlot}
        />
        <SummaryStatCard
          label="Kebun"
          value={formatNumber(summary?.totalKebun)}
          icon={Sprout}
        />
        <SummaryStatCard
          label="Pabrik"
          value={formatNumber(summary?.totalPabrik)}
          icon={Factory}
        />
        <SummaryStatCard
          label="Total Karyawan"
          value={formatNumber(summary?.totalKaryawan)}
          icon={User}
        />
      </div>

      {error && <Alert tone="error">Gagal memuat data unit: {error}</Alert>}

      {hapus.error && (
        <Alert tone="error" onDismiss={hapus.dismissError}>
          {hapus.error}
        </Alert>
      )}

      <UnitTable
        rows={rows}
        rowCount={total}
        tableState={tableState}
        loading={loading}
        startIndex={startIndex}
        regionalOptions={options?.regional}
        jenisOptions={options?.jenis}
        komoditasOptions={options?.komoditas}
        onDelete={hapus.ask}
      />

      <ConfirmDialog
        open={hapus.target !== null}
        title={`Hapus ${hapus.target?.nama}?`}
        description="Unit hanya bisa dihapus kalau sudah tidak punya pegawai maupun user. Data jenis & komoditasnya ikut terhapus."
        confirmLabel="Hapus"
        variant="danger"
        loading={hapus.deleting}
        onConfirm={hapus.confirm}
        onCancel={hapus.cancel}
      />
    </div>
  );
}

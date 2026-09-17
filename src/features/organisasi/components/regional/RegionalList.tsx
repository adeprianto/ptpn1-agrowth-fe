"use client";

import { useMemo, useState } from "react";
import { Flag, Network, Plus, User } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { RegionalFilterBar, type UnitRangeFilter } from "./RegionalFilterBar";
import { RegionalTable } from "./RegionalTable";
import {
  RegionalFormModal,
  type RegionalFormValues,
} from "./RegionalFormModal";
import {
  regionalRows as initialRegionalRows,
  type RegionalRow,
} from "./regionalDummyData";
import { Pagination } from "@/components/shared/Pagination";
import { usePagination } from "@/hooks/usePagination";

export function RegionalList() {
  // DUMMY DATA sebagai state lokal — belum ada backend, jadi "Simpan" cuma
  // update state di sini. Begitu API siap, ganti jadi fetch + mutate.
  const [rows, setRows] = useState<RegionalRow[]>(initialRegionalRows);

  const [search, setSearch] = useState("");
  const [wilayah, setWilayah] = useState("all");
  const [unitRange, setUnitRange] = useState<UnitRangeFilter>("all");

  const [deleteTarget, setDeleteTarget] = useState<RegionalRow | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingRow, setEditingRow] = useState<RegionalRow | null>(null);
  // Dinaikkan tiap modal dibuka, dipakai sebagai `key` supaya RegionalFormModal
  // di-remount (state form fresh) tanpa perlu useEffect buat reset.
  const [formKey, setFormKey] = useState(0);

  const wilayahOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.wilayah))),
    [rows],
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const keyword = search.trim().toLowerCase();
      const matchSearch =
        keyword === "" ||
        row.nama.toLowerCase().includes(keyword) ||
        row.wilayah.toLowerCase().includes(keyword);

      const matchWilayah = wilayah === "all" || row.wilayah === wilayah;

      const matchUnitRange =
        unitRange === "all" ||
        (unitRange === "under10" && row.jumlahUnit < 10) ||
        (unitRange === "10to20" &&
          row.jumlahUnit >= 10 &&
          row.jumlahUnit <= 20) ||
        (unitRange === "over20" && row.jumlahUnit > 20);

      return matchSearch && matchWilayah && matchUnitRange;
    });
  }, [rows, search, wilayah, unitRange]);

  const { paginatedData, currentPage, totalPages, setCurrentPage, pageSize } =
    usePagination({ data: filteredRows, pageSize: 5 });

  const totalUnit = rows.reduce((sum, r) => sum + r.jumlahUnit, 0);
  const totalKaryawan = rows.reduce((sum, r) => sum + r.jumlahKaryawan, 0);

  function openCreateModal() {
    setFormMode("create");
    setEditingRow(null);
    setFormOpen(true);
    setFormKey((k) => k + 1);
  }

  function openEditModal(row: RegionalRow) {
    setFormMode("edit");
    setEditingRow(row);
    setFormOpen(true);
    setFormKey((k) => k + 1);
  }

  function handleFormSubmit(values: RegionalFormValues) {
    if (formMode === "create") {
      const newRow: RegionalRow = {
        id: `local-${Date.now()}`,
        kode: values.kode,
        nama: values.nama,
        wilayah: values.wilayah,
        jumlahUnit: 0,
        jumlahKaryawan: 0,
        kepalaRegional: "-",
      };
      setRows((prev) => [...prev, newRow]);
    } else if (editingRow) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingRow.id
            ? {
                ...row,
                kode: values.kode,
                nama: values.nama,
                wilayah: values.wilayah,
              }
            : row,
        ),
      );
    }
    setFormOpen(false);
  }

  function handleConfirmDelete() {
    if (deleteTarget) {
      setRows((prev) => prev.filter((row) => row.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  }

  const editingFormValues: RegionalFormValues | undefined = editingRow
    ? {
        nama: editingRow.nama,
        kode: editingRow.kode,
        wilayah: editingRow.wilayah,
        // noTelepon: "",
        // alamat: "",
      }
    : undefined;

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/organisasi" },
          { label: "Regional" },
        ]}
      />

      <PageHeader
        title="Regional"
        description="Struktur wilayah kerja PTPN 1 di bawah Head Office"
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Tambah Regional
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryStatCard
          label="Total Regional"
          value={rows.length}
          icon={Flag}
        />
        <SummaryStatCard label="Total Unit" value={totalUnit} icon={Network} />
        <SummaryStatCard
          label="Total Karyawan"
          value={totalKaryawan.toLocaleString("id-ID")}
          icon={User}
        />
      </div>

      <RegionalFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        wilayahOptions={wilayahOptions}
        wilayahValue={wilayah}
        onWilayahChange={setWilayah}
        unitRangeValue={unitRange}
        onUnitRangeChange={setUnitRange}
      />

      <RegionalTable
        rows={paginatedData}
        onEditClick={openEditModal}
        onDeleteClick={setDeleteTarget}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredRows.length}
        pageSize={pageSize}
      />

      <RegionalFormModal
        key={formKey}
        open={formOpen}
        mode={formMode}
        initialValues={editingFormValues}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Hapus ${deleteTarget?.nama}?`}
        description="Data regional beserta unit di bawahnya tidak bisa dikembalikan setelah dihapus."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

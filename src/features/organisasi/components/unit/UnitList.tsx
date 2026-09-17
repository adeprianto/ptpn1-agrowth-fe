"use client";

import { Factory, LandPlot, Plus, Sprout } from "lucide-react";
import { useMemo, useState } from "react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import { UnitFilterBar } from "../unit/UnitFilterBar";
import { unitRows, type UnitRow } from "./unitDummyData";
import { UnitTable } from "./UnitTable";
import { UnitFormModal, type UnitFormValues } from "./UnitFormModal";
import {
  regionalParentOptions,
  kategoriOptions,
  komoditasOptions,
} from "./unitFormOptions";

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: UnitFormValues;
  editingRow?: UnitRow;
}

export function UnitList() {
  const [rows, setRows] = useState<UnitRow[]>(unitRows);

  const [search, setSearch] = useState("");
  const [regional, setRegional] = useState("all");
  const [jenis, setJenis] = useState("all");
  const [komoditas, setKomoditas] = useState("all");

  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    mode: "create",
  });

  const regionalOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.regional))),
    [rows],
  );

  const jenisOptions = useMemo(
    () => Array.from(new Set(rows.map((r) => r.tipe))),
    [rows],
  );

  const komoditasOptionsFilter = useMemo(
    () => Array.from(new Set(rows.map((r) => r.komoditas))),
    [rows],
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const keyword = search.trim().toLowerCase();
      const matchSearch =
        keyword === "" ||
        row.kode.toLowerCase().includes(keyword) ||
        row.name.toLowerCase().includes(keyword) ||
        row.kepalaUnit.toLowerCase().includes(keyword);

      const matchRegional = regional === "all" || row.regional === regional;
      const matchJenis = jenis === "all" || row.tipe === jenis;
      const matchKomoditas = komoditas === "all" || row.komoditas === komoditas;

      return matchSearch && matchRegional && matchJenis && matchKomoditas;
    });
  }, [rows, search, regional, jenis, komoditas]);

  function openCreateModal() {
    setModalState({ open: true, mode: "create" });
  }

  function openEditModal(row: UnitRow) {
    setModalState({
      open: true,
      mode: "edit",
      editingRow: row,
      initialValues: {
        kode: row.kode,
        name: row.name,
        regionalId:
          regionalParentOptions.find((opt) => opt.label === row.regional)?.id ??
          "",
        kategoriId:
          kategoriOptions.find((opt) => opt.label === row.tipe)?.id ?? "",
        komoditasId:
          komoditasOptions.find((opt) => opt.label === row.komoditas)?.id ?? "",
      },
    });
  }

  function closeModal() {
    setModalState({ open: false, mode: "create" });
  }

  function handleSubmitModal(values: UnitFormValues) {
    const regionalLabel =
      regionalParentOptions.find((opt) => opt.id === values.regionalId)
        ?.label ?? "";
    const kategoriLabel =
      kategoriOptions.find((opt) => opt.id === values.kategoriId)?.label ?? "";
    const komoditasLabel =
      komoditasOptions.find((opt) => opt.id === values.komoditasId)?.label ??
      "";

    if (modalState.mode === "create") {
      const newRow: UnitRow = {
        id: `unit-${Date.now()}`,
        kode: values.kode,
        name: values.name,
        regional: regionalLabel,
        tipe: kategoriLabel,
        komoditas: komoditasLabel,
        kepalaUnit: "-",
        jumlahKaryawan: 0,
      };
      setRows((prev) => [...prev, newRow]);
    } else if (modalState.editingRow) {
      const target = modalState.editingRow;
      setRows((prev) =>
        prev.map((row) =>
          row === target
            ? {
                ...row,
                kode: values.kode,
                name: values.name,
                regional: regionalLabel,
                tipe: kategoriLabel,
                komoditas: komoditasLabel,
              }
            : row,
        ),
      );
    }

    closeModal();
  }

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
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Tambah Unit
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryStatCard label="Total Unit" value="82" icon={LandPlot} />
        <SummaryStatCard label="Pabrik" value="60" icon={Factory} />
        <SummaryStatCard label="Kebun" value="22" icon={Sprout} />
      </div>

      <UnitFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        RegionalOptions={regionalOptions}
        RegionalValue={regional}
        onRegionalChange={setRegional}
        JenisOptions={jenisOptions}
        JenisValue={jenis}
        onJenisChange={setJenis}
        KomoditasOptions={komoditasOptionsFilter}
        KomoditasValue={komoditas}
        onKomoditasChange={setKomoditas}
      />

      <UnitTable
        rows={filteredRows}
        onEditClick={openEditModal}
        onDeleteClick={(row) => {}}
      />

      <UnitFormModal
        open={modalState.open}
        mode={modalState.mode}
        initialValues={modalState.initialValues}
        regionalOptions={regionalParentOptions}
        kategoriOptions={kategoriOptions}
        komoditasOptions={komoditasOptions}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
}

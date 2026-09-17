"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Boxes, Building2, Factory, Landmark, Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { SummaryStatCard } from "@/components/shared/SummaryStatCard";
import { PegawaiFilterBar, type PenempatanOption } from "./PegawaiFilterBar";
import { PegawaiTable } from "./PegawaiTable";
import { pegawaiRows } from "./pegawaiDummyData";

export function PegawaiList() {
  const [search, setSearch] = useState("");
  const [penempatan, setPenempatan] = useState("all");
  const [level, setLevel] = useState("all");

  const penempatanOptions = useMemo<PenempatanOption[]>(() => {
    const seen = new Map<string, PenempatanOption>();
    for (const row of pegawaiRows) {
      if (!seen.has(row.penempatanNama)) {
        seen.set(row.penempatanNama, {
          nama: row.penempatanNama,
          tipe: row.penempatanTipe,
        });
      }
    }
    return Array.from(seen.values());
  }, []);

  const levelOptions = useMemo(
    () => Array.from(new Set(pegawaiRows.map((r) => r.level))).sort(),
    [],
  );

  const filteredRows = useMemo(() => {
    return pegawaiRows.filter((row) => {
      const keyword = search.trim().toLowerCase();
      const matchSearch =
        keyword === "" ||
        row.nama.toLowerCase().includes(keyword) ||
        row.nik.toLowerCase().includes(keyword);

      const matchPenempatan =
        penempatan === "all" || row.penempatanNama === penempatan;

      const matchLevel = level === "all" || row.level === level;

      return matchSearch && matchPenempatan && matchLevel;
    });
  }, [search, penempatan, level]);

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Pegawai" },
        ]}
      />

      <PageHeader
        title="Pegawai"
        description="Seluruh data pegawai karyawan PTPN 1 di semua regional dan unit"
        action={
          <Link
            href="/pegawai/create"
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Tambah Pegawai
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <SummaryStatCard label="Total Karyawan" value="4.200" icon={Boxes} />
        <SummaryStatCard label="Karyawan HO" value="300" icon={Landmark} />
        <SummaryStatCard label="Karyawan REG" value="600" icon={Building2} />
        <SummaryStatCard label="Karyawan UNIT" value="3.300" icon={Factory} />
      </div>

      <PegawaiFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        penempatanOptions={penempatanOptions}
        penempatanValue={penempatan}
        onPenempatanChange={setPenempatan}
        levelOptions={levelOptions}
        levelValue={level}
        onLevelChange={setLevel}
      />

      <PegawaiTable rows={filteredRows} />
    </div>
  );
}

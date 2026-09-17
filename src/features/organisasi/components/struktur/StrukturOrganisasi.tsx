"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Search } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrgTreeRow } from "./OrgTreeRow";
import { organizationTree, type OrgNode } from "./strukturOrganisasiDummyData";

function collectExpandableIds(node: OrgNode): string[] {
  const ownId = node.children && node.children.length > 0 ? [node.id] : [];
  const childIds = node.children?.flatMap(collectExpandableIds) ?? [];
  return [...ownId, ...childIds];
}

export function StrukturOrganisasi() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["ho"]));
  const [query, setQuery] = useState("");

  const allExpandableIds = collectExpandableIds(organizationTree);

  const totalKaryawan =
    organizationTree.employeeCount +
    (organizationTree.children?.reduce((sum, r) => sum + r.employeeCount, 0) ??
      0);

  function handleToggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/organisasi" },
          { label: "Struktur Organisasi" },
        ]}
      />

      <PageHeader
        title="Struktur Organisasi"
        description={`Hierarki organisasi dari Head Office sampai Unit - total ${totalKaryawan.toLocaleString(
          "id-ID",
        )} karyawan.`}
      />

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari regional atau unit..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <button
          type="button"
          onClick={() => setExpanded(new Set(allExpandableIds))}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Perluas Semua
        </button>
        <button
          type="button"
          onClick={() => setExpanded(new Set(["ho"]))}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Minimize2 className="h-3.5 w-3.5" />
          Ciutkan Semua
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <OrgTreeRow
          node={organizationTree}
          level={0}
          expanded={expanded}
          onToggle={handleToggle}
          query={query}
        />
      </div>

      <p className="text-xs text-slate-400">
        Klik baris Regional untuk membuka/tutup daftar unit di bawahnya. Angka
        di kanan menunjukkan jumlah karyawan.
      </p>
    </div>
  );
}

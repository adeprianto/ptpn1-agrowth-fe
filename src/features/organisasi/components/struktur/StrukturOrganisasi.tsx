"use client";

import { useEffect, useState } from "react";
import { Maximize2, Minimize2, Search } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrgTreeRow } from "./OrgTreeRow";
import { getStrukturOrganisasi } from "../../api/struktur";
import type { EntityTreeNode } from "@/types/api/entity";

function collectExpandableIds(node: EntityTreeNode): number[] {
  const ownId = node.children.length > 0 ? [node.id] : [];
  return [...ownId, ...node.children.flatMap(collectExpandableIds)];
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; roots: EntityTreeNode[] };

export function StrukturOrganisasi() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  // null = belum diatur user -> default hanya root yang terbuka
  const [expandedState, setExpanded] = useState<Set<number> | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getStrukturOrganisasi(controller.signal)
      .then((roots) => setState({ status: "ready", roots }))
      .catch((e: Error) => {
        if (!controller.signal.aborted) {
          setState({ status: "error", message: e.message });
        }
      });
    return () => controller.abort();
  }, []);

  const roots = state.status === "ready" ? state.roots : [];
  const rootIds = roots.map((r) => r.id);
  const expanded = expandedState ?? new Set(rootIds);
  const totalKaryawan = roots.reduce((sum, r) => sum + r.total_karyawan, 0);

  function handleToggle(id: number) {
    const next = new Set(expanded);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpanded(next);
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
        description={
          state.status === "ready"
            ? `Hierarki organisasi dari Head Office sampai Unit - total ${totalKaryawan.toLocaleString(
                "id-ID",
              )} karyawan.`
            : "Hierarki organisasi dari Head Office sampai Unit."
        }
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
          onClick={() => setExpanded(new Set(roots.flatMap(collectExpandableIds)))}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Perluas Semua
        </button>
        <button
          type="button"
          onClick={() => setExpanded(new Set(rootIds))}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Minimize2 className="h-3.5 w-3.5" />
          Ciutkan Semua
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        {state.status === "loading" && (
          <p className="py-8 text-center text-sm text-slate-400">
            Memuat struktur organisasi...
          </p>
        )}
        {state.status === "error" && (
          <p className="py-8 text-center text-sm text-rose-600">
            Gagal memuat struktur organisasi: {state.message}
          </p>
        )}
        {state.status === "ready" && roots.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">
            Tidak ada data struktur organisasi untuk akun ini.
          </p>
        )}
        {roots.map((root) => (
          <OrgTreeRow
            key={root.id}
            node={root}
            level={0}
            expanded={expanded}
            onToggle={handleToggle}
            query={query}
          />
        ))}
      </div>

      <p className="text-xs text-slate-400">
        Klik baris untuk membuka/tutup entity di bawahnya. Angka di kanan
        menunjukkan jumlah karyawan termasuk seluruh entity di bawahnya.
      </p>
    </div>
  );
}

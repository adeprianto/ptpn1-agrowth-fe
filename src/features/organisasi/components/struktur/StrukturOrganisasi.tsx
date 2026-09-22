"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { TreeExplorer, TreeToolbar } from "@/components/shared/TreeExplorer";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useTreeExpansion } from "@/hooks/useTreeExpansion";
import { formatNumber } from "@/lib/format";
import { OrgTreeRow } from "./OrgTreeRow";
import { getStrukturOrganisasi } from "../../api/struktur";
import type { StrukturNode } from "../../model/entity";

/** Id semua simpul yang punya anak — untuk tombol "Perluas Semua". */
function collectExpandableIds(node: StrukturNode): string[] {
  const ownId = node.children.length > 0 ? [node.id] : [];
  return [...ownId, ...node.children.flatMap(collectExpandableIds)];
}

export function StrukturOrganisasi() {
  const [query, setQuery] = useState("");
  const { data, loading, error } = useAsyncData(getStrukturOrganisasi);

  const roots = data ?? [];
  const rootIds = roots.map((root) => root.id);
  // sebelum user mengatur sendiri, hanya simpul akar yang terbuka
  const expansion = useTreeExpansion(rootIds);
  const totalKaryawan = roots.reduce((sum, root) => sum + root.totalKaryawan, 0);

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
          data
            ? `Hierarki organisasi dari Head Office sampai Unit - total ${formatNumber(
                totalKaryawan,
              )} karyawan.`
            : "Hierarki organisasi dari Head Office sampai Unit."
        }
      />

      <TreeToolbar
        search={{
          value: query,
          onChange: setQuery,
          placeholder: "Cari regional atau unit...",
        }}
        onExpandAll={() => expansion.expandAll(roots.flatMap(collectExpandableIds))}
        onCollapseAll={() => expansion.expandAll(rootIds)}
      />

      <TreeExplorer
        loading={loading}
        error={error}
        empty={roots.length === 0}
        loadingLabel="Memuat struktur organisasi..."
        errorLabel="Gagal memuat struktur organisasi"
        emptyLabel="Tidak ada data struktur organisasi untuk akun ini."
      >
        {roots.map((root) => (
          <OrgTreeRow
            key={root.id}
            node={root}
            level={0}
            expansion={expansion}
            query={query}
          />
        ))}
      </TreeExplorer>

      <p className="text-xs text-slate-400">
        Klik baris untuk membuka/tutup entity di bawahnya. Angka di kanan
        menunjukkan jumlah karyawan termasuk seluruh entity di bawahnya.
      </p>
    </div>
  );
}

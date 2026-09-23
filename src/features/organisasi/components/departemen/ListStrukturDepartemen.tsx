"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { TreeExplorer, TreeToolbar } from "@/components/shared/TreeExplorer";
import { Alert, ButtonLink } from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useDeleteConfirm } from "@/hooks/useDeleteConfirm";
import { useTreeExpansion } from "@/hooks/useTreeExpansion";
import { DepartemenTreeRow } from "./DepartemenTreeRow";
import { EntityPicker } from "../shared/EntityPicker";
import { deleteDepartment, getDepartmentTree } from "../../api/departemen";
import { getEntityOptions } from "../../api/entityOptions";
import {
  collectExpandableIds,
  type DepartemenNode,
} from "../../model/departemen";

export function ListStrukturDepartemen() {
  const [pilihanEntity, setPilihanEntity] = useState("");

  const expansion = useTreeExpansion();
  const { data: entityOptions } = useAsyncData(getEntityOptions);

  // selama user belum memilih, entity pertama dipakai sebagai pilihan awal
  const entityId = pilihanEntity || (entityOptions?.[0]?.id ?? "");

  const {
    data: nodes,
    loading,
    error,
    refresh,
  } = useAsyncData((signal) => getDepartmentTree(entityId, signal), {
    deps: [entityId],
    enabled: Boolean(entityId),
  });

  const roots = nodes ?? [];

  // Gagal menghapus (mis. 409 karena masih punya sub-departemen) tidak
  // memuat ulang pohonnya — pesannya muncul di Alert di bawah.
  const hapus = useDeleteConfirm<DepartemenNode>({
    onDelete: (node) => deleteDepartment(node.id),
    onSuccess: refresh,
  });

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/dashboard/organisasi" },
          { label: "Struktur Departemen" },
        ]}
      />

      <PageHeader
        title="Struktur Departemen"
        description="Susunan direktorat, divisi, bagian dan seterusnya di dalam tiap entity"
        action={
          <ButtonLink
            href={`/dashboard/organisasi/departemen/create${entityId ? `?entity=${entityId}` : ""}`}
            size="lg"
            icon={Plus}
          >
            Tambah Departemen
          </ButtonLink>
        }
      />

      <TreeToolbar
        onExpandAll={() => expansion.expandAll(roots.flatMap(collectExpandableIds))}
        onCollapseAll={expansion.collapseAll}
      >
        <EntityPicker
          className="max-w-xs flex-1"
          options={entityOptions}
          value={entityId}
          onChange={(value) => {
            setPilihanEntity(value);
            expansion.collapseAll();
          }}
        />
      </TreeToolbar>

      {hapus.error && (
        <Alert tone="error" onDismiss={hapus.dismissError}>
          {hapus.error}
        </Alert>
      )}

      <TreeExplorer
        loading={loading || !entityId}
        error={error}
        empty={roots.length === 0}
        loadingLabel="Memuat struktur departemen..."
        errorLabel="Gagal memuat struktur departemen"
        emptyLabel="Belum ada departemen untuk entity ini."
      >
        {roots.map((node) => (
          <DepartemenTreeRow
            key={node.id}
            node={node}
            depth={0}
            expansion={expansion}
            onDelete={hapus.ask}
          />
        ))}
      </TreeExplorer>

      <ConfirmDialog
        open={hapus.target !== null}
        title={`Hapus ${hapus.target?.nama}?`}
        description="Departemen yang masih punya sub-departemen tidak bisa dihapus — hapus atau pindahkan anaknya dulu."
        confirmLabel="Hapus"
        variant="danger"
        loading={hapus.deleting}
        onConfirm={hapus.confirm}
        onCancel={hapus.cancel}
      />
    </div>
  );
}

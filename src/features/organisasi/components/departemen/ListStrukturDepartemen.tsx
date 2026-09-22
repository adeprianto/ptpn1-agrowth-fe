"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { TreeExplorer, TreeToolbar } from "@/components/shared/TreeExplorer";
import { Alert, ButtonLink } from "@/components/ui";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useTreeExpansion } from "@/hooks/useTreeExpansion";
import { DepartemenTreeRow } from "./DepartemenTreeRow";
import { EntityPicker } from "../shared/EntityPicker";
import { deleteDepartemen, getDepartemenTree } from "../../api/departemen";
import { getEntityOptions } from "../../api/entityOptions";
import {
  collectExpandableIds,
  type DepartemenNode,
} from "../../model/departemen";

export function ListStrukturDepartemen() {
  const [pilihanEntity, setPilihanEntity] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DepartemenNode | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const expansion = useTreeExpansion();
  const { data: entityOptions } = useAsyncData(getEntityOptions);

  // selama user belum memilih, entity pertama dipakai sebagai pilihan awal
  const entityId = pilihanEntity || (entityOptions?.[0]?.id ?? "");

  const {
    data: nodes,
    loading,
    error,
    refresh,
  } = useAsyncData((signal) => getDepartemenTree(entityId, signal), {
    deps: [entityId],
    enabled: Boolean(entityId),
  });

  const roots = nodes ?? [];

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteDepartemen(deleteTarget.id);
      setDeleteTarget(null);
      refresh();
    } catch (caught) {
      // mis. 409 karena masih punya sub-departemen
      setDeleteError((caught as Error).message);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organisasi", href: "/organisasi" },
          { label: "Struktur Departemen" },
        ]}
      />

      <PageHeader
        title="Struktur Departemen"
        description="Susunan direktorat, divisi, bagian dan seterusnya di dalam tiap entity"
        action={
          <ButtonLink
            href={`/organisasi/departemen/create${entityId ? `?entity=${entityId}` : ""}`}
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

      {deleteError && (
        <Alert tone="error" onDismiss={() => setDeleteError(null)}>
          {deleteError}
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
            onDelete={(target) => {
              setDeleteError(null);
              setDeleteTarget(target);
            }}
          />
        ))}
      </TreeExplorer>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Hapus ${deleteTarget?.nama}?`}
        description="Departemen yang masih punya sub-departemen tidak bisa dihapus — hapus atau pindahkan anaknya dulu."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

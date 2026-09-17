"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DepartemenTreeRow } from "./DepartemenTreeRow";
import {
  strukturDepartemen as initialNodes,
  getAllEntityOptions,
  type StrukturDepartemenNode,
} from "./masterJabatanDummyData";

export function ListStrukturDepartemen() {
  const entityOptions = getAllEntityOptions();

  const [nodes, setNodes] = useState<StrukturDepartemenNode[]>(initialNodes);
  const [entityCode, setEntityCode] = useState(entityOptions[0].code);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] =
    useState<StrukturDepartemenNode | null>(null);

  const nodesInEntity = useMemo(
    () => nodes.filter((n) => n.entityCode === entityCode),
    [nodes, entityCode],
  );
  const rootNodes = nodesInEntity.filter((n) => n.parentId === null);

  function handleEntityChange(newEntityCode: string) {
    setEntityCode(newEntityCode);
    setExpanded(new Set());
  }

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

  function handleConfirmDelete() {
    if (deleteTarget) {
      const idsToRemove = new Set<string>();
      function collect(id: string) {
        idsToRemove.add(id);
        nodes
          .filter((n) => n.parentId === id)
          .forEach((child) => collect(child.id));
      }
      collect(deleteTarget.id);
      setNodes((prev) => prev.filter((n) => !idsToRemove.has(n.id)));
    }
    setDeleteTarget(null);
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
        description="Susunan divisi/bagian di dalam tiap entity, dipakai sebagai referensi Job Function untuk Master Jabatan"
        action={
          <Link
            href={`/organisasi/departemen/create?entity=${entityCode}`}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Tambah Departemen
          </Link>
        }
      />

      <div className="max-w-xs">
        <select
          value={entityCode}
          onChange={(e) => handleEntityChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <optgroup label="Head Office">
            {entityOptions
              .filter((e) => e.isHo)
              .map((e) => (
                <option key={e.code} value={e.code}>
                  {e.label}
                </option>
              ))}
          </optgroup>
          <optgroup label="Regional">
            {entityOptions
              .filter((e) => !e.isHo && !e.code.startsWith("UNIT-"))
              .map((e) => (
                <option key={e.code} value={e.code}>
                  {e.label}
                </option>
              ))}
          </optgroup>
          <optgroup label="Unit (template)">
            {entityOptions
              .filter((e) => e.code.startsWith("UNIT-"))
              .map((e) => (
                <option key={e.code} value={e.code}>
                  {e.label}
                </option>
              ))}
          </optgroup>
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        {rootNodes.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-slate-400">
            Belum ada departemen untuk entity ini.
          </p>
        ) : (
          rootNodes.map((node) => (
            <DepartemenTreeRow
              key={node.id}
              node={node}
              allNodes={nodesInEntity}
              depth={0}
              expanded={expanded}
              onToggle={handleToggle}
              onDeleteClick={setDeleteTarget}
            />
          ))
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Hapus ${deleteTarget?.name}?`}
        description="Departemen anak di bawahnya (kalau ada) akan ikut terhapus. Jabatan yang masih menunjuk ke departemen ini sebaiknya dipindah dulu."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

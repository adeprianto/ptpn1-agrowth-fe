"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Maximize2, Minimize2, Plus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DepartemenTreeRow } from "./DepartemenTreeRow";
import {
  deleteDepartemen,
  getDepartemenTree,
  type DepartemenNode,
} from "../../api/departemen";
import {
  getEntityOptions,
  type EntityOption,
  type EntityTier,
} from "../../api/entityOptions";

function collectExpandableIds(node: DepartemenNode): string[] {
  const ownId = node.children.length > 0 ? [node.id] : [];
  return [...ownId, ...node.children.flatMap(collectExpandableIds)];
}

const TIER_LABEL: Record<EntityTier, string> = {
  HO: "Head Office",
  Regional: "Regional",
  Unit: "Unit",
};

export function ListStrukturDepartemen() {
  const [entityOptions, setEntityOptions] = useState<EntityOption[]>([]);
  const [entityId, setEntityId] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<DepartemenNode | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Hasil fetch disimpan bersama key query-nya; loading = key belum cocok
  const queryKey = `${entityId}|${refreshKey}`;
  const [result, setResult] = useState<{
    key: string;
    nodes: DepartemenNode[];
    error: string | null;
  } | null>(null);
  const loading = !entityId || result?.key !== queryKey;
  const nodes = result?.nodes ?? [];
  const error = result?.key === queryKey ? result.error : null;

  // opsi entity diambil sekali; entity pertama dipakai sebagai default
  useEffect(() => {
    const controller = new AbortController();

    getEntityOptions(controller.signal)
      .then((options) => {
        setEntityOptions(options);
        if (options.length > 0) setEntityId(options[0].id);
      })
      .catch((e) => {
        if (!controller.signal.aborted) console.error(e);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!entityId) return;

    const controller = new AbortController();
    const key = `${entityId}|${refreshKey}`;

    getDepartemenTree(entityId, controller.signal)
      .then((tree) => setResult({ key, nodes: tree, error: null }))
      .catch((e: Error) => {
        if (controller.signal.aborted) return;
        setResult({ key, nodes: [], error: e.message });
      });

    return () => controller.abort();
  }, [entityId, refreshKey]);

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

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteDepartemen(deleteTarget.id);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      // mis. 409 karena masih punya sub-departemen
      setDeleteError((e as Error).message);
      setDeleteTarget(null);
    }
  }

  const groups: EntityTier[] = ["HO", "Regional", "Unit"];

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
          <Link
            href={`/organisasi/departemen/create${entityId ? `?entity=${entityId}` : ""}`}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Tambah Departemen
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-2.5">
        <select
          value={entityId}
          onChange={(e) => {
            setEntityId(e.target.value);
            setExpanded(new Set());
          }}
          className="max-w-xs flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {entityOptions.length === 0 && <option value="">Memuat entity...</option>}
          {groups.map((tier) => {
            const options = entityOptions.filter((e) => e.tier === tier);
            if (options.length === 0) return null;

            return (
              <optgroup key={tier} label={TIER_LABEL[tier]}>
                {options.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nama}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>

        <button
          type="button"
          onClick={() => setExpanded(new Set(nodes.flatMap(collectExpandableIds)))}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Perluas Semua
        </button>
        <button
          type="button"
          onClick={() => setExpanded(new Set())}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Minimize2 className="h-3.5 w-3.5" />
          Ciutkan Semua
        </button>
      </div>

      {deleteError && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span>{deleteError}</span>
          <button
            type="button"
            onClick={() => setDeleteError(null)}
            className="font-medium hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        {error ? (
          <p className="px-3 py-8 text-center text-sm text-rose-600">
            Gagal memuat struktur departemen: {error}
          </p>
        ) : loading ? (
          <p className="px-3 py-8 text-center text-sm text-slate-400">
            Memuat struktur departemen...
          </p>
        ) : nodes.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-slate-400">
            Belum ada departemen untuk entity ini.
          </p>
        ) : (
          nodes.map((node) => (
            <DepartemenTreeRow
              key={node.id}
              node={node}
              depth={0}
              expanded={expanded}
              onToggle={handleToggle}
              onDeleteClick={(target) => {
                setDeleteError(null);
                setDeleteTarget(target);
              }}
            />
          ))
        )}
      </div>

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

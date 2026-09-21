"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";

import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { PenyelenggaraTable } from "@/features/penyelenggara-pelatihan/components/PenyelenggaraTable";
import { getVendors } from "@/features/penyelenggara-pelatihan/api/vendor";
import { ApiError } from "@/lib/http-client";
import type { VendorResource } from "@/types/api/vendor";

export default function PenyelenggaraPelatihanList() {
    const [vendors, setVendors] = useState<VendorResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Daftar diambil di client, jadi setelah hapus harus refetch sendiri —
    // router.refresh() tidak menyentuh state ini. Menaikkan key = muat ulang.
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        getVendors({}, signal)
            .then(({ rows }) => {
                setVendors(rows);
                setError(null);
            })
            .catch((err: unknown) => {
                if (signal.aborted) return;
                setError(
                    err instanceof ApiError
                        ? err.message
                        : "Gagal memuat data penyelenggara",
                );
            })
            .finally(() => {
                if (!signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, [reloadKey]);

    const refreshVendors = useCallback(() => {
        setIsLoading(true);
        setReloadKey((key) => key + 1);
    }, []);

    return (
        <div className="space-y-4">
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Penyelenggara" },
                ]}
            />

            <PageHeader
                title="Penyelenggara"
                description="Seluruh data penyelenggara pelatihan PTPN 1 di semua regional dan unit"
                action={
                    <Link
                        href="/penyelenggara-pelatihan/create"
                        className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Penyelenggara
                    </Link>
                }
            />

            {isLoading ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                    <p className="text-sm font-medium">Memuat data penyelenggara...</p>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                    {error}
                </div>
            ) : (
                <PenyelenggaraTable rows={vendors} onChanged={refreshVendors} />
            )}
        </div>
    );
}

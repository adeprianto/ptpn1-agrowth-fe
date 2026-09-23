"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Kerangka halaman setelah login: sidebar, header, isi, footer.
 *
 * Di layar lebar (lg ke atas) sidebar-nya menetap di kiri. Di layar sempit
 * sidebar berubah jadi laci yang menutupi halaman dan dibuka lewat tombol
 * garis tiga di header — kalau tidak, 256px lebar sidebar akan memakan
 * sebagian besar layar ponsel dan menyisakan ruang yang tidak terpakai.
 *
 * Statusnya dipegang di sini karena dua anaknya sama-sama membutuhkannya:
 * Header yang membukanya, Sidebar yang menutupnya.
 */
export function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // h-dvh, bukan h-screen: di browser ponsel `vh` tidak ikut menyusut saat
    // bilah alamatnya muncul, jadi footer bisa tertutup bilah itu.
    <div className="flex h-dvh bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

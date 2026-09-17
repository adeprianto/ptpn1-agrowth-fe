"use client";

import { useMemo } from "react";
import type { AuthUser } from "@/types/auth";

/**
 * TODO: ganti dengan auth sesungguhnya (session/JWT dari backend Laravel).
 * Untuk sekarang di-hardcode supaya layout (sidebar, header, role filtering)
 * bisa langsung dipakai & dipreview tanpa menunggu integrasi auth selesai.
 *
 * Ganti `role` di bawah ke "REGIONAL" atau "UNIT" untuk mengetes tampilan
 * menu sidebar sesuai tier lain.
 */
export function useAuth(): { user: AuthUser } {
  const user = useMemo<AuthUser>(
    () => ({
      id: "1",
      name: "Rafli Aditrya",
      email: "rafli@ptpn1.co.id",
      role: "HO",
      officeName: "Kantor Pusat (Head Office)",
    }),
    [],
  );

  return { user };
}

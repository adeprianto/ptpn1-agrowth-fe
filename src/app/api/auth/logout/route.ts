import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { callBackend, SESSION_COOKIE } from "@/lib/api-client";

/**
 * POST /api/auth/logout
 * Cabut token di backend, lalu buang cookie. Kalau backend gagal dihubungi
 * cookie tetap dibuang supaya user tidak terkunci di sesi yang tidak dipakai.
 */
export async function POST() {
    try {
        await callBackend("/logout", { method: "POST" });
    } catch (error) {
        console.error("[auth/logout] gagal memanggil backend:", error);
    }

    (await cookies()).delete(SESSION_COOKIE);

    return NextResponse.json({
        success: true,
        message: "Logout berhasil",
        data: null,
    });
}

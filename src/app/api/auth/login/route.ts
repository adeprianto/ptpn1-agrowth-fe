import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { callBackend, SESSION_COOKIE } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api/response";
import type { LoginResponse } from "@/types/api/user";

const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60; // 30 hari

/**
 * POST /api/auth/login
 * Token dari backend disimpan di cookie HttpOnly, jadi tidak ikut dikirim
 * ke browser. Yang dikembalikan hanya data user.
 */
export async function POST(request: NextRequest) {
    const { email, password, rememberMe } = await request.json();

    const { status, body } = await callBackend<ApiResponse<LoginResponse>>("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (status !== 200 || !body.data?.token) {
        return NextResponse.json(body, { status });
    }

    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, body.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // tanpa maxAge: cookie hilang saat browser ditutup
        ...(rememberMe === true && { maxAge: REMEMBER_ME_MAX_AGE }),
    });

    return NextResponse.json({
        success: true,
        message: body.message,
        data: body.data.user,
    });
}

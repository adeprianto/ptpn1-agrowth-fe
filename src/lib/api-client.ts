/**
 * Jembatan ke backend Laravel. HANYA dipakai di route handler (src/app/api/**),
 * karena membaca cookie HttpOnly lewat next/headers.
 *
 * Komponen client tidak boleh mengimpor file ini — pakai @/lib/http-client.
 */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000/api/v1";

export const SESSION_COOKIE = "session_token";

/** Header standar + token dari cookie kalau user sudah login. */
async function backendHeaders(): Promise<HeadersInit> {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;

    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

/**
 * Panggil backend dan kembalikan hasilnya sebagai objek biasa.
 * Dipakai route handler yang masih perlu mengolah hasilnya (mis. login).
 */
export async function callBackend<T>(
    endpoint: string,
    init: RequestInit = {},
): Promise<{ status: number; body: T }> {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        ...init,
        headers: { ...(await backendHeaders()), ...init.headers },
    });

    return { status: response.status, body: (await response.json()) as T };
}

/**
 * Teruskan request dari browser ke backend apa adanya: method, query string,
 * dan body-nya ikut. Ini yang dipakai hampir semua route handler.
 *
 *   export async function GET(request: NextRequest) {
 *       return forward(request, "/regionals");
 *   }
 */
export async function forward(request: NextRequest, endpoint: string) {
    const hasBody = request.method !== "GET" && request.method !== "DELETE";

    try {
        const response = await fetch(
            `${BACKEND_URL}${endpoint}${request.nextUrl.search}`,
            {
                method: request.method,
                headers: await backendHeaders(),
                body: hasBody ? await request.text() : undefined,
            },
        );

        // Diteruskan sebagai teks supaya envelope backend tidak berubah bentuk.
        return new NextResponse(await response.text(), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(`[backend] ${request.method} ${endpoint} gagal:`, error);

        return NextResponse.json(
            {
                success: false,
                message: "Tidak dapat terhubung ke server backend.",
                data: null,
            },
            { status: 502 },
        );
    }
}

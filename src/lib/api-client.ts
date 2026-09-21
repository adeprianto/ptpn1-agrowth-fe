// Klien HTTP tipis di atas fetch untuk backend Laravel (Sanctum SPA cookie).
// - credentials: "include" supaya cookie sesi & XSRF-TOKEN ikut terkirim
// - header X-XSRF-TOKEN diisi dari cookie terbaru di setiap request yang mengubah data
// - response dibongkar dari wrapper ApiResponse { success, message, data, meta? }

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
// Origin backend tanpa /api/v1, dipakai untuk /sanctum/csrf-cookie
const BACKEND_ORIGIN = new URL(API_URL).origin;

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface ApiResult<T> {
  data: T;
  message: string;
  meta?: PaginationMeta;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type QueryValue = string | number | boolean | null | undefined;

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(`${API_URL}${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

function readXsrfToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Panggil sebelum POST/PUT/DELETE, kalau tidak kena 419.
 * `force` mengambil token baru walau cookie-nya sudah ada — dipakai saat retry,
 * karena token bisa tidak cocok lagi setelah sesi berganti.
 */
export async function ensureCsrfCookie(force = false) {
  if (!force && readXsrfToken()) return;
  await fetch(`${BACKEND_ORIGIN}/sanctum/csrf-cookie`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, QueryValue>;
  body?: unknown;
  signal?: AbortSignal;
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", query, body, signal }: RequestOptions = {},
  retryOn419 = true,
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = { Accept: "application/json" };

  if (method !== "GET") {
    await ensureCsrfCookie();
    const token = readXsrfToken();
    if (token) headers["X-XSRF-TOKEN"] = token;
  }
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  // 419 = token CSRF tidak cocok (mis. sesi baru berganti). Ambil token baru, coba sekali lagi.
  if (res.status === 419 && retryOn419 && method !== "GET") {
    await ensureCsrfCookie(true);
    return apiRequest<T>(path, { method, query, body, signal }, false);
  }

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    throw new ApiError(
      res.status,
      json?.message ?? `Request gagal (${res.status})`,
      json?.errors,
    );
  }

  return { data: json.data as T, message: json.message, meta: json.meta };
}

export const apiGet = <T>(
  path: string,
  query?: Record<string, QueryValue>,
  signal?: AbortSignal,
) => apiRequest<T>(path, { query, signal });

export const apiPost = <T>(path: string, body: unknown) =>
  apiRequest<T>(path, { method: "POST", body });

export const apiPut = <T>(path: string, body: unknown) =>
  apiRequest<T>(path, { method: "PUT", body });

export const apiDelete = <T>(path: string) =>
  apiRequest<T>(path, { method: "DELETE" });

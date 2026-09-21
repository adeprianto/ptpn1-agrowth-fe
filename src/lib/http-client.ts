/**
 * Klien HTTP untuk komponen client.
 *
 * Selalu menembak route handler Next (path diawali "/api/..."), tidak pernah
 * backend Laravel langsung. Token sesi ada di cookie HttpOnly dan disisipkan
 * oleh route handler, jadi browser tidak perlu tahu soal token.
 *
 * Backend membungkus semua respons dengan { success, message, data, meta? },
 * jadi fungsi di sini mengembalikan bagian itu.
 */
import type { ApiResponse, PaginationMeta } from "@/types/api/response";

export type { PaginationMeta };

/** Error dari backend (status non-2xx atau success: false). */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    /** Detail validasi Laravel: { field: ["pesan"] } — hanya ada pada 422. */
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type Query = Record<string, string | number | boolean | undefined | null>;

/** Rakit "/api/units" + { per_page: 20 } jadi "/api/units?per_page=20". */
function buildUrl(path: string, query?: Query) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Query;
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(
  path: string,
  { method = "GET", query, body, signal }: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : {},
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const json = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || json?.success === false) {
    throw new ApiError(
      response.status,
      json?.message ?? `Request gagal (${response.status})`,
      json?.errors,
    );
  }

  return json as ApiResponse<T>;
}

export const apiGet = <T>(path: string, query?: Query, signal?: AbortSignal) =>
  request<T>(path, { query, signal });

export const apiPost = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body: body ?? {} });

export const apiPut = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PUT", body: body ?? {} });

export const apiDelete = <T>(path: string) =>
  request<T>(path, { method: "DELETE" });

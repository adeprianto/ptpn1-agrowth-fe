import { apiGet, apiPost, ensureCsrfCookie } from "@/lib/api-client";
import type { AuthUser, Role } from "@/types/auth";

type EntityType = "HEAD_OFFICE" | "REGIONAL" | "UNIT";

// Bentuk mentah dari backend (UserResource)
interface UserApi {
  id: number;
  name: string;
  email: string;
  entity_id: number | null;
  entity?: {
    id: number;
    code: string;
    name: string;
    type: EntityType;
  } | null;
}

const ROLE_BY_ENTITY_TYPE: Record<EntityType, Role> = {
  HEAD_OFFICE: "HO",
  REGIONAL: "REGIONAL",
  UNIT: "UNIT",
};

function toAuthUser(u: UserApi): AuthUser {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    // user tanpa entity dianggap paling sempit supaya tidak kebobolan akses
    role: u.entity ? ROLE_BY_ENTITY_TYPE[u.entity.type] : "UNIT",
    officeName: u.entity?.name ?? "-",
    entityId: u.entity_id !== null ? String(u.entity_id) : null,
  };
}

// POST /api/v1/login — Sanctum SPA, sesi disimpan di cookie
export async function login(
  email: string,
  password: string,
  remember = false,
): Promise<AuthUser> {
  // wajib sebelum POST pertama, kalau tidak kena 419
  await ensureCsrfCookie();

  const { data } = await apiPost<UserApi>("/login", {
    email,
    password,
    remember,
  });

  return toAuthUser(data);
}

// GET /api/v1/me — 401 kalau belum login
export async function me(signal?: AbortSignal): Promise<AuthUser> {
  const { data } = await apiGet<UserApi>("/me", undefined, signal);
  return toAuthUser(data);
}

// POST /api/v1/logout
export async function logout(): Promise<void> {
  await apiPost("/logout", {});
}

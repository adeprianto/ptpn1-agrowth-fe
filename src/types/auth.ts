import type { EntityType } from "@/types/api/entity";
import type { UserResource } from "@/types/api/user";

/** Tier organisasi sesuai hierarki entity (HO -> Regional -> Unit). */
export type Role = "HO" | "REGIONAL" | "UNIT";

const ROLE_BY_ENTITY_TYPE: Record<EntityType, Role> = {
  HEAD_OFFICE: "HO",
  REGIONAL: "REGIONAL",
  UNIT: "UNIT",
};

/** User yang dipakai di seluruh UI — turunan dari UserResource backend. */
export default interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  /** Nama kantor tempat user bertugas, mis. "Regional I" */
  officeName: string;
  /** Entity tempat user bertugas — dasar scope data di backend */
  entityId: number | null;
}

export function toAuthUser(user: UserResource): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    // user tanpa entity dianggap paling sempit supaya tidak kebobolan akses
    role: user.entity ? ROLE_BY_ENTITY_TYPE[user.entity.type] : "UNIT",
    officeName: user.entity?.name ?? "-",
    entityId: user.entity_id,
  };
}

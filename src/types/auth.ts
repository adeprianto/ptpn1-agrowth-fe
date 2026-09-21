/**
 * Tier organisasi sesuai hierarki `offices` (HO -> Regional -> Unit).
 */
export type Role = "HO" | "REGIONAL" | "UNIT";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Nama kantor tempat user bertugas, mis. "Regional I" atau "Kebun Anak Setia" */
  officeName: string;
  /** Entity tempat user bertugas — dasar scope data di backend */
  entityId: string | null;
}

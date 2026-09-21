import type { EntityRef } from "./entity";

/** app/Http/Resources/UserResource.php */
export interface UserResource {
  id: number;
  name: string;
  email: string;
  entity_id: number | null;
  employee_id: number | null;
  entity?: EntityRef | null;
  employee?: { id: number; nik: string; name: string } | null;
}

/** AuthController@login */
export interface LoginResponse {
  token: string;
  user: UserResource;
}

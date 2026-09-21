import type { MasterRef } from "./master-data";

/** app/Http/Resources/OrganizationResource.php — "departemen" di UI. */
export interface OrganizationResource {
  id: number;
  code: string;
  name: string;
  level: number;
  organization_type?: MasterRef | null;
  entity?: MasterRef | null;
  job_function?: MasterRef | null;
  parent?: MasterRef | null;
  children_count?: number;
  created_at?: string;
  updated_at?: string;
}

/** OrganizationController@tree */
export interface OrganizationTreeNode {
  id: number;
  code: string;
  name: string;
  level: number;
  organization_type: MasterRef | null;
  job_function: MasterRef | null;
  children: OrganizationTreeNode[];
}

/** app/Http/Requests/Organization/StoreOrganizationRequest.php */
export interface OrganizationPayload {
  code: string;
  name: string;
  level: number;
  organization_type_id: number;
  entity_id: number;
  job_function_id: number | null;
  parent_id: number | null;
}

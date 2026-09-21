/**
 * Master data sederhana yang bentuknya seragam (id + code + name):
 * business-types, operational-categories, organization-types, job-functions.
 */
export interface MasterRef {
  id: number;
  code: string;
  name: string;
}

/** app/Http/Resources/PositionTitleResource.php */
export interface PositionTitleResource {
  id: number;
  code: string;
  name: string;
  level_bod: { value: number; label: string } | null;
  job_group?: MasterRef | null;
  job_function?: MasterRef | null;
  created_at: string;
  updated_at: string;
}

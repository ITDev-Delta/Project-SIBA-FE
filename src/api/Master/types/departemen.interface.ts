export interface IDepartemen {
  id: number;
  nama_departemen: string;
  kode_departemen: string;
  is_active: string;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface IDepartemenDetail {
  id: number;
  nama_departemen: string;
  kode_departemen: string;
  is_active: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  audit_trail: IDepartemenAudit[];
}

export interface IDepartemenAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<IDepartemen>;
  old_data: Partial<IDepartemen>;
  created_at: Date;
  updated_at: Date;
}

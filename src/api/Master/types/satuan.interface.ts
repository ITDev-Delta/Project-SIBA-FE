export interface ISatuan {
  id: number;
  nama_satuan: string;
  kode_satuan: string;
  is_active: string;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface ISatuanDetail {
  id: number;
  nama_satuan: string;
  kode_satuan: string;
  is_active: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  audit_trail: ISatuanAudit[];
}

export interface ISatuanAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<ISatuan>;
  old_data: Partial<ISatuan>;
  created_at: Date;
  updated_at: Date;
}

export interface ICoa {
  id: number;
  id_parent?: string;
  kode_parent?: string;
  kategori: string;
  kode_akun: string;
  full_account_code: string;
  nama_akun: string;
  full_account_name: string;
  full_parent_account_name: string;
  currency?: string;
  debit_kredit: string;
  neraca: string;
  laba_rugi: string;
  is_active: string;
  level: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  parent: Partial<ICoa>;
  all_children?: ICoa[];
}

export interface ICoaDetail {
  id: number;
  id_parent?: string;
  kode_parent?: string;
  kategori: string;
  kode_akun: string;
  full_account_code: string;
  nama_akun: string;
  full_account_name: string;
  full_parent_account_name: string;
  currency?: string;
  debit_kredit: string;
  neraca: string;
  laba_rugi: string;
  is_active: string;
  level: string;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  parent: Partial<ICoa>;
  all_children?: ICoa[];
  audit_trail: ICoaAudit[];
}

export interface ICoaAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<ICoa>;
  old_data: Partial<ICoa>;
  created_at: string;
  updated_at: string;
}

export interface ICoaSetting {
  id: number;
  coa_departemen: string;
  coa_setting_name: string;
  coa_id: number;
  coa_account: string;
  created_by: string;
  updated_at: string;
  created_at: string;
}
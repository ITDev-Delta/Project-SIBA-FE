export interface ICurrency {
  id: number | string;
  is_active: string;
  is_default?: string; // Optional field for default currency
  kode_currency: string;
  nama_currency: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface ICurrencyDetail {
  id: number;
  is_active: string;
  is_default?: string; // Optional field for default currency
  kode_currency: string;
  nama_currency: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  audit_trail: ICurrencyAudit[];
}

export interface ICurrencyAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<ICurrency>;
  old_data: Partial<ICurrency>;
  created_at: string;
  updated_at: string;
}

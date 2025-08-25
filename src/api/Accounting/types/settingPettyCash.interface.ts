export interface ISettingPettyCash {
  id: number;
  nama_petty_cash: string;
  nama_departemen: string;
  coa_account: string;
  coa_id: string;
  saldo_maksimum: string;
  maksimum_transaksi: string;
  status: string;
  created_by: string;
  saldo_akhir: number;
  saldo_ongoing: number;
  isChecked?: boolean;
  id_petty_cash_role?: number;
}

export interface ISettingPettyCashDetail {
  id: number;
  departemen_id: number;
  coa_id: number;
  nama_petty_cash: string;
  nama_departemen: string;
  coa_account: string;
  saldo_maksimum: string;
  maksimum_transaksi: string;
  status: string;
  created_by: string;
  saldo_akhir: number;
  saldo_ongoing: number;
  audit_trail: ISettingPettyCashAudit[];
}

export interface ISettingPettyCashAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<ISettingPettyCash>;
  old_data: Partial<ISettingPettyCash>;
  created_at: string;
  updated_at: string;
}

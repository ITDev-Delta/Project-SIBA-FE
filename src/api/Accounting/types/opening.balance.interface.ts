export interface IOpeningBalance {
  id: number;
  coa_id: string;
  coa_account: string;
  debit: string;
  kredit: string;
  fiscal_period_id: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface IOpeningBalanceDetail {
  id: number;
  coa_id: string;
  coa_account: string;
  debit: string;
  kredit: string;
  fiscal_period_id: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  audit_trail: IOpeningBalanceAudit[];
}

export interface IOpeningBalanceAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<IOpeningBalance>;
  old_data: Partial<IOpeningBalance>;
  created_at: string;
  updated_at: string;
}

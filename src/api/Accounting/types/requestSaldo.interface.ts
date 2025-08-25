import type { ISettingPettyCash } from "./settingPettyCash.interface";

export interface IRequestSaldo {
  id: number;
  petty_cash_setting_id: string;
  nomor_journal: string;
  tanggal_journal: string;
  tanggal_approve?: string;
  deskripsi: string;
  nominal_pengajuan: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
  petty_cash_setting: ISettingPettyCash;
}

export interface IRequestSaldoDetail {
  id: number;
  petty_cash_setting_id: string;
  nomor_journal: string;
  tanggal_journal: string;
  tanggal_approve?: string;
  deskripsi: string;
  nominal_pengajuan: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
  petty_cash_setting: ISettingPettyCash;
  transactions: ITransaction[];
  audit_trail: IRequestSaldoAudit[];
}

export interface ITransaction {
  id: number;
  id_journal: string;
  nomor_journal: string;
  tanggal_journal: Date;
  nomor_transaksi: string;
  coa_id: string;
  coa_account: string;
  deskripsi: string;
  debit: string;
  kredit: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
}

export interface IRequestSaldoAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<IRequestSaldo>;
  old_data: Partial<IRequestSaldo>;
  created_at: string;
  updated_at: string;
}

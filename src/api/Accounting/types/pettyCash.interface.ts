import type { ISettingPettyCash } from "./settingPettyCash.interface";

export interface IPettyCash {
  id: number;
  petty_cash_setting_id: number;
  nomor_journal: string;
  tanggal_journal: Date;
  tanggal_realize: Date;
  tanggal_posting: null;
  deskripsi: null;
  pemohon: string;
  tanggal_jatuh_tempo: Date;
  tanggal_reminder: Date;
  nominal_pengajuan: string;
  nominal_realisasi: string;
  status: string;
  created_by: string;
  updated_by: null;
  created_at: null;
  updated_at: null;
  petty_cash_setting: ISettingPettyCash;
}

export interface IPettyCashDeetail {
  id: number;
  petty_cash_setting_id: string;
  nomor_journal: string;
  tanggal_journal: string;
  tanggal_realize: null;
  tanggal_posting: null;
  deskripsi?: string;
  pemohon: string;
  tanggal_jatuh_tempo: string;
  tanggal_reminder: string;
  nominal_pengajuan: string;
  nominal_realisasi?: string;
  status: string;
  created_by: string;
  updated_by: null;
  created_at: Date;
  updated_at: Date;
  petty_cash_setting: ISettingPettyCash;
  transactions: Transactions[];
  audit_trail: IPettyCashAudit[];
}

export interface Transactions {
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
}

export interface IPettyCashAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<IPettyCash>;
  old_data: Partial<IPettyCash>;
  created_at: string;
  updated_at: string;
}

export interface IClosedJournal {
  id: number;
  nomor_journal: string;
  tanggal_journal: Date;
  tanggal_posting: Date;
  deskripsi: string;
  nominal: string;
  status: string;
  created_by: string;
}

export interface IClosedJournalDetail {
  id: number;
  nomor_journal: string;
  tanggal_journal: Date;
  tanggal_posting: Date;
  deskripsi: string;
  nominal: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by?: null;
  transactions?: Transaction[];
  audit_trail?: AuditTrail[];
}

export interface Transaction {
  id: number;
  id_journal: string;
  nomor_journal: string;
  tanggal_journal: Date;
  nomor_transaksi: string;
  coa_id: number;
  coa_account: string;
  deskripsi: string;
  debit: string;
  kredit: string;
  status: string;
  created_by: string;
}

export interface AuditTrail {
  id: number;
  event: string;
  table_name: string;
  record_id: number;
  old_data: null;
  new_data: IClosedJournalDetail;
  user: string;
  created_at: Date;
  updated_at: Date;
}

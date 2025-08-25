export interface IJournal {
  id: number;
  nomor_journal: string;
  tanggal_journal: string;
  tanggal_posting: string;
  deskripsi: string;
  nominal: string;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface IJournalDetail {
  id: number;
  nomor_journal: string;
  tanggal_journal: string;
  tanggal_posting: string;
  deskripsi: string;
  nominal: string;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  transactions: IJournalTransaction[];
  audit_trail: IJournalAudit[];
}

export interface IJournalAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<IJournal>;
  old_data: Partial<IJournal>;
  created_at: string;
  updated_at: string;
}

export interface IJournalTransaction {
  id: number | null | undefined;
  id_journal: string;
  nomor_journal: string;
  tanggal_journal: string;
  nomor_transaksi: string | null | undefined;
  coa_id: string;
  coa_account: string;
  deskripsi: string;
  debit: string | null | undefined;
  kredit: string | null | undefined;
  status: string;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

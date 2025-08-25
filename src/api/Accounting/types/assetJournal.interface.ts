export interface IAssetJournal {
  id: number;
  nomor_journal: string;
  tanggal_journal: string;
  tanggal_posting: string | null;
  deskripsi: string;
  nominal: string;
  status: string;
}

export interface IAssetJournalDetail {
  asset: Asset;
  transaction: IAssetJournalTrans[];
}

export interface Asset {
  id: number;
  nomor_journal: string;
  tanggal_journal: string;
  tanggal_posting: null;
  deskripsi: string;
  nominal: string;
  status: string;
  created_by: string;
  updated_by: null;
  created_at: Date;
  updated_at: Date;
}

export interface IAssetJournalTrans {
  id: number;
  coa_id: null | string;
  coa_account: null | string;
  deskripsi: string;
  debit: number | string;
  kredit: number | string;
}

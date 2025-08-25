import type { IPaymentSources } from "../../Master/types/paymentSources.interface";
import type { ICurrency } from "./currency.interface";

export interface ICashAndBankTransaction {
  id: number;
  nomor_kas_bank: string;
  tanggal: string;
  tipe_transaksi: string;
  source_id: string;
  destination_id: string;
  currency_id: string;
  nominal: string;
  keterangan: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
  source: IPaymentSources;
  destination: IPaymentSources;
  currency: ICurrency;
}

export interface ICashAndBankTransactionDetail {
  id: number;
  nomor_kas_bank: string;
  tanggal: string;
  tipe_transaksi: string;
  source_id: string;
  destination_id: string;
  currency_id: string;
  nominal: string;
  biaya_transaksi: string;
  keterangan: string;
  created_by: string;
  updated_by: null;
  source: IPaymentSources;
  destination: IPaymentSources;
  currency: ICurrency;
  audit_trail: ICashAndBankTransactionAudit[];
}

export interface ICashAndBankTransactionAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<ICashAndBankTransaction>;
  old_data: Partial<ICashAndBankTransaction>;
  created_at: Date;
  updated_at: Date;
}

export interface ICashAndBankJournal {
  id: number;
  reference_id: string;
  nomor_journal: string;
  tanggal_journal: string;
  tanggal_posting?: string;
  deskripsi: string;
  nominal: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
}

export interface ICashAndBankJournalDetail {
  data: ICashAndBankJournalData;
  journal: ICashAndBankJournalJournalData[];
}

export interface ICashAndBankJournalData {
  id: number;
  reference_id: string;
  nomor_journal: string;
  tanggal_journal: string;
  tanggal_posting?: string;
  deskripsi: string;
  nominal: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: string;
}

export interface ICashAndBankJournalJournalData {
  id: number;
  id_journal: string;
  nomor_journal: string;
  tanggal_journal: string;
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

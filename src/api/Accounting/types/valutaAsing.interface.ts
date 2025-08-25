import type { IPaymentSources } from "../../Master/types/paymentSources.interface";
import type { ICoa } from "./coa.interface";
import type { ICurrency } from "./currency.interface";

export interface IValutaAsingTransaksi {
  id: number;
  nomor_transaksi: string;
  transaction_type: string;
  coa_source_id: string;
  source_id: string;
  currency_id_asing: string;
  nominal_asing: string;
  kurs: string;
  coa_destination_id: string;
  destination_id: string;
  currency_id_rupiah: string;
  nominal_rupiah: string;
  keterangan: string;
  tanggal_transaksi: Date;
  tanggal_approve?: string;
  tanggal_reject?: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
  coa_source: ICoa;
  coa_destination: ICoa;
  currency_asing: ICurrency;
  currency_rupiah: ICurrency;
  source: IPaymentSources;
  destination: IPaymentSources;
}

export interface IValutaAsingTransaksiDetail {
  id: number;
  nomor_transaksi: string;
  transaction_type: string;
  coa_source_id: string;
  source_id: string;
  currency_id_asing: string;
  nominal_asing: string;
  kurs: string;
  coa_destination_id: string;
  destination_id: string;
  currency_id_rupiah: string;
  nominal_rupiah: string;
  keterangan: string;
  tanggal_transaksi: string;
  tanggal_approve?: string;
  tanggal_reject?: string;
  status: string;
  biaya_transaksi: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
  coa_source: ICoa;
  coa_destination: ICoa;
  currency_asing: ICurrency;
  currency_rupiah: ICurrency;
  source: IPaymentSources;
  destination: IPaymentSources;
}

//========================================== journal
export interface IValutaAsingJournal {
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

export interface IValutaAsingJournalDetail {
  data: IValutaAsingJournalDetailData;
  journal: IValutaAsingJournalTrans[];
}

export interface IValutaAsingJournalDetailData {
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

export interface IValutaAsingJournalTrans {
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

//========================================== tracker
export interface IValutaAsingTracker {
  id: number;
  reference_id: string;
  reference_document: string;
  activity_type: string;
  transaction_type: string;
  payment_source_id: string;
  coa_id: string;
  currency_id_asing: string;
  nominal_asing: string;
  kurs: string;
  currency_id_rupiah: string;
  nominal_rupiah: string;
  nominal_sisa: string;
  tanggal_transaksi: string;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
  currency_asing: ICurrency;
  currency_rupiah: ICurrency;
  source: IPaymentSources;
  coa: ICoa;
}

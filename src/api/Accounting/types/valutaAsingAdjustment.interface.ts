import type { IPaymentSources } from "../../Master/types/paymentSources.interface";
import type { ICoa } from "./coa.interface";
import type { ICurrency } from "./currency.interface";

export interface IValutaAsingAdjustment {
  coa_id: string;
  currency_id_asing: string;
  saldo_va: string;
  saldo_rupiah: string;
  currency: ICurrency;
  coa: ICoa;
  source: IPaymentSources;
}

export interface IValutaAsingAdjustmentDetail {
  id: number;
  code: string;
  coa_id: string;
  payment_source_id: string;
  currency_id_asing: string;
  nominal_asing: string;
  kurs: string;
  nominal_rupiah: string;
  nominal_sisa: string;
  created_by: string;
  created_at: Date;
  updated_at: null;
  updated_by: null;
  currency: ICurrency;
  coa: ICoa;
}

export interface IValutaAsingAdjustmentHistory {
  id: number;
  nomor_transaksi: string;
  transaction_type: string;
  currency_id: string;
  saldo_va: string;
  saldo_rupiah_lama: string;
  saldo_rupiah_baru: string;
  selisih_saldo_rupiah: string;
  keterangan: string;
  tanggal_adjust: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
  currency: ICurrency;
  transactions: IValutaAsingAdjustmentTransaction[];
}

export interface IValutaAsingAdjustmentTransaction {
  id: number;
  valuta_asing_adjustment_id: string;
  transaction_type: string;
  source_id: string;
  coa_source_id: string;
  currency_id: string;
  kurs: string;
  saldo_va: string;
  saldo_rupiah_lama: string;
  saldo_rupiah?: string;
  saldo_rupiah_baru: string;
  selisih_saldo_rupiah: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  updated_by: null;
  currency: ICurrency;
  source: IPaymentSources;
}

export interface IValutaAsingAdjustmentJournal {
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

export interface IValutaAsingAdjustmentJournalDetail {
  data: IValutaAsingAdjustmentJournalDetailData;
  journal: IValutaAsingAdjustmentJournalDetailTransaction[];
}

export interface IValutaAsingAdjustmentJournalDetailData {
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

export interface IValutaAsingAdjustmentJournalDetailTransaction {
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

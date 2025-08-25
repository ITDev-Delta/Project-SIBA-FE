import type { ICurrency } from "../../Accounting/types/currency.interface";

export interface IPaymentSources {
  id: number;
  nama_sumber_pembayaran: string;
  kode_sumber_pembayaran: string;
  currency: Partial<ICurrency>;
  currency_id: string;
  atas_nama: string;
  no_rekening: string;
  coa_id: string;
  coa_account: string;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPaymentSourcesDetail {
  payment_sources: IPaymentSourcesData;
}

export interface IPaymentSourcesData {
  id: number;
  nama_sumber_pembayaran: string;
  kode_sumber_pembayaran: string;
  currency: Partial<ICurrency>;
  currency_id: string;
  atas_nama: string;
  no_rekening: string;
  coa_id: string;
  coa_account: string;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  audit_trail: IPaymentSourcesAudit[];
}

export interface IPaymentSourcesAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<IPaymentSources>;
  old_data: Partial<IPaymentSources>;
  created_at: Date;
  updated_at: Date;
}

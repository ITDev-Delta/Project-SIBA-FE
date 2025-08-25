import type { ICurrency } from "../../Accounting/types/currency.interface";

export interface ICustomer {
  id: number;
  nama_customer: string;
  kode_customer: string;
  customer_type: string;
  customer_group: string;
  alamat_customer: string;
  is_pkp: number | string;
  is_active: number | string;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface ICustomerDetail {
  master_customer: IDetailCustomer;
  master_customer_coa: ICustomerCoa;
  master_customer_pajak: ICustomerPajak[] | [];
  master_customer_contact_person: ICustomerContact[] | [];
  master_currency: ICustomerCurrency[] | [];
  master_shipment_address: ICustomerShipmentAddress[];
}

export interface IDetailCustomer {
  id: number;
  nama_customer: string;
  kode_customer: string;
  customer_type: string;
  customer_group: string;
  nomor_telepon?: string | null;
  email?: string | null;
  negara?: string | null;
  provinsi?: string | null;
  kota?: string | null;
  kode_pos: string;
  alamat_customer: string;
  memo?: string | null;
  is_pkp: number | string;
  is_active: number | string;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  audit_trail: ICustomerAudit[] | [];
}

export interface ICustomerCoa {
  id: number;
  customer_id?: number | string;
  coa_hutang_id: number | string;
  coa_hutang_account: string | undefined;
  batas_hutang: string;
  coa_piutang_id: number | string;
  coa_piutang_account: string | undefined;
  batas_piutang: string;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  audit_trail?: ICustomerAudit[] | [];
}

export interface ICustomerPajak {
  id: number;
  customer_id?: number | string;
  nomor_npwp: string;
  nama_npwp: string;
  master_pajak_id: number;
  jenis_pajak: string;
  coa_id: number;
  coa_account: string | undefined;
  tarif_pajak: string;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  audit_trail?: ICustomerAudit[] | [];
}

export interface ICustomerContact {
  id: number;
  customer_id?: number | string;
  nama: string;
  no_telp: string;
  email: string;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  audit_trail?: ICustomerAudit[] | [];
}

export interface ICustomerCurrency {
  id: number;
  customer_id?: number | string;
  currency: ICurrency;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  audit_trail?: ICustomerAudit[] | [];
  currency_id?: string;
}

export interface ICustomerAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<ICustomer>;
  old_data: Partial<ICustomer>;
  created_at: Date;
  updated_at: Date;
}

export interface ICustomerShipmentAddress {
  id?: number;
  customer_id?: string;
  email: string;
  no_telp?: string | null;
  alamat_lengkap?: string;
  created_by?: string;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
  audit_trail?: ICustomerAudit[] | [];
}

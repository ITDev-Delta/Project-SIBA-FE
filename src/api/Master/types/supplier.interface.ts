import type { ICurrency } from "../../Accounting/types/currency.interface";

export interface ISupplier {
  id: number;
  nama_supplier: string;
  kode_supplier: string;
  supplier_type: string;
  supplier_group: string;
  is_pkp: number | string;
  is_active: number | string;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface IDetailSupplier {
  id: number;
  nama_supplier: string;
  kode_supplier: string;
  supplier_type: string;
  supplier_group: string;
  nomor_telepon?: string | null;
  email?: string | null;
  negara?: string | null;
  provinsi?: string | null;
  kota?: string | null;
  kode_pos: string;
  alamat_supplier: string;
  memo?: string | null;
  is_pkp: number | string;
  is_active: number | string;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  audit_trail: ISupplierAudit[] | [];
}

export interface ISupplierDetail {
  master_supplier: IDetailSupplier;
  master_supplier_coa: ISupplierCoa;
  master_supplier_pajak: ISupplierPajak[] | [];
  master_supplier_contact_person: ISupplierContact[] | [];
  master_currency: ISupplierCurrency[] | [];
}

type NumberString = number | string;

export interface ISupplierCoa {
  id: number;
  supplier_id?: number | string;
  coa_hutang_id: NumberString;
  coa_hutang_account: string | undefined;
  batas_hutang: string;
  coa_piutang_id: NumberString;
  coa_piutang_account: string | undefined;
  batas_piutang: string;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  audit_trail?: ISupplierAudit[] | [];
}

export interface ISupplierPajak {
  id: number;
  supplier_id?: NumberString;
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
  audit_trail?: ISupplierAudit[] | [];
}

export interface ISupplierContact {
  id: number;
  supplier_id?: NumberString;
  nama: string;
  no_telp: string;
  email: string;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  audit_trail?: ISupplierAudit[] | [];
}

export interface ISupplierCurrency {
  id: number;
  supplier_id?: number | string;
  currency: ICurrency;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  audit_trail?: ISupplierAudit[] | [];
  currency_id?: string;
}

export interface ISupplierAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<
    ISupplier | ISupplierCoa | ISupplierPajak | ISupplierContact
  >;
  old_data: Partial<
    ISupplier | ISupplierCoa | ISupplierPajak | ISupplierContact
  >;
  created_at?: Date | null;
  updated_at?: Date | null;
}

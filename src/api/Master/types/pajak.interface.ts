import type { ICoa } from "../../Accounting/types/coa.interface";

export interface IPajak {
  id: number;
  jenis_pajak: string;
  kode_pajak: string;
  tarif_pajak: string;
  objek_pajak: string;
  coa_id: string;
  coa: ICoa;
  is_active: string;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPajakDetail {
  id: number;
  jenis_pajak: string;
  kode_pajak: string;
  tarif_pajak: string;
  objek_pajak: string;
  coa_id: string;
  coa_account: string;
  is_active: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  audit_trail: IPajakAudit[];
}

export interface IPajakAudit {
  id: number;
  user: string;
  event: string;
  table_name: string;
  new_data: Partial<IPajak>;
  old_data: Partial<IPajak>;
  created_at: Date;
  updated_at: Date;
}

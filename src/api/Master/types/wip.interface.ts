import type { ICoa } from "../../Accounting/types/coa.interface";

export interface IWip {
  id: number;
  nama_akun_wip: string;
  kode_akun_wip: string;
  coa_id: string;
  coa_account: string;
  is_active: string;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string | null;
  coa: Partial<ICoa>;
}

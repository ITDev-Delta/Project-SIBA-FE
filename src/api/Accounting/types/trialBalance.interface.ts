export interface ITrialBalanceResponse {
  trial_balance: TrialBalanceData[];
  total_mutasi: TotalMutasi;
  tanggal_mulai: string;
  tanggal_akhir: string;
}

export interface TrialBalanceData {
  data: ITrialBalance[];
  kategori: string;
  total_saldo_awal: number;
  total_debit: number;
  total_kredit: number;
  total_saldo_akhir: number;
}

export interface ITrialBalance {
  id: number;
  nama_akun: string;
  level: string;
  parent: any;
  kategori: string;
  kode_akun: string;
  saldo_awal: number;
  total_debit: number;
  total_kredit: number;
  saldo_akhir: number;
  children?: ITrialBalance[];
}

export interface TotalMutasi {
  total_debit: number;
  total_kredit: number;
}
